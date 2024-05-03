const { Router } = require("express");

const router = Router();
const userRoute = require("./user.route");

const allRoutes = [{ path: "/user", route: userRoute }];

allRoutes.forEach((routes) => {
  router.use(routes.path, routes.route);
});

module.exports = router;
