using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Data.Json;
using Windows.Foundation;
using Windows.Security.Credentials;
using Windows.Security.Cryptography;
using Windows.Storage.Streams;
using Windows.Web.Http;
using Windows.Web.Http.Filters;
using Windows.Web.Http.Headers;
using Windows.UI;

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
        const string kEndpointChangeEyes = "/api/ChangeEyes";
        const string kEndpointChangeLED = "/api/ChangeLED";

        const string kTimeout = "500"; // ms

        HttpClient httpClient;
        string ip;
        int port;

        private struct RemoteServerStringStatus
        {
            public HttpStatusCode statusCode;
            public string response;
        }

        private struct RemoteServerJsonStatus
        {
            public HttpStatusCode statusCode;
            public JsonObject json;
        }

        public bool IsConnected
        {
            get
            {
                return httpClient != null;
            }
        }

        public IAsyncOperation<HttpStatusCode> ConnectAsync(string ip, int port)
        {
            return ConnectAsyncTask(ip, port).AsAsyncOperation<HttpStatusCode>();
        }

        public IAsyncOperation<HttpStatusCode> SetMoodAsync(Moods mood)
        {
            return setMoodTask(mood).AsAsyncOperation<HttpStatusCode>();
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
                return jsonResp.statusCode;
            }

            var information = jsonResp.json.GetObject();
            // todo: parse

            return HttpStatusCode.Ok;
        }

        public void disconnect()
        {
            httpClient?.Dispose();
            httpClient = null;
        }

        internal async Task<HttpStatusCode> setMoodTask(Moods mood)
        {
            return await setLEDTask(moods[mood].ledColor);
        }

        internal async Task<HttpStatusCode> setLEDTask(Color color)
        {
            var builder = new UriBuilder();
            builder.Host = ip;
            builder.Port = port;
            builder.Path = kEndpointChangeLED;

            JsonObject obj = new JsonObject();
            obj.SetNamedValue("red", JsonValue.CreateNumberValue(color.R));
            obj.SetNamedValue("green", JsonValue.CreateNumberValue(color.G));
            obj.SetNamedValue("blue", JsonValue.CreateNumberValue(color.B));

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
                JsonObject.TryParse(stringResp.response, out resp.json);
            }

            return resp;
        }
    }
}
