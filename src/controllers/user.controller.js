const userRepository = require("../repositories/user.repositories");

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.query;
        const result = await userRepository.registerUser({ name, email, password });
        res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.query;
        const result = await userRepository.loginUser(email, password);
        res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const result = await userRepository.getUserByEmail(email);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userData = req.body;
        const result = await userRepository.updateUser(userData);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userRepository.deleteUser(id);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

exports.topUpUser = async (req, res) => {
    try {
        const { id, amount } = req.query;
        const result = await userRepository.topUpUser(id, amount);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};
