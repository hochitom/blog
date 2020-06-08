let dumbCache = {};

const addToCache = (key, data) => {
  dumbCache[key] = data;
}

const getFromCache = (key) => {
  if (dumbCache[key] !== undefined) {
    console.log(`cache hit: ${key}`);
    return dumbCache[key];
  } else {
    return false;
  }
}

module.exports = {
  add: addToCache,
  get: getFromCache
};