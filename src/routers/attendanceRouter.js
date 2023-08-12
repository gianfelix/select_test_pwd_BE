const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const attendanceController = require("../controller/attendanceControllers");

router.post("/employee/clock-in",  attendanceController.clockIn);
router.post("/employee/clock-out", attendanceController.clockOut);
router.get("/employee/attendance-history/:userID", attendanceController.getHistoryByUserId);



module.exports = router;
