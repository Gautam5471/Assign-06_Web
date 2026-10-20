const Payment = require("../models/Payment");
const FeeStructure = require("../models/FeeStructure");
const User = require("../models/User");

const generateReceiptNo = async () => {
    const year = new Date().getFullYear();
    const count = await Payment.countDocuments();
    const sequence = String(count + 1).padStart(4, "0");
    return `RCP-${year}-${sequence}`;
};

const recordPayment = async (req, res, next) => {
    try {
        const { studentId, amountPaid, paymentMode, transactionReference, remarks } = req.body;

        const numericAmount = Number(amountPaid);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Business Rule Violation: Payment amount must be strictly greater than zero.",
            });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
            return res.status(404).json({ success: false, message: "Valid student account not found" });
        }

        if (!student.course) {
            return res.status(400).json({
                success: false,
                message: "Student is not enrolled in any course. Cannot assess fee structure.",
            });
        }

        const feeStructure = await FeeStructure.findOne({ course: student.course });
        if (!feeStructure) {
            return res.status(400).json({
                success: false,
                message: `No fee structure configured for student's course (${student.course}).`,
            });
        }

        const pastPayments = await Payment.find({ student: student._id });
        const alreadyPaid = pastPayments.reduce((sum, p) => sum + p.amountPaid, 0);

        let lateFee = 0;
        const now = new Date();
        const dueDate = new Date(feeStructure.dueDate);
        if (now > dueDate) {
            const diffDays = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
            lateFee = diffDays * (feeStructure.lateFeePerDay || 0);
        }

        const totalPayable = feeStructure.totalAmount + lateFee;
        const pendingAmount = Math.max(0, totalPayable - alreadyPaid);

        if (pendingAmount === 0) {
            return res.status(400).json({
                success: false,
                message: "Business Rule Violation: Fees for this student are already fully paid. No pending dues.",
            });
        }

        if (numericAmount > pendingAmount) {
            return res.status(400).json({
                success: false,
                message: `Business Rule Violation: Payment of ₹${numericAmount} exceeds pending dues of ₹${pendingAmount}. Overpayment is strictly rejected.`,
            });
        }

        let receiptNo = await generateReceiptNo();
        const existingReceipt = await Payment.findOne({ receiptNo });
        if (existingReceipt) {
            receiptNo = `RCP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
        }

        const payment = await Payment.create({
            receiptNo,
            student: student._id,
            feeStructure: feeStructure._id,
            amountPaid: numericAmount,
            paymentMode,
            paymentDate: new Date(),
            transactionReference: transactionReference || "CASH-DESK",
            remarks: remarks || "Term fee collection",
            recordedBy: req.user ? req.user._id : undefined,
        });

        const newPaidTotal = alreadyPaid + numericAmount;
        const newPending = totalPayable - newPaidTotal;
        const newStatus = newPending <= 0 ? "Paid" : newPaidTotal > 0 ? "Partially Paid" : "Unpaid";

        res.status(201).json({
            success: true,
            message: "Payment recorded successfully",
            data: payment,
            feeSummary: {
                totalPayable,
                totalPaid: newPaidTotal,
                pendingAmount: newPending,
                status: newStatus,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getReceiptByNo = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ receiptNo: req.params.receiptNo })
            .populate("student", "name email rollNumber course contactNumber")
            .populate("feeStructure", "course academicYear totalAmount dueDate feeHeads lateFeePerDay")
            .populate("recordedBy", "name email");

        if (!payment) {
            return res.status(404).json({ success: false, message: "Receipt not found with this receipt number" });
        }

        if (req.user.role === "student" && payment.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only view your own receipts" });
        }

        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};

const getStudentFeeSummary = async (req, res, next) => {
    try {
        const studentId = req.params.id || req.user._id;

        if (req.user.role === "student" && studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Access forbidden" });
        }

        const student = await User.findById(studentId).select("-password");
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const feeStructure = await FeeStructure.findOne({ course: student.course });
        const payments = await Payment.find({ student: student._id }).sort({ paymentDate: -1 });

        const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

        let baseFee = 0;
        let lateFee = 0;
        let dueDate = null;

        if (feeStructure) {
            baseFee = feeStructure.totalAmount;
            dueDate = feeStructure.dueDate;
            const now = new Date();
            const due = new Date(feeStructure.dueDate);
            if (now > due && totalPaid < baseFee) {
                const diffDays = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
                lateFee = diffDays * (feeStructure.lateFeePerDay || 0);
            }
        }

        const totalPayable = baseFee + lateFee;
        const pendingAmount = Math.max(0, totalPayable - totalPaid);

        let status = "Unpaid";
        if (totalPaid >= totalPayable && totalPayable > 0) {
            status = "Paid";
        } else if (totalPaid > 0) {
            status = "Partially Paid";
        }

        res.status(200).json({
            success: true,
            student,
            feeStructure,
            summary: {
                baseFee,
                lateFee,
                totalPayable,
                totalPaid,
                pendingAmount,
                status,
                dueDate,
            },
            payments,
        });
    } catch (error) {
        next(error);
    }
};

const getDashboardStats = async (req, res, next) => {
    try {
        const totalPayments = await Payment.find();
        const totalCollected = totalPayments.reduce((sum, p) => sum + p.amountPaid, 0);

        const students = await User.find({ role: "student" });
        const feeStructures = await FeeStructure.find();
        const feeMap = {};
        feeStructures.forEach((f) => {
            feeMap[f.course] = f;
        });

        const studentPaidMap = {};
        totalPayments.forEach((p) => {
            const sid = p.student.toString();
            studentPaidMap[sid] = (studentPaidMap[sid] || 0) + p.amountPaid;
        });

        let totalPending = 0;
        const defaulters = [];
        const now = new Date();

        students.forEach((s) => {
            const fs = feeMap[s.course];
            if (fs) {
                let late = 0;
                const due = new Date(fs.dueDate);
                const paid = studentPaidMap[s._id.toString()] || 0;
                if (now > due && paid < fs.totalAmount) {
                    const diffDays = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
                    late = diffDays * (fs.lateFeePerDay || 0);
                }
                const payable = fs.totalAmount + late;
                const pending = Math.max(0, payable - paid);
                totalPending += pending;

                if (pending > 0 && now > due) {
                    defaulters.push({
                        studentId: s._id,
                        name: s.name,
                        rollNumber: s.rollNumber,
                        course: s.course,
                        email: s.email,
                        dueDate: fs.dueDate,
                        totalPayable: payable,
                        paidAmount: paid,
                        pendingAmount: pending,
                        overdueDays: Math.ceil((now - due) / (1000 * 60 * 60 * 24)),
                    });
                }
            }
        });

        const modeMap = { Cash: 0, UPI: 0, Card: 0, NetBanking: 0 };
        totalPayments.forEach((p) => {
            modeMap[p.paymentMode] = (modeMap[p.paymentMode] || 0) + p.amountPaid;
        });

        const recentPayments = await Payment.find()
            .populate("student", "name rollNumber course")
            .sort({ paymentDate: -1 })
            .limit(6);

        res.status(200).json({
            success: true,
            data: {
                totalStudents: students.length,
                totalCollected,
                totalPending,
                modeWiseCollection: modeMap,
                defaultersCount: defaulters.length,
                defaulters,
                recentPayments,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    recordPayment,
    getReceiptByNo,
    getStudentFeeSummary,
    getDashboardStats,
};
