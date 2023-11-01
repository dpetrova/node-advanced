const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const requireLogin = require("../middlewares/requireLogin");
const keys = require("../config/keys");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  endpoint: "s3-eu-central-1.amazonaws.com",
  signatureVersion: "v4",
  region: "eu-central-1",
});

module.exports = (app) => {
  app.get("/api/upload", requireLogin, async (req, res) => {
    // generate unique file name
    const key = `${req.user.id}/${uuid()}.jpeg`;

    // getSignedUrl (operationName, params, callback)
    // operationName -> name of the operation we want to create the presighed URL for (putObject is operation name for uploading files)
    // params: bucket (name of the bucket we are uploading to), key (name of the file we are uploading), ContentType
    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "my-blog-post-bucket-123", // my-blog-bucket-123
        Key: key,
        ContentType: "image/jpeg",
      },
      (err, url) => res.send({ key, url })
    );
  });
};
