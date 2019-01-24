let dumbCache = {};

const addToCache = (key, data) => {
  data.cacheHit = true;
  dumbCache[key] = data;
}

const getFromCache = (key) => {
  if (dumbCache[key] !== undefined) {
    return dumbCache[key];
  } else {
    return false;
  }
}

module.exports = {
  add: addToCache,
  get: getFromCache
};