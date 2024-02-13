const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../collection/Users");
const auth = async (req, res, next) => {
  try {
    const {
      body,
      cookies: { idnty: token },
    } = req;
    if (!token || typeof token !== "string")
      throw new Error(
        JSON.stringify({ status: 403, message: "some error occured" })
      );

    const { email } = jwt.verify(token, process.env.SECRET_KEY) || {};

    if (!email)
      throw new Error(
        JSON.stringify({ status: 403, message: "some error occured" })
      );
    let user = await getUserByEmail(email);
    if (user.result) {
      if (user.user.tokens.some((itm) => itm === token)) {
        req.user = user.user;
        next();
      }
    } else {
      throw new Error(
        JSON.stringify({ status: 403, message: "some error occured" })
      );
    }
  } catch (error) {
    const err = JSON.parse(error.message);
    res.status(400 || err.status).json({ result: false, message: err.message });
  }
};
module.exports = auth;
