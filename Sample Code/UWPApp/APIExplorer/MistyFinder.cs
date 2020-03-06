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
