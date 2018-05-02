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

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace APIExplorer
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        const int kWebSocketPort = 80;

        Misty currentMisty = new Misty();

        MistyFinder mistyFinder = new MistyFinder();
        const string kIPKey = "ManualIPAddress";
        public int SelectedIndex { get; set; } = -1;

        public MainPage()
        {
            this.InitializeComponent();
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            Windows.Storage.ApplicationDataContainer localSettings = Windows.Storage.ApplicationData.Current.LocalSettings;
            var manualIpAddress = localSettings.Values[kIPKey] as string;
            if (!String.IsNullOrEmpty(manualIpAddress))
            {
                ManualIPEntry.Text = manualIpAddress;
            }

            mistyFinder.start();
            ManualIPEntry.KeyUp += ManualIPEntry_KeyUp;
        }

        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            base.OnNavigatedFrom(e);

            mistyFinder.stop();
        }

        private async void ConnectButton_Click(object sender, RoutedEventArgs e)
        {
            if (!String.IsNullOrEmpty(ManualIPEntry.Text))
            {
                await currentMisty.ConnectAsync(ManualIPEntry.Text, kWebSocketPort);
            }
            else if (SelectedIndex > -1)
            {
                var instance = mistyFinder.MistyInstances[SelectedIndex];
                await currentMisty.ConnectAsync(instance.IpAddress, kWebSocketPort);
            }
            else
            {
                await new MessageDialog("Please Enter a connection string - either IP Address or Name", "Cannot connect").ShowAsync();
            }
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




    }
}
