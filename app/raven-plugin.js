const re = /^file:\/\/\/.*(\/.*)$/;

const normalizeUrl = (url) => {
    const m = url.match(re);
    if (!m) return url;
    return m[1];
};

const normalizeData = (data) => {
    const normalizedData = data;
    if (normalizedData.culprit) {
        normalizedData.culprit = normalizeUrl(normalizedData.culprit);
    }

    if (normalizedData.exception) {
        // if data.exception exists, all of the other keys are guaranteed to exist
        normalizedData.exception.values[0].stacktrace.frames.map((frame) => {
            const normalizedFrame = frame;
            normalizedFrame.filename = normalizeUrl(frame.filename);

            return normalizedFrame;
        });
    }
};

const init = (Raven) => {
    Raven.setDataCallback(normalizeData);
};

export default init;
