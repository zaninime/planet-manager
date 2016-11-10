import ip from 'ip';

export const validateNetmask = (value) => {
    const trimmedValue = value.trim();
    const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = trimmedValue.match(regex);

    let valid = true;
    if (match !== null) {
        const netmaskBytes = [0, 128, 192, 224, 240, 248, 252, 254, 255];
        let last = 0;

        for (let i = 4; i > 0; i -= 1) {
            for (let j = netmaskBytes.length - 1; j >= last; j -= 1) {
                if (netmaskBytes[j] === parseInt(match[i], 10)) {
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

export const validateAddress = value => ip.isV4Format(value);

export const validateGateway = (gatewayValue, netmaskValue, addressValue) => {
    if (!(validateNetmask(netmaskValue) && validateAddress(addressValue))) {
        return false;
    }

    const gatewayTrimmedValue = gatewayValue.trim();

    const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = gatewayTrimmedValue.match(regex);

    // subnet information
    const result = ip.subnet(addressValue, netmaskValue);

    return match != null && result.contains(gatewayTrimmedValue);
};

export const wifiToProtocolFormat = (wifiState) => {
    const { mode } = wifiState;
    const { ssid } = wifiState[mode];
    let password = '';
    let dhcp = false;
    let addressing = { };
    let ipAddress = '';
    let netmask = '';
    let gateway = '';

    // No need to validate them since the state
    // must never contain invalid values.
    // Furthermore, they're validated in the ui.
    if (mode === 'station') {
        password = wifiState[mode].password;
        dhcp = wifiState[mode].dhcp;
        addressing = wifiState[mode].addressing;
    }

    if (!dhcp) {
        ipAddress = addressing.ip;
        netmask = addressing.netmask;
        gateway = addressing.gateway;
    }

    return {
        mode,
        ssid,
        password,
        channel: 'auto',
        dhcp,
        address: ipAddress,
        port: 65535,
        gateway,
        mask: netmask,
    };
};

export const wifiToReducerFormat = wifiConfig =>
({
    mode: wifiConfig.mode,
    ibss: {
        ssid: wifiConfig.mode === 'station' ? 'ELOS WiFish' : wifiConfig.ssid,
    },
    station: {
        ssid: wifiConfig.ssid,
        password: wifiConfig.password,
        dhcp: wifiConfig.dhcp,
        addressing: {
            ip: wifiConfig.address,
            netmask: wifiConfig.mask,
            gateway: wifiConfig.gateway,
        },
    },
});
