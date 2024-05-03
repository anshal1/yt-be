const CatchErr = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
    console.log("Request Success");
  } catch (err) {
    next(err);
  }
};

module.exports = CatchErr;
