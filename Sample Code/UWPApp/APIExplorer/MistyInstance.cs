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
using Windows.Security.Credentials;

namespace APIExplorer
{
    internal class MistyInstance : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;


        public MistyInstance(string name, string ip)
        {
            this.name = name;
            this.ipAddress = ip;
        }

        private string name = String.Empty;
        public string Name
        {
            get
            {
                return name;
            }
            set
            {
                name = value;
                notifyChange("Name");
            }
        }

        private string ipAddress = String.Empty;
        public string IpAddress
        {
            get
            {
                return ipAddress;
            }
            set
            {
                ipAddress = value;
                notifyChange("IpAddress");
            }
        }

        public override string ToString()
        {
            if (this.Name.Length > 0 && this.IpAddress.Length > 0)
            {
                return this.Name + " - " + this.IpAddress;
            }
            else if (this.Name.Length > 0)
            {
                return this.Name;
            }
            else
            {
                return this.IpAddress;
            }
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
