
// **WARRANTY DISCLAIMER.**

// * General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
// * Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.

// Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Devices.Enumeration;
using Windows.Networking.ServiceDiscovery.Dnssd;
using Windows.Networking.Sockets;
using Windows.Networking;
using Windows.Networking.Connectivity;
using System.Diagnostics;
using System.ComponentModel;
using System.Collections.ObjectModel;

namespace APIExplorer
{
    internal class MistyFinder : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        public ObservableCollection<MistyInstance> MistyInstances = new ObservableCollection<MistyInstance>();
        public Dictionary<string, MistyInstance> MistyInstanceMap = new Dictionary<string, MistyInstance>();
        DeviceWatcher watcher = null;

        public MistyFinder()
        {

        }

        public void start()
        {
            string queryString = "System.Devices.AepService.ProtocolId:={4526e8c1-8aac-4153-9b16-55e86ada0e54}" +
                "AND System.Devices.Dnssd.Domain:=\"local\"" +
                "AND System.Devices.Dnssd.ServiceName:=\"_sshsvc._tcp\"";

            watcher = DeviceInformation.CreateWatcher(
                queryString,
                new string[]
                    {
                        "System.Devices.Dnssd.HostName",
                        "System.Devices.Dnssd.ServiceName",
                        "System.Devices.IpAddress"
                    },
                DeviceInformationKind.AssociationEndpointService);

            watcher.Removed += async (DeviceWatcher deviceSender, DeviceInformationUpdate args) =>
            {
                await Windows.ApplicationModel.Core.CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal,
                () =>
                {
                    if (MistyInstanceMap.ContainsKey(args.Id) == true)
                    {
                        MistyInstances.Remove(MistyInstanceMap[args.Id]);
                        MistyInstanceMap.Remove(args.Id);
                    }

                    notifyChange("MistyInstances");
                });
            };

            watcher.Updated += async (DeviceWatcher deviceSender, DeviceInformationUpdate args) =>
            {
                object value;
                string name = String.Empty;
                string ip = String.Empty;
                var props = args.Properties;

                if (props.TryGetValue("System.Devices.Dnssd.HostName", out value))
                {
                    string local = ".local";

                    name = value as String;

                    // remove .local from the name
                    int index = name.IndexOf(local);
                    if (index > 0)
                    {
                        name = name.Remove(index, local.Length);
                    }
                }

                var newIp = ipFromDictionary(props);
                if (newIp != String.Empty)
                {
                    ip = newIp;
                }

                await Windows.ApplicationModel.Core.CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal,
                () =>
                {
                    MistyInstance instance;
                    if (MistyInstanceMap.TryGetValue(args.Id, out instance))
                    {
                        if (name != String.Empty)
                        {
                            instance.Name = name;
                        }

                        if (ip != String.Empty)
                        {
                            instance.IpAddress = ip;
                        }
                    }
                });
            };

            watcher.Added += async (DeviceWatcher deviceSender, DeviceInformation args) =>
            {
                string name = args.Name;
                string ip = ipFromDictionary(args.Properties);
                await Windows.ApplicationModel.Core.CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal,
                () =>
                {
                    if (MistyInstanceMap.ContainsKey(args.Id) == false)
                    {
                        var device = new MistyInstance(name, ip);
                        MistyInstanceMap.Add(args.Id, device);
                        MistyInstances.Add(device);
                    }

                    notifyChange("MistyInstances");
                });
            };

            watcher.Start();
        }

        private string ipFromDictionary(IReadOnlyDictionary<String, object> dictionary)
        {
            object value;
            if (dictionary.TryGetValue("System.Devices.IpAddress", out value))
            {
                var ips = value as string[];
                if (ips != null && ips.Length > 0)
                {
                    return ips[0];
                }
            }

            return String.Empty;
        }

        public void stop()
        {
            if (watcher != null)
            {
                watcher.Stop();
            }

            MistyInstances.Clear();
        }

        private void notifyChange(string value)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(value));
            }
        }
    }
}
