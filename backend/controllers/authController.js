const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "supersecretjwtkey_fee_management_2026", {
        expiresIn: "7d",
    });
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, role, rollNumber, course, contactNumber } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        if (role === "student" && rollNumber) {
            const rollExists = await User.findOne({ rollNumber });
            if (rollExists) {
                return res.status(400).json({ success: false, message: "Roll number is already registered" });
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || "student",
            rollNumber: role === "student" ? rollNumber : undefined,
            course: role === "student" ? course : undefined,
            contactNumber,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNumber: user.rollNumber,
                course: user.course,
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide both email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNumber: user.rollNumber,
                course: user.course,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

const getAllStudents = async (req, res, next) => {
    try {
        const { search, course } = req.query;
        let query = { role: "student" };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { rollNumber: { $regex: search, $options: "i" } },
            ];
        }

        if (course) {
            query.course = course;
        }

        const students = await User.find(query).select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: students.length, students });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe, getAllStudents };
