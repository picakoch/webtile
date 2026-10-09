// Minimal replacement for vuejs3-logger: this.$log.debug/info/warn/error,
// with messages below `level` dropped.
const LEVELS = ["debug", "info", "warn", "error"];

export default {
  install(app, { level = "debug" } = {}) {
    const min = LEVELS.indexOf(level);
    const log = {};
    LEVELS.forEach((name, i) => {
      log[name] =
        i >= min
          ? (...args) => console[name](`${name.toUpperCase()} |`, ...args)
          : () => {};
    });
    app.config.globalProperties.$log = log;
  },
};
