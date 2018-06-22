const KEY_PREFIX = '__canvas__demo__storage__'.toUpperCase();
const KEY_SUFFIX = '__';

export default {
  get(key) {
    try {
      return JSON.parse(window.sessionStorage.getItem(KEY_PREFIX + key.toUpperCase() + KEY_SUFFIX));
    } catch (e) {
      return null;
    }
  },
  set(key, value) {
    try {
      window.sessionStorage.setItem(KEY_PREFIX + key.toUpperCase() + KEY_SUFFIX, JSON.stringify(value));
    } catch (e) {}
  },
};
