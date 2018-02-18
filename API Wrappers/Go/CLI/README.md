# Woz CLI

Experimental command line interface for Woz. Works on Windows, OS X, and Linux.

Requires that Woz be connected via WiFi to the same network as the user running the CLI. The CLI uses the REST API to call the robot to do things.

Looking for the latest pre-built binaries? Go to:
 
https://github.com/MistyPioneers/Woz1/CLI/Releases

Download the version for your OS, unzip it, and just run it from the command line. No install needed.

## How to use

        ./woz
        Usage:
            woz [command]

        Available Commands:
            arm         Move the robot arm
            eyes        Set eyes to a specific expression
            head        Move the robot head
            help        Help about any command
            led         Set LED color
            map         Control SLAM mapping system
            move        Move the robot
            pause       Pause the robot movement
            say         Say something
            sensors     Show sensor readings
            sound       Play and list available sounds
            tracking    Control SLAM tracking system

        Flags:
            -d, --debug           show debug output
            -h, --help            help for misty
            -i, --ipaddr string   ip addr for robot

        Use "woz [command] --help" for more information about a command.

### Configuration

You can also set the `WOZ_IP` environment variable, so you do not have to keep entering it in as a flag to every command.

#### Windows

        set WOZ_IP=192.168.1.51

#### OS X/Linux

        export WOZ_IP=192.168.1.51

## How to build

If you need to build from source, you must have installed Go. You can cross-compile a standalone binary of the Woz CLI for each platform from any computer, by using the following commands.

### Windows

        GOOS=windows go build -o woz.exe main.go

### OS X

        GOOS=darwin go build -o woz main.go

### Linux

        GOOS=linux go build -o woz main.go


Users do not need to have installed Go to use the standalone binary CLI built by the above command.
