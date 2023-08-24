/* middleware to clear Redis cache */

const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  // clear cache after req is done
  await next();
  clearHash(req.user.id);
};
