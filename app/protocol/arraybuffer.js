export const ab2str = buf =>
   String.fromCharCode.apply(null, new Uint8Array(buf));

export const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i += 1) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};
