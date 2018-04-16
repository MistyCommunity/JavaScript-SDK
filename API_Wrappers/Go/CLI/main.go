package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/spf13/cobra"
)

// IPAddr is the IP address of the robot. Set by the -i flag.
// You can also set an environment variable WOZ_IP to avoid needing
// to provide the IP address on every use of the CLI.
var IPAddr string

// ShowDebugOutput is set by the -d flag.
var ShowDebugOutput bool

func main() {
	var cmdLED = &cobra.Command{
		Use:   "led [red] [green] [blue]",
		Short: "Set LED color",
		Long:  `Let there be light.`,
		Args:  cobra.MinimumNArgs(3),
		Run: func(cmd *cobra.Command, args []string) {
			msg := fmt.Sprintf(`{"red":%s,"green":%s,"blue":%s}`,
				args[0], args[1], args[2])

			sendRobotCommand("ChangeLED", msg)
		},
	}

	var cmdMapping = &cobra.Command{
		Use:   "map",
		Short: "Control SLAM mapping system",
		Long:  `Control the SLAM mapping system.`,
	}

	var cmdMappingStart = &cobra.Command{
		Use:   "start",
		Short: "Start SLAM mapping",
		Long:  `Start the SLAM mapping system.`,
		Run: func(cmd *cobra.Command, args []string) {
			sendRobotCommand("SlamStartMapping", "{}")
		},
	}

	var cmdMappingStop = &cobra.Command{
		Use:   "stop",
		Short: "Stop SLAM mapping",
		Long:  `Stop the SLAM mapping system.`,
		Run: func(cmd *cobra.Command, args []string) {
			sendRobotCommand("SlamStopMapping", "{}")
		},
	}

	var cmdFollow = &cobra.Command{
		Use:   "follow [path (x:y,x:y,...)]",
		Short: "Follow map path",
		Long:  `Follow a path of nodes that have been previously mapped.`,
		Args:  cobra.MinimumNArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			msg := fmt.Sprintf(`{"path":"%s"}`, args[0])

			sendRobotCommand("FollowPath", msg)
		},
	}

	cmdMapping.AddCommand(cmdMappingStart, cmdMappingStop, cmdFollow)

	var cmdTracking = &cobra.Command{
		Use:   "tracking",
		Short: "Control SLAM tracking system",
		Long:  `Control tracking based on the current SLAM map.`,
	}

	var cmdTrackingStart = &cobra.Command{
		Use:   "start",
		Short: "Start map tracking",
		Long:  `Start tracking based on the current SLAM map.`,
		Run: func(cmd *cobra.Command, args []string) {
			sendRobotCommand("SlamStartTracking", "{}")
		},
	}

	var cmdTrackingStop = &cobra.Command{
		Use:   "stop",
		Short: "Stop map tracking",
		Long:  `Stop tracking based on the current SLAM map.`,
		Run: func(cmd *cobra.Command, args []string) {
			sendRobotCommand("SlamStopTracking", "{}")
		},
	}

	cmdTracking.AddCommand(cmdTrackingStart, cmdTrackingStop)

	var cmdSensors = &cobra.Command{
		Use:   "sensors",
		Short: "Show sensor readings",
		Long:  `Show sensor readings`,
		Args:  cobra.MinimumNArgs(0),
		Run: func(cmd *cobra.Command, args []string) {
			result, _ := sendRobotCommand("GetStringSensorReadings", "{}")
			if result != "" {
				fmt.Println(result)
			}
		},
	}

	var cmdSpeech = &cobra.Command{
		Use:   "say [voice (M/F)] [text to say]",
		Short: "Say something",
		Long:  `Say something using the Text-To-Speech system.`,
		Args:  cobra.MinimumNArgs(2),
		Run: func(cmd *cobra.Command, args []string) {
			msg := fmt.Sprintf(`{"voice":"%s","message":"%s"}`,
				args[0], args[1])

			sendRobotCommand("perform_text_to_speech", msg)
		},
	}

	var cmdSound = &cobra.Command{
		Use:   "sound",
		Short: "Play and list available sounds",
		Long:  `Play and list the available sounds on the robot.`,
	}

	var cmdSoundPlay = &cobra.Command{
		Use:   "play [sound file name]",
		Short: "Play a sound",
		Long:  `Play a sound file`,
		Args:  cobra.MinimumNArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			msg := fmt.Sprintf(`{"AssetId":"%s"}`, args[0])

			sendRobotCommand("PlayAudioClip", msg)
		},
	}

	var cmdSoundList = &cobra.Command{
		Use:   "list",
		Short: "List sounds on robot",
		Long:  `List sounds available on robot`,
		Args:  cobra.MinimumNArgs(0),
		Run: func(cmd *cobra.Command, args []string) {
			result, _ := sendRobotCommand("GetListOfAudioFiles", "{}")
			if result != "" {
				fmt.Println(result)
			}
		},
	}

	cmdSound.AddCommand(cmdSoundPlay, cmdSoundList)

	var cmdMove = &cobra.Command{
		Use:   "move [direction (F/B/L/R)] [speed (0-10)] [TimeMs (in ms)]",
		Short: "Move the robot",
		Long:  `You got to move it, move it.`,
		Args:  cobra.MinimumNArgs(3),
		Run: func(cmd *cobra.Command, args []string) {
			var direction string
			switch args[0] {
			case "F", "f", "forward":
				direction = fmt.Sprintf(`{"LinearVelocity":%s,"AngularVelocity":0,"TimeMs":%s}`,
					args[1], args[2])
			case "B", "b", "backward":
				direction = fmt.Sprintf(`{"LinearVelocity":-%s,"AngularVelocity":0,"TimeMs":%s}`,
					args[1], args[2])
			case "L", "l", "left":
				direction = fmt.Sprintf(`{"LinearVelocity":0,"AngularVelocity":%s,"Degree":45,"TimeMs":%s}`,
					args[1], args[2])
			case "R", "r", "right":
				direction = fmt.Sprintf(`{"LinearVelocity":0,"AngularVelocity":%s,"Degree":315,"TimeMs":%s}`,
					args[1], args[2])
			}

			sendRobotCommand("DriveTime", direction)
		},
	}

	var cmdPause = &cobra.Command{
		Use:   "pause [TimeMs (in ms)]",
		Short: "Pause the robot movement",
		Long:  `Pause the robot movement.`,
		Args:  cobra.MinimumNArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			pause := fmt.Sprintf(`{"LinearVelocity":0,"AngularVelocity":0,"TimeMs":%s}`, args[1])

			sendRobotCommand("DriveTime", pause)
		},
	}

	var cmdArm = &cobra.Command{
		Use:   "arm [which (L/R)] [position (0-10)] [velocity (0-10)]",
		Short: "Move the robot arm",
		Long:  `Move robot arm into specific position.`,
		Args:  cobra.MinimumNArgs(3),
		Run: func(cmd *cobra.Command, args []string) {
			direction := fmt.Sprintf(`{"arm":%s,"position":%s,"velocity":%s}`,
				args[0], args[1], args[2])

			sendRobotCommand("MoveArm", direction)
		},
	}

	var cmdHead = &cobra.Command{
		Use:   "head",
		Short: "Move the robot head",
		Long:  `Move robot head.`,
	}

	var cmdHeadMove = &cobra.Command{
		Use:   "move [position] [velocity (0-10)]",
		Short: "Move the robot head",
		Long: `Move robot head into specific position. Options are:
right, left, center, down, up.`,
		Args: cobra.MinimumNArgs(2),
		Run: func(cmd *cobra.Command, args []string) {
			var position int
			switch args[0] {
			case "right", "r":
				position = 0
			case "left", "l":
				position = 1
			case "center", "c":
				position = 2
			case "down", "d":
				position = 3
			case "up", "u":
				position = 4
			default:
				position = 2
			}

			direction := fmt.Sprintf(`{"location":%d,"velocity":%s}`,
				position, args[1])

			sendRobotCommand("MoveHeadToLocation", direction)
		},
	}

	var cmdHeadPosition = &cobra.Command{
		Use:   "position [axis (yaw/pitch/roll)] [position (-5-+5)] [velocity (0-10)]",
		Short: "Position the robot head",
		Long:  `Position robot head to specific position.`,
		Args:  cobra.MinimumNArgs(3),
		Run: func(cmd *cobra.Command, args []string) {
			var axis int
			switch args[0] {
			case "yaw", "y":
				axis = 1
			case "pitch", "p":
				axis = 2
			case "roll", "r":
				axis = 3
			default:
				axis = 1 // default to yaw
			}

			position := fmt.Sprintf(`{"axis":%d,"position":%s,"velocity":%s}`,
				axis, args[1], args[2])

			sendRobotCommand("SetHeadPosition", position)
		},
	}

	cmdHead.AddCommand(cmdHeadMove, cmdHeadPosition)

	var cmdEyes = &cobra.Command{
		Use:   "eyes [expression]",
		Short: "Set eyes to a specific expression",
		Long: `Set eyes to specific expression. Options are:
sad, angry, tired, curious, content, surprise, calm, jubilation.`,
		Args: cobra.MinimumNArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			var expression string
			switch args[0] {
			case "Sad", "sad":
				expression = getExpression(-0.5, -0.5, -0.5)
			case "Angry", "angry":
				expression = getExpression(-0.5, 0.5, 0.5)
			case "Tired", "tired":
				expression = getExpression(0.0, -0.5, -0.5)
			case "Curious", "curious":
				expression = getExpression(0.0, 0.0, -0.5)
			case "Content", "content":
				expression = getExpression(0.0, 0.0, 0.5)
			case "Surprise", "surprise":
				expression = getExpression(0.0, 0.5, 0.0)
			case "Calm", "calm":
				expression = getExpression(0.5, -0.5, -0.5)
			case "Jubilation", "jubilation":
				expression = getExpression(0.5, 0.5, -0.5)
			}

			sendRobotCommand("ChangeEyes", expression)
		},
	}

	var rootCmd = &cobra.Command{Use: "woz"}

	rootCmd.PersistentFlags().StringVarP(&IPAddr, "ipaddr", "i", "", "ip addr for robot")
	if os.Getenv("WOZ_IP") != "" && IPAddr == "" {
		IPAddr = os.Getenv("WOZ_IP")
	}

	rootCmd.PersistentFlags().BoolVarP(&ShowDebugOutput, "debug", "d", false, "show debug output")

	rootCmd.AddCommand(cmdLED,
		cmdMapping,
		cmdTracking,
		cmdSensors,
		cmdSpeech,
		cmdSound,
		cmdMove,
		cmdPause,
		cmdArm,
		cmdHead,
		cmdEyes)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

// getExpression returns the JSON string payload for an eye expression.
func getExpression(v float32, a float32, d float32) string {
	return fmt.Sprintf(`{"Valence":%f,"Arousal":%f,"Dominance":%f}`, v, a, d)
}

// sendRobotCommand composes the needed json string payload, then calls the
// REST api. Returns nill on success, otherwise returns the error.
func sendRobotCommand(cmd string, parms string) (result string, err error) {
	url := "http://" + IPAddr + ":2010/api/" + cmd

	var jsonStr = []byte(parms)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	res, _ := ioutil.ReadAll(resp.Body)
	result = string(res)

	if ShowDebugOutput {
		fmt.Println(url)
		fmt.Println(parms)
		fmt.Println("response Status:", resp.Status)
		fmt.Println("response Headers:", resp.Header)
		fmt.Println("response Body:", result)
	}
	fmt.Println("OK")

	return
}
