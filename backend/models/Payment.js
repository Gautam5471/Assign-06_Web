const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        receiptNo: {
            type: String,
            required: true,
            unique: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student reference is required"],
        },
        feeStructure: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FeeStructure",
            required: [true, "Fee structure reference is required"],
        },
        amountPaid: {
            type: Number,
            required: [true, "Amount paid is required"],
            min: [1, "Payment amount must be greater than zero"],
        },
        paymentMode: {
            type: String,
            required: [true, "Payment mode is required"],
            enum: ["Cash", "UPI", "Card", "NetBanking"],
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        transactionReference: {
            type: String,
            trim: true,
            default: "N/A",
        },
        remarks: {
            type: String,
            trim: true,
            default: "Fee payment",
        },
        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
