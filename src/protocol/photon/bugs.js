export const blockOnFetch = (config, status) => {
  const bug1 = (config, status, bugs) => {
    // will never match
    if (status.firmwareVersion === 'a') {
      config = {...config,
        daylight: {...config.daylight,
          red: {...config.daylight.red, slope: config.daylight.red.slope + 10}
        }
      };
      return [config, bugs.concat('BUG1')];
    }
    return [config, bugs];
  };
  const bugList = [bug1];

  let discoveredBugs = [];
  for (const bug of bugList) {
    [config, discoveredBugs] = bug(config, status, discoveredBugs);
  }
  return {config, bugs: discoveredBugs};
};

export const supportOnSave = (config, discoveredBugs) => {
  const bug1 = (config, bugs) => {
    const [name, ...rest] = bugs;
    if (name !== 'BUG1') return [config, bugs];
    config = {...config,
      daylight: {...config.daylight,
        red: {...config.daylight.red, slope: config.daylight.red.slope - 10}
      }
    };
    return [config, rest];
  };

  const bugList = [bug1];
  bugList.reverse();
  discoveredBugs = discoveredBugs.slice().reverse();

  for (const bug in bugList) {
    [config, discoveredBugs] = bug(config, discoveredBugs);
  }
  return config;
};
