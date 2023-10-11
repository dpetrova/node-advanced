const Buffer = require("safe-buffer").Buffer;
const keys = require("../../config/keys");
const Keygrip = require("keygrip"); // npm module for signing and verifying data (cookies, URL)
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  // generate session
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };
  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");

  // generate signatures
  const sig = keygrip.sign("session=" + session);

  return { session, sig };
};
