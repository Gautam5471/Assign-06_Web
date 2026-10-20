const express = require("express");
const router = express.Router();
const {
    recordPayment,
    getReceiptByNo,
    getStudentFeeSummary,
    getDashboardStats,
} = require("../controllers/paymentController");
const { authHandler, allowRoles } = require("../middleware/authHandler");

router.post("/", authHandler, allowRoles("admin"), recordPayment);
router.get("/dashboard", authHandler, allowRoles("admin"), getDashboardStats);
router.get("/receipts/:receiptNo", authHandler, getReceiptByNo);
router.get("/student/:id", authHandler, getStudentFeeSummary);
router.get("/my-fees", authHandler, getStudentFeeSummary);

module.exports = router;
