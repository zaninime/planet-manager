export const receiveBeacon = (address, port) => ({type: 'DISCOVERY_BEACON_RECEIVED', address, port, time: new Date()});
