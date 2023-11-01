const mongoose = require("mongoose");
const Blog = mongoose.model("Blog");
const requireLogin = require("../middlewares/requireLogin");
//const { clearHash } = require("../services/cache");
const cleanCache = require("../middlewares/cleanCache");

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  app.get("/api/blogs", requireLogin, async (req, res) => {
    //const blogs = await Blog.find({ _user: req.user.id }).cache(); //enable cache for this query
    const blogs = await Blog.find({ _user: req.user.id }).cache({
      key: req.user.id, //enable cache for this query and specify the top level hash key (use this with nested hashes)
    });

    res.send(blogs);

    /* implement redis cache to this route */
    // const redis = require("redis");
    // const util = require("util");
    // const redisUrl = "redis://127.0.0.1:6379";
    // const client = redis.createClient(redisUrl);
    // // promisify takes any function with callback and make it return a promise
    // client.get = util.promisify(client.get);

    // // do we have any cached data related to this query?
    // const cachedBlogs = await client.get(req.user.id);

    // // if yes -> respond to the request right away
    // if (cachedBlogs) {
    //   console.log("SERVING FROM CACHE");
    //   return res.send(JSON.parse(cachedBlogs));
    // }

    // // if no -> need to get data from DB, update cache to store the data, and respond to request
    // console.log("SERVING FROM MONGODB");
    // const blogs = await Blog.find({ _user: req.user.id });
    // client.set(req.user.id, JSON.stringify(blogs));
    // res.send(blogs);
  });

  // use cleanCache middleware to clear Redis cached data when creating a new blog, so the new one can be fetched form DB
  app.post("/api/blogs", requireLogin, cleanCache, async (req, res) => {
    const { title, content, imageUrl } = req.body;

    const blog = new Blog({
      title,
      content,
      imageUrl,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }

    //clearHash(req.user.id);
  });
};
