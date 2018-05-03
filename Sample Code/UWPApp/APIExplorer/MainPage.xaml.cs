using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using MistyAPI;
using Windows.System;
using Windows.UI.Popups;
using System.Threading.Tasks;
using Windows.UI;
using System.Diagnostics;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace APIExplorer
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        const int kWebSocketPort = 80;

        // API explorer only supports 1 misty at a time.
        Misty currentMisty = null;

        MistyFinder mistyFinder = new MistyFinder();
        const string kIPKey = "ManualIPAddress";
        public int SelectedIndex { get; set; } = -1;
        public int SelectedMood { get; set; } = -1;

        public MainPage()
        {
            this.InitializeComponent();
            var moods = Enum.GetValues(typeof(MistyAPI.Moods)).Cast<MistyAPI.Moods>();
            MoodList.ItemsSource = moods.ToList();

            this.Loaded += MainPage_Loaded;
            this.Unloaded += MainPage_Unloaded;
        }

        private void MainPage_Unloaded(object sender, RoutedEventArgs e)
        {
            mistyFinder.stop();
        }

        private void MainPage_Loaded(object sender, RoutedEventArgs e)
        {
            Windows.Storage.ApplicationDataContainer localSettings = Windows.Storage.ApplicationData.Current.LocalSettings;
            var manualIpAddress = localSettings.Values[kIPKey] as string;
            if (!String.IsNullOrEmpty(manualIpAddress))
            {
                ManualIPEntry.Text = manualIpAddress;
            }

            mistyFinder.start();
            ManualIPEntry.KeyUp += ManualIPEntry_KeyUp;
        }

        private async void ConnectButton_Click(object sender, RoutedEventArgs e)
        {
            if (currentMisty != null && currentMisty.IsConnected)
            {
                currentMisty.disconnect();
                currentMisty = null;
            }
            else
            {
                if (!String.IsNullOrEmpty(ManualIPEntry.Text))
                {
                    await ConnectToMisty(ManualIPEntry.Text);
                }
                else if (SelectedIndex > -1)
                {
                    var instance = mistyFinder.MistyInstances[SelectedIndex];
                    await ConnectToMisty(instance.IpAddress);
                }
                else
                {
                    await new MessageDialog("Please Enter a connection string - either IP Address or Name", "Cannot connect").ShowAsync();
                }
            }
        }

        private async Task ConnectToMisty(string ip)
        {
            currentMisty = new Misty();
            currentMisty.Connected += CurrentMisty_Connected;
            currentMisty.Disconnected += CurrentMisty_Disconnected;

            Windows.Storage.ApplicationDataContainer localSettings = Windows.Storage.ApplicationData.Current.LocalSettings;
            localSettings.Values[kIPKey] = ip;

            await currentMisty.ConnectAsync(ip, kWebSocketPort);
        }

        private void CurrentMisty_Disconnected(Misty misty)
        {
            ConnectionState.Fill = new SolidColorBrush(Colors.Red);
            currentMisty = null;
            ConnectButton.Content = "Connect";
        }

        private void CurrentMisty_Connected(Misty misty)
        {
            ConnectionState.Fill = new SolidColorBrush(Colors.Green);
            ConnectButton.Content = "Disconnect";

            Debug.WriteLine("Misty Serial Number - " + currentMisty.SerialNumber);
        }

        private async void ManualIPEntry_KeyUp(object sender, KeyRoutedEventArgs e)
        {
            if (e.Key == VirtualKey.Enter)
            {
                if (!String.IsNullOrEmpty(ManualIPEntry.Text))
                {
                    await currentMisty.ConnectAsync(ManualIPEntry.Text, kWebSocketPort);
                }
            }
        }

        private void ConnectSelection_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Combo Box changes should clear the manual entry
            ManualIPEntry.Text = "";
        }

        private async void MoodSelection_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (currentMisty != null)
            {
                var selectedMood = MoodList.SelectedItem;
                await currentMisty.SetMoodAsync((Moods)selectedMood);
            }
        }
    }
}
