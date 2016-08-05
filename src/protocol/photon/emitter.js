const emitTarget = (target) => (config, status) => {
  return Object.keys(target).reduce((nextTarget, key) => {
    nextTarget[key] = target[key](config, status);
    return nextTarget;
  }, {});
};

export const emit = emitTarget({});