export const wifiToProtocolFormat = (wifiState) => {
    const { mode } = wifiState;
    const { ssid } = wifiState[mode];
    let password = '';
    let dhcp = true;
    let addressing = { };
    let ipAddress = '192.168.0.100';
    let netmask = '255.255.255.0';
    let gateway = '192.168.0.1';

    // No need to validate them since the state
    // must never contain invalid values.
    // Furthermore, they're validated in the ui.
    if (mode === 'station') {
        password = wifiState[mode].password;
        dhcp = wifiState[mode].dhcp;
        addressing = wifiState[mode].addressing;

        if (!dhcp) {
            ipAddress = addressing.ip;
            netmask = addressing.netmask;
            gateway = addressing.gateway;
        }
    }

    return {
        mode,
        ssid,
        password,
        channel: 'auto',
        dhcp,
        address: ipAddress,
        port: wifiState.port,
        gateway,
        mask: netmask,
    };
};

export const wifiToReducerFormat = wifiConfig => ({
    mode: wifiConfig.mode,
    port: wifiConfig.port,
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
