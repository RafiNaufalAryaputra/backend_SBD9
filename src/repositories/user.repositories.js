const bcrypt = require("bcrypt");
const db = require("../database/pg.database");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

exports.registerUser = async (user) => {
    try {
        if (!emailRegex.test(user.email)) {
            return { success: false, message: "Invalid email format", payload: null };
        }
        if (!passwordRegex.test(user.password)) {
            return { success: false, message: "Password must meet security requirements", payload: null };
        }
        
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const res = await db.query(
            "INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, 0) RETURNING *",
            [user.name, user.email, hashedPassword]
        );
        return { success: true, message: "User created", payload: res.rows[0] };
    } catch (error) {
        return { success: false, message: "Email already used", payload: null };
    }
};

exports.loginUser = async (email, password) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = res.rows[0];
        
        if (user && await bcrypt.compare(password, user.password)) {
            return { success: true, message: "Login success", payload: user };
        } else {
            return { success: false, message: "Invalid email or password", payload: null };
        }
    } catch (error) {
        return { success: false, message: error.message, payload: null };
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows.length > 0 ? { success: true, message: "User found", payload: res.rows[0] } : { success: false, message: "User not found", payload: null };
    } catch (error) {
        return { success: false, message: error.message, payload: null };
    }
};

exports.updateUser = async (userData) => {
    try {
        if (!emailRegex.test(userData.email)) {
            return { success: false, message: "Invalid email format", payload: null };
        }
        if (userData.password && !passwordRegex.test(userData.password)) {
            return { success: false, message: "Password must meet security requirements", payload: null };
        }
        
        const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : undefined;
        const res = await db.query(
            "UPDATE users SET name = $1, email = $2, password = COALESCE($3, password) WHERE id = $4 RETURNING *",
            [userData.name, userData.email, hashedPassword, userData.id]
        );

        return res.rows.length > 0 ? { success: true, message: "User updated", payload: res.rows[0] } : { success: false, message: "User not found", payload: null };
    } catch (error) {
        return { success: false, message: error.message, payload: null };
    }
};

exports.deleteUser = async (id) => {
    try {
        const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return res.rows.length > 0 ? { success: true, message: "User deleted", payload: res.rows[0] } : { success: false, message: "User not found", payload: null };
    } catch (error) {
        return { success: false, message: error.message, payload: null };
    }
};

exports.topUpUser = async (id, amount) => {
    try {
        if (amount <= 0) {
            return { success: false, message: "Amount must be larger than 0", payload: null };
        }

        const res = await db.query(
            "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
            [amount, id]
        );

        return res.rows.length > 0 ? { success: true, message: "Top up successful", payload: res.rows[0] } : { success: false, message: "User not found", payload: null };
    } catch (error) {
        return { success: false, message: error.message, payload: null };
    }
};
