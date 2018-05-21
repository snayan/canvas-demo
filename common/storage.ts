const KEY_PREFIX = '__canvas__demo__storage__'.toUpperCase();
const KEY_SUFFIX = '__';

export default {
  get(key) {
    try {
      return JSON.parse(window.localStorage.getItem(KEY_PREFIX + key.toUpperCase() + KEY_SUFFIX));
    } catch (e) {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(KEY_PREFIX + key.toUpperCase() + KEY_SUFFIX, JSON.stringify(value));
    } catch (e) {}
  },
};
