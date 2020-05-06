
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
