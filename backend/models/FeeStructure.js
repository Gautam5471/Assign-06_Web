const mongoose = require("mongoose");

const feeHeadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Fee head title is required"],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"],
    },
});

const feeStructureSchema = new mongoose.Schema(
    {
        course: {
            type: String,
            required: [true, "Course name is required"],
            trim: true,
            unique: true,
        },
        academicYear: {
            type: String,
            required: [true, "Academic year is required"],
            default: "2026-2027",
            trim: true,
        },
        feeHeads: {
            type: [feeHeadSchema],
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: "At least one fee head is required",
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: [0, "Total amount cannot be negative"],
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
        },
        lateFeePerDay: {
            type: Number,
            default: 50,
            min: [0, "Late fee cannot be negative"],
        },
    },
    { timestamps: true }
);

feeStructureSchema.pre("validate", function () {
    if (this.feeHeads && this.feeHeads.length > 0) {
        this.totalAmount = this.feeHeads.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    }
});

module.exports = mongoose.model("FeeStructure", feeStructureSchema);
