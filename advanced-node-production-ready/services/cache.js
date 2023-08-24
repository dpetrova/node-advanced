/* Inject custom logic to query before it is send to MongoDB */

const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
// promisify takes any function with callback and make it return a promise
client.get = util.promisify(client.get);
client.hget = util.promisify(client.hget);

// get reference to the original exec function of the Mongoose query
const exec = mongoose.Query.prototype.exec;

// create a chainable function to enable cache for a particular query
mongoose.Query.prototype.cache = async function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || ""); // specify the top level key (use this if have nested hash keys)
  return this; // to can chain it (.find().cache())
};

// overwrite exec function as add additional logic
mongoose.Query.prototype.exec = async function () {
  // check if cache is enabled for this query
  if (!this.useCache) {
    // run the original exec function as skip all the caching logic
    return exec.apply(this, arguments);
  }

  // make unique and consistent cache key using queryOptions and collectionName
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // see if we have a value for the key in Redis
  //const cacheValue = await client.get(key); // use this if have plain key-value
  const cacheValue = await client.hget(this.hashKey, key); // use this if have nested hashes

  // if we do, return the cached value
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    //app expects value represented as a Mongoose model (Blog, User,...)
    //handle single object vs array of objects
    return Array.isArray(doc)
      ? doc.map((x) => new this.model(x))
      : new this.model(doc);
  }

  // otherwise, exec the query and store the result in Redis
  const result = await exec.apply(this, arguments); //run the original exec function
  //client.set(key, JSON.stringify(result), "EX", 10); // use this if have plain key-value
  client.hmset(this.hashKey, key, JSON.stringify(result), "EX", 10); // use this if have nested hashes

  return result;
};

// function to clear redis cashed data by provided hash key
module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
