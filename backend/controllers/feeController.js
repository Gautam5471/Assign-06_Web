const FeeStructure = require("../models/FeeStructure");

const getFeeStructures = async (req, res, next) => {
    try {
        const fees = await FeeStructure.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: fees.length, data: fees });
    } catch (error) {
        next(error);
    }
};

const getFeeStructureById = async (req, res, next) => {
    try {
        const fee = await FeeStructure.findById(req.params.id);
        if (!fee) {
            return res.status(404).json({ success: false, message: "Fee structure not found" });
        }
        res.status(200).json({ success: true, data: fee });
    } catch (error) {
        next(error);
    }
};

const getFeeStructureByCourse = async (req, res, next) => {
    try {
        const fee = await FeeStructure.findOne({ course: req.params.course });
        if (!fee) {
            return res.status(404).json({ success: false, message: `No fee structure found for ${req.params.course}` });
        }
        res.status(200).json({ success: true, data: fee });
    } catch (error) {
        next(error);
    }
};

const createFeeStructure = async (req, res, next) => {
    try {
        const { course, academicYear, feeHeads, dueDate, lateFeePerDay } = req.body;

        const existing = await FeeStructure.findOne({ course });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Fee structure already exists for course: ${course}. Please edit the existing one.`,
            });
        }

        const totalAmount = feeHeads.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

        const fee = await FeeStructure.create({
            course,
            academicYear: academicYear || "2026-2027",
            feeHeads,
            totalAmount,
            dueDate,
            lateFeePerDay: lateFeePerDay !== undefined ? lateFeePerDay : 50,
        });

        res.status(201).json({ success: true, message: "Fee structure created successfully", data: fee });
    } catch (error) {
        next(error);
    }
};

const updateFeeStructure = async (req, res, next) => {
    try {
        const { course, academicYear, feeHeads, dueDate, lateFeePerDay } = req.body;

        let fee = await FeeStructure.findById(req.params.id);
        if (!fee) {
            return res.status(404).json({ success: false, message: "Fee structure not found" });
        }

        let totalAmount = fee.totalAmount;
        if (feeHeads && feeHeads.length > 0) {
            totalAmount = feeHeads.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
        }

        fee = await FeeStructure.findByIdAndUpdate(
            req.params.id,
            { course, academicYear, feeHeads, totalAmount, dueDate, lateFeePerDay },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: "Fee structure updated successfully", data: fee });
    } catch (error) {
        next(error);
    }
};

const deleteFeeStructure = async (req, res, next) => {
    try {
        const fee = await FeeStructure.findById(req.params.id);
        if (!fee) {
            return res.status(404).json({ success: false, message: "Fee structure not found" });
        }

        await FeeStructure.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Fee structure deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFeeStructures,
    getFeeStructureById,
    getFeeStructureByCourse,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
};
