require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const FeeStructure = require("./models/FeeStructure");
const Payment = require("./models/Payment");

const seedData = async () => {
    try {
        await connectDB();

        console.log("Clearing existing collections...");
        await User.deleteMany();
        await FeeStructure.deleteMany();
        await Payment.deleteMany();

        console.log("Creating Admin and Students...");
        const admin = await User.create({
            name: "Dr. R. K. Sharma (Accounts Head)",
            email: "admin@institute.edu",
            password: "adminpassword123",
            role: "admin",
            contactNumber: "9876543210",
        });

        const studentList = [
            {
                name: "Aarav Sharma",
                email: "aarav.sharma@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "CS-2026-001",
                course: "B.Tech Computer Science",
                contactNumber: "9123456701",
            },
            {
                name: "Ananya Iyer",
                email: "ananya.iyer@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "CS-2026-002",
                course: "B.Tech Computer Science",
                contactNumber: "9123456702",
            },
            {
                name: "Rohan Patel",
                email: "rohan.patel@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "CS-2026-003",
                course: "B.Tech Computer Science",
                contactNumber: "9123456703",
            },
            {
                name: "Pooja Verma",
                email: "pooja.verma@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "IT-2026-010",
                course: "B.Tech Information Technology",
                contactNumber: "9123456704",
            },
            {
                name: "Vikas Meena",
                email: "vikas.meena@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "IT-2026-011",
                course: "B.Tech Information Technology",
                contactNumber: "9123456705",
            },
            {
                name: "Sanya Gupta",
                email: "sanya.gupta@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "MBA-2026-020",
                course: "MBA Marketing & Finance",
                contactNumber: "9123456706",
            },
            {
                name: "Kabir Singh",
                email: "kabir.singh@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "MBA-2026-021",
                course: "MBA Marketing & Finance",
                contactNumber: "9123456707",
            },
            {
                name: "Neha Nair",
                email: "neha.nair@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "BCA-2026-030",
                course: "Bachelor of Computer Applications",
                contactNumber: "9123456708",
            },
            {
                name: "Aditya Deshmukh",
                email: "aditya.deshmukh@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "BCA-2026-031",
                course: "Bachelor of Computer Applications",
                contactNumber: "9123456709",
            },
            {
                name: "Sneha Mukherjee",
                email: "sneha.mukherjee@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "MCA-2026-040",
                course: "Master of Computer Applications",
                contactNumber: "9123456710",
            },
            {
                name: "Karan Malhotra",
                email: "karan.malhotra@student.edu",
                password: "studentpassword123",
                role: "student",
                rollNumber: "MCA-2026-041",
                course: "Master of Computer Applications",
                contactNumber: "9123456711",
            },
        ];

        const createdStudents = await User.create(studentList);
        console.log(`Created ${createdStudents.length} students`);

        console.log("Creating Fee Structures...");
        const pastDueDate = new Date("2026-09-15");
        const futureDueDate = new Date("2026-12-31");

        const feeStructuresData = [
            {
                course: "B.Tech Computer Science",
                academicYear: "2026-2027",
                feeHeads: [
                    { title: "Tuition Fee", amount: 65000 },
                    { title: "Computer Lab & Tech Fee", amount: 15000 },
                    { title: "Semester Exam Fee", amount: 5000 },
                    { title: "Library & Digital Resources", amount: 3000 },
                ],
                totalAmount: 88000,
                dueDate: pastDueDate,
                lateFeePerDay: 50,
            },
            {
                course: "B.Tech Information Technology",
                academicYear: "2026-2027",
                feeHeads: [
                    { title: "Tuition Fee", amount: 60000 },
                    { title: "Software Lab Fee", amount: 14000 },
                    { title: "Semester Exam Fee", amount: 4500 },
                    { title: "Transport Facility Fee", amount: 6500 },
                ],
                totalAmount: 85000,
                dueDate: pastDueDate,
                lateFeePerDay: 40,
            },
            {
                course: "MBA Marketing & Finance",
                academicYear: "2026-2027",
                feeHeads: [
                    { title: "Academic Tuition Fee", amount: 90000 },
                    { title: "Corporate Seminar & Case Studies", amount: 20000 },
                    { title: "International Journal Access", amount: 8000 },
                    { title: "Placement & Training Fee", amount: 12000 },
                ],
                totalAmount: 130000,
                dueDate: futureDueDate,
                lateFeePerDay: 100,
            },
            {
                course: "Bachelor of Computer Applications",
                academicYear: "2026-2027",
                feeHeads: [
                    { title: "Tuition Fee", amount: 40000 },
                    { title: "Practical Lab Fee", amount: 10000 },
                    { title: "Exam Fee", amount: 3500 },
                ],
                totalAmount: 53500,
                dueDate: pastDueDate,
                lateFeePerDay: 30,
            },
            {
                course: "Master of Computer Applications",
                academicYear: "2026-2027",
                feeHeads: [
                    { title: "Tuition Fee", amount: 55000 },
                    { title: "Advanced Computing Lab", amount: 15000 },
                    { title: "Project Evaluation Fee", amount: 6000 },
                ],
                totalAmount: 76000,
                dueDate: futureDueDate,
                lateFeePerDay: 50,
            },
        ];

        const createdFeeStructures = await FeeStructure.create(feeStructuresData);
        console.log(`Created ${createdFeeStructures.length} fee structures`);

        const feeMap = {};
        createdFeeStructures.forEach((fs) => {
            feeMap[fs.course] = fs;
        });

        console.log("Creating Payments and issuing Receipts...");
        const paymentsData = [
            {
                receiptNo: "RCP-2026-0001",
                student: createdStudents[0]._id, // Aarav Sharma (CS) - Full payment
                feeStructure: feeMap["B.Tech Computer Science"]._id,
                amountPaid: 88000,
                paymentMode: "UPI",
                paymentDate: new Date("2026-08-10"),
                transactionReference: "UPI-IND-99881200",
                remarks: "First installment online paid",
                recordedBy: admin._id,
            },
            {
                receiptNo: "RCP-2026-0002",
                student: createdStudents[1]._id, // Ananya Iyer (CS) - Partial payment 1
                feeStructure: feeMap["B.Tech Computer Science"]._id,
                amountPaid: 45000,
                paymentMode: "NetBanking",
                paymentDate: new Date("2026-08-15"),
                transactionReference: "HDFC-NET-451278",
                remarks: "First term part payment",
                recordedBy: admin._id,
            },
            {
                receiptNo: "RCP-2026-0003",
                student: createdStudents[3]._id, // Pooja Verma (IT) - Partial payment
                feeStructure: feeMap["B.Tech Information Technology"]._id,
                amountPaid: 50000,
                paymentMode: "Card",
                paymentDate: new Date("2026-08-20"),
                transactionReference: "POS-SWIPE-9981",
                remarks: "Debit card POS counter swipe",
                recordedBy: admin._id,
            },
            {
                receiptNo: "RCP-2026-0004",
                student: createdStudents[5]._id, // Sanya Gupta (MBA) - Full payment
                feeStructure: feeMap["MBA Marketing & Finance"]._id,
                amountPaid: 130000,
                paymentMode: "NetBanking",
                paymentDate: new Date("2026-09-01"),
                transactionReference: "ICICI-IMPS-876123",
                remarks: "Annual fees paid in full",
                recordedBy: admin._id,
            },
            {
                receiptNo: "RCP-2026-0005",
                student: createdStudents[6]._id, // Kabir Singh (MBA) - Partial payment
                feeStructure: feeMap["MBA Marketing & Finance"]._id,
                amountPaid: 65000,
                paymentMode: "UPI",
                paymentDate: new Date("2026-09-05"),
                transactionReference: "UPI-PAYTM-441199",
                remarks: "50% upfront payment",
                recordedBy: admin._id,
            },
            {
                receiptNo: "RCP-2026-0006",
                student: createdStudents[7]._id, // Neha Nair (BCA) - Partial payment
                feeStructure: feeMap["Bachelor of Computer Applications"]._id,
                amountPaid: 30000,
                paymentMode: "Cash",
                paymentDate: new Date("2026-09-10"),
                transactionReference: "CASH-DESK-01",
                remarks: "Cash paid at accounts counter",
                recordedBy: admin._id,
            },
            {
                receiptNo: "RCP-2026-0007",
                student: createdStudents[9]._id, // Sneha Mukherjee (MCA) - Full payment
                feeStructure: feeMap["Master of Computer Applications"]._id,
                amountPaid: 76000,
                paymentMode: "UPI",
                paymentDate: new Date("2026-09-12"),
                transactionReference: "GPAY-AXIS-774411",
                remarks: "Full MCA tuition fee cleared",
                recordedBy: admin._id,
            },
            {
                receiptNo: "RCP-2026-0008",
                student: createdStudents[10]._id, // Karan Malhotra (MCA) - Partial payment
                feeStructure: feeMap["Master of Computer Applications"]._id,
                amountPaid: 40000,
                paymentMode: "Cash",
                paymentDate: new Date("2026-09-20"),
                transactionReference: "CASH-DESK-02",
                remarks: "Partial fee payment",
                recordedBy: admin._id,
            },
            {
                receiptNo: "RCP-2026-0009",
                student: createdStudents[3]._id, // Pooja Verma (IT) - Second partial payment
                feeStructure: feeMap["B.Tech Information Technology"]._id,
                amountPaid: 20000,
                paymentMode: "UPI",
                paymentDate: new Date("2026-10-02"),
                transactionReference: "BHIM-UPI-331188",
                remarks: "Second partial installment",
                recordedBy: admin._id,
            },
            {
                receiptNo: "RCP-2026-0010",
                student: createdStudents[7]._id, // Neha Nair (BCA) - Second partial payment
                feeStructure: feeMap["Bachelor of Computer Applications"]._id,
                amountPaid: 15000,
                paymentMode: "Card",
                paymentDate: new Date("2026-10-05"),
                transactionReference: "SBI-CARD-665522",
                remarks: "Card transaction",
                recordedBy: admin._id,
            },
        ];

        const createdPayments = await Payment.create(paymentsData);
        console.log(`Created ${createdPayments.length} seed payment records`);

        console.log("------------------------------------------");
        console.log("Seed data populated successfully!");
        console.log("Admin credentials: email=admin@institute.edu | password=adminpassword123");
        console.log("Student credentials: email=aarav.sharma@student.edu | password=studentpassword123");
        console.log("Student with dues: email=ananya.iyer@student.edu | password=studentpassword123");
        console.log("Student unpaid defaulter: email=rohan.patel@student.edu | password=studentpassword123");
        console.log("------------------------------------------");

        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedData();
