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
