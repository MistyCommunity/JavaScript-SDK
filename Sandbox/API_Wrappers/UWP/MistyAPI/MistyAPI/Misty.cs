/*
**WARRANTY DISCLAIMER.**

* General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Security.Credentials;
using Windows.Security.Cryptography;
using Windows.Storage.Streams;
using Windows.Web.Http;
using Windows.Web.Http.Filters;
using Windows.Web.Http.Headers;
using Windows.UI;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace MistyAPI
{
    public enum Moods
    {
        Sad,
        Angry,
        Groggy,
        Confused,
        Content,
        Concerned,
        Unamused,
        Happy,
        Love
    };

    public delegate void MistyConnectedHandler(Misty misty);
    public delegate void MistyDisconnectedHandler(Misty misty);


    public sealed class Misty
    {
        internal struct Mood
        {
            public Color ledColor;
            public int valence;
            public int arousal;
            public int dominance;
        };

        internal readonly Dictionary<Moods, Mood> moods = new Dictionary<Moods, Mood>()
        {
            { Moods.Sad, new Mood () { ledColor = ColorHelper.FromArgb(255, 15, 160, 250), valence = -1, arousal = -1, dominance = 0 } },
            { Moods.Angry,  new Mood() {ledColor = ColorHelper.FromArgb(255, 160, 20, 20), valence = -1, arousal = 1, dominance = 0 } },
            { Moods.Groggy, new Mood() {ledColor = ColorHelper.FromArgb(255, 210, 215, 220), valence = 0, arousal = -1, dominance = 0 } },
            { Moods.Confused, new Mood() {ledColor = ColorHelper.FromArgb(255, 130, 15, 250), valence = 1, arousal = 0, dominance = 0 } },
            { Moods.Content, new Mood() {ledColor = ColorHelper.FromArgb(255, 15, 190, 70), valence = 0, arousal = 0, dominance = 0 } },
            { Moods.Concerned, new Mood() {ledColor = ColorHelper.FromArgb(255, 50, 115, 180), valence = 0, arousal = 1, dominance = 0 } },
            { Moods.Unamused, new Mood() {ledColor = ColorHelper.FromArgb(255, 185, 185, 130), valence = 1, arousal = -1, dominance = 0 } },
            { Moods.Happy, new Mood() {ledColor = ColorHelper.FromArgb(255, 250, 245, 15), valence = 1, arousal = 1, dominance = 0 } },
            { Moods.Love, new Mood() {ledColor = ColorHelper.FromArgb(255, 240, 90, 90), valence = 1, arousal = 1, dominance = 1 } },
        };

        const string kEndpointDeviceInfo = "/api/info/device";
        const string kEndpointChangeEyes = "/api/eyes/change";
        const string kEndpointChangeLED = "/api/led/change";

        const string kTimeout = "500"; // ms

        HttpClient httpClient;
        string ip;
        int port;

        public event MistyConnectedHandler Connected;
        public event MistyDisconnectedHandler Disconnected;

        private struct RemoteServerStringStatus
        {
            public HttpStatusCode statusCode;
            public string response;
        }

        private struct RemoteServerJsonStatus
        {
            public HttpStatusCode statusCode;
            public JObject json;
        }

        public bool IsConnected
        {
            get
            {
                return httpClient != null;
            }
        }

        public string SerialNumber
        {
            get; internal set;
        } = "";

        public string RobotVersion
        {
            get; internal set;
        } = "";

        public string OSVersion
        {
            get; internal set;
        } = "";


        public IAsyncOperation<HttpStatusCode> ConnectAsync(string ip, int port)
        {
            return ConnectAsyncTask(ip, port).AsAsyncOperation<HttpStatusCode>();
        }

        public IAsyncOperation<HttpStatusCode> SetMoodAsync(Moods mood)
        {
            return setMoodTask(mood).AsAsyncOperation<HttpStatusCode>();
        }

        public IAsyncOperation<HttpStatusCode> SetEyesAsync(Moods mood)
        {
            return setEyesTask(moods[mood].valence, moods[mood].arousal, moods[mood].dominance).AsAsyncOperation<HttpStatusCode>();
        }

        public IAsyncOperation<HttpStatusCode> SetLEDAsync(Color color)
        {
            return setLEDTask(color).AsAsyncOperation<HttpStatusCode>();
        }

        internal async Task<HttpStatusCode> ConnectAsyncTask(string ip, int port)
        {
            disconnect();

            var myFilter = new HttpBaseProtocolFilter();
            myFilter.AllowUI = false;
            myFilter.AllowAutoRedirect = false;
            //myFilter.ServerCredential = new PasswordCredential("root", username, password);

            httpClient = new HttpClient(myFilter);
            this.ip = ip;
            this.port = port;

            var jsonResp = await requestJson(kEndpointDeviceInfo);
            if (jsonResp.statusCode != HttpStatusCode.Ok)
            {
                Disconnected?.Invoke(this);
                return jsonResp.statusCode;
            }

            var result = jsonResp.json.Value<JObject>("result");

            RobotVersion = result.Value<string>("robotVersion");
            OSVersion = result.Value<string>("windowsOSVersion");
            SerialNumber = result.Value<string>("serialNumber");

            Connected?.Invoke(this);

            return HttpStatusCode.Ok;
        }

        public void disconnect()
        {
            if (httpClient != null)
            {
                Disconnected?.Invoke(this);

                httpClient?.Dispose();
                httpClient = null;
            }
        }

        internal async Task<HttpStatusCode> setMoodTask(Moods mood)
        {
            await setEyesTask(moods[mood].valence, moods[mood].arousal, moods[mood].dominance);
            return await setLEDTask(moods[mood].ledColor);
        }

        internal async Task<HttpStatusCode> setEyesTask(int valence, int arousal, int dominance)
        {
            var builder = new UriBuilder();
            builder.Host = ip;
            builder.Port = port;
            builder.Path = kEndpointChangeEyes;

            JObject obj = new JObject
                (
                    new JProperty("Valence", new JValue(valence)),
                    new JProperty("Arousal", new JValue(arousal)),
                    new JProperty("Dominance", new JValue(dominance))
                );

            var jsonString = obj.ToString();
            var content = new HttpStringContent(jsonString);
            var response = await httpClient.PostAsync(builder.Uri, content);

            return response.StatusCode;
        }

        internal async Task<HttpStatusCode> setLEDTask(Color color)
        {
            var builder = new UriBuilder();
            builder.Host = ip;
            builder.Port = port;
            builder.Path = kEndpointChangeLED;

            JObject obj = new JObject
                (
                    new JProperty("red", new JValue(color.R)),
                    new JProperty("green", new JValue(color.G)),
                    new JProperty("blue", new JValue(color.B))
                );

            var content = new HttpStringContent(obj.ToString());
            var response = await httpClient.PostAsync(builder.Uri, content);

            return response.StatusCode;
        }

        private async Task<RemoteServerStringStatus> requestString(string endpoint)
        {
            var resp = new RemoteServerStringStatus();

            var builder = new UriBuilder();
            builder.Host = ip;
            builder.Port = port;
            builder.Path = endpoint;

            var response = await httpClient.GetAsync(builder.Uri);
            resp.statusCode = response.StatusCode;
            resp.response = await response.Content.ReadAsStringAsync();

            return resp;
        }

        private async Task<RemoteServerJsonStatus> requestJson(string endpoint)
        {
            var resp = new RemoteServerJsonStatus();
            var stringResp = await requestString(endpoint);
            resp.statusCode = stringResp.statusCode;
            if (stringResp.statusCode == HttpStatusCode.Ok)
            {
                try
                {
                    JArray array = JArray.Parse(stringResp.response);
                    resp.json = array[0] as JObject;
                }
                catch (Exception e)
                {
                    Debug.WriteLine(e.Message + ": " + e.StackTrace);
                }
            }

            return resp;
        }
    }
}
