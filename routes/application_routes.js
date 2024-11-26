const express = require("express");
const router = express.Router();
const {
  renderDashboard,
  renderCreateIAMUser,
  createIAMUserController,
  createCounterController,
  incrementCounterController,
  deleteCounterController,
  viewCounterController,
} = require("../controllers/application_controller");
const { fetchUser, checkPermission } = require("../middlewares/fetchUser");

router.get("/dashboard", fetchUser, renderDashboard);
router.get("/createIAMUser", fetchUser, checkPermission, renderCreateIAMUser);
router.post(
  "/createIAMUser",
  fetchUser,
  checkPermission,
  createIAMUserController
);
router.get("/viewCounter", fetchUser, checkPermission, viewCounterController);
router.post(
  "/createCounter",
  fetchUser,
  checkPermission,
  createCounterController
);
router.delete(
  "/deleteCounter/:counterId",
  fetchUser,
  checkPermission,
  deleteCounterController
);
router.post(
  "/incrementCounter/:counterId",
  fetchUser,
  checkPermission,
  incrementCounterController
);

module.exports = router;
