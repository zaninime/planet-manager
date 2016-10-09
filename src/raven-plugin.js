const re = /^file:\/\/\/.*(\/.*)$/;

const normalizeUrl = (url) => {
  const m = url.match(re);
  if (!m) return url;
  return m[1];
};

const normalizeData = (data) => {
  if (data.culprit) {
    data.culprit = normalizeUrl(data.culprit);
  }

  if (data.exception) {
    // if data.exception exists, all of the other keys are guaranteed to exist
    data.exception.values[0].stacktrace.frames.forEach(function (frame) {
      frame.filename = normalizeUrl(frame.filename);
    });
  }
};

const init = (Raven) => {
  Raven.setDataCallback(normalizeData);
};

export default init;
