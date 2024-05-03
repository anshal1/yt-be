const CatchErr = require("../../utils/CatchErr");
const { userModel } = require("../models/index");

const getUser = CatchErr((req, res) => {
  res.status(200).json(req.user);
});

const CreateUser = CatchErr(async (req, res) => {
  const { body } = req;
  const user = await userModel.create(body);
  res.status(201).json(user);
});

module.exports = {
  getUser,
  CreateUser,
};
