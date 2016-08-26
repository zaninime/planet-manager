export default class Config {

  constructor() {
    this.time = {
      sunrise: 0,
      sunset: 0
    };
    this.twilight = {
      duration: 0,
      radius: 0,
      phase: 0,
      whiteDelay: 0
    };
    this.dayColor = {
      h: 0,
      s: 0,
      v: 0,
      white: 0
    };
    this.night = {
      color: 'blue',
      intensity: 0
    };
    this.channelMapping = [];
    this.fan = {
      start: {
        temp: 0,
        speed: 0
      },
      max: {
        temp: 0,
        speed: 0
      },
      ramp: 0
    };
    this.mode = 'slave';
  }

  handleConstraints() {
    this.fan.start.speed = 30;
    this.fan.max.temp = 60;
    this.fan.ramp = 15;
    //this.twilight.whiteDelay = 0;
    if (this.fan.start.temp > 40) this.fan.start.temp = 40;
    if (this.fan.max.speed < 50) this.fan.max.speed = 50;
    if (this.night.intensity > .3) this.night.intensity = .3;
    return this;
  }

  zeroCompactUnusedStrips() {
    const toBeZeroed = [1, 4, 5, 8, 9, 12];
    toBeZeroed.forEach((v) => {
      this.channelMapping[v-1] = 0;
    });
  }

  static getDefault() {
    const conf = new Config();
    conf.dayColor = {
      h: 3.7,
      s: 0.5,
      v: 0.8,
      white: .8
    };
    conf.time = {
      sunrise: 8*60,
      sunset: 18*60
    };
    conf.twilight = {
      duration: 60,
      radius: 30,
      phase: 45,
      whiteDelay: 5
    };
    conf.night = {
      color: 'blue',
      intensity: 0.15
    };
    conf.fan = {
      start: {
        temp: 30,
        speed: 20
      },
      max: {
        speed: 80,
        temp: 80
      },
      ramp: 30
    };
    conf.mode = 'slave';
    return conf;
  }
}
