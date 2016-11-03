import ip from 'ip';

export const validateNetmask = (value) => {
  value = value.trim();
  const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = value.match(regex);

  let valid = true;
  if (match !== null) {
    const netmaskBytes = [0, 128, 192, 224, 240, 248, 252, 254, 255];
    let last = 0;

    for (let i = 4; i > 0; i--) {
      for (let j = netmaskBytes.length - 1; j >= last; j--) {
        if (netmaskBytes[j] === parseInt(match[i])) {
          last = j;
          break;
        }

        if (j === last) {
          valid = false;
        }
      }
    }
  }

  return valid && match !== null;
};

export const validateAddress = (value) => {
  return ip.isV4Format(value);
};

export const validateGateway = (gatewayValue, netmaskValue, addressValue) => {
  if (!(validateNetmask(netmaskValue) && validateAddress(addressValue)))
    return false;

  gatewayValue = gatewayValue.trim();

  const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = gatewayValue.match(regex);

  // subnet information
  const result = ip.subnet(addressValue, netmaskValue);

  return match != null && result.contains(gatewayValue);
};

export const wifiToProtocolFormat = (wifiState) => {
  let mode = wifiState.mode;
  const { ssid } = wifiState[mode];
  let password = '', dhcp = false;
  let addressing = { };
  let ip = '', netmask = '', gateway = '';

  // No need to validate them since the state
  // must never contain invalid values.
  // Furthermore, they're validated in the ui.
  if (mode === 'managed') {
    password = wifiState[mode].password;
    dhcp = wifiState[mode].dhcp;
    addressing = wifiState[mode].addressing;
  }

  if (dhcp) {
    ip = addressing.ip;
    netmask = addressing.netmask;
    gateway = addressing.gateway;
  }

  if (mode === 'managed')
    mode = 'station';

  return {
    mode: mode,
    ssid: ssid,
    password: password,
    channel: 'auto',
    dhcp: dhcp,
    address: ip,
    port: 65535,
    gateway: gateway,
    mask: netmask
  };
};

export const wifiToReducerFormat = (wifiConfig) => {
  return {
    mode: wifiConfig.mode === 'station' ? 'managed' : wifiConfig.mode,
    ibss: {
      ssid: wifiConfig === 'station' ?  'ELOS WiFish' : wifiConfig.ssid
    },
    managed: {
      ssid: wifiConfig.ssid,
      password: wifiConfig.password,
      dhcp: wifiConfig.dhcp,
      addressing: {
        ip: wifiConfig.address,
        netmask: wifiConfig.mask,
        gateway: wifiConfig.gateway
      }
    }
  };
};
