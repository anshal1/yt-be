const ApiError = require("../../utils/ApiError");
const CatchErr = require("../../utils/CatchErr");
const { userModel } = require("../models/index");

const getUserById = (showPassword = false) =>
  CatchErr(async (req, res, next) => {
    const id = req.header("token");
    if (!id) {
      throw new ApiError("Please Login Or Register To Continue", 400);
    }
    const user = await userModel
      .findById(id)
      .select(showPassword ? "" : "-password");
    if (!user) {
      throw new ApiError("User Not Found", 404);
    }
    req.user = user;
    next();
  });

module.exports = getUserById;
