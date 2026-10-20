const express = require("express");
const router = express.Router();
const {
    getFeeStructures,
    getFeeStructureById,
    getFeeStructureByCourse,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
} = require("../controllers/feeController");
const { authHandler, allowRoles } = require("../middleware/authHandler");

router.get("/", authHandler, getFeeStructures);
router.get("/course/:course", authHandler, getFeeStructureByCourse);
router.get("/:id", authHandler, getFeeStructureById);

router.post("/", authHandler, allowRoles("admin"), createFeeStructure);
router.put("/:id", authHandler, allowRoles("admin"), updateFeeStructure);
router.delete("/:id", authHandler, allowRoles("admin"), deleteFeeStructure);

module.exports = router;
