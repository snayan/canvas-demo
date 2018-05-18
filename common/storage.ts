const KEY_PREFIX = '__canvas__demo__storage__'.toUpperCase();
const KEY_SUFFIX = '__';

export default {
  get(key) {
    try {
      return JSON.parse(window.localStorage.getItem(KEY_PREFIX + KEY_SUFFIX + key.toUpperCase()));
    } catch (e) {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(KEY_PREFIX + KEY_SUFFIX + key.toUpperCase(), JSON.stringify(value));
    } catch (e) {}
  },
};
