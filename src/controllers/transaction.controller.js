const transactionRepository = require("../repositories/transaction.repository");

exports.createTransaction = async (req, res) => {
    try {
        const { user_id, item_id, quantity } = req.body;
        if (!user_id || !item_id || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Quantity must be larger than 0", payload: null });
        }

        const newTransaction = await transactionRepository.createTransaction(user_id, item_id, quantity);
        return res.status(201).json({ success: true, message: "Transaction created", payload: newTransaction });
    } catch (error) {
        console.error("Failed to create transaction", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", payload: null });
    }
};

exports.payTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await transactionRepository.payTransaction(id);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Failed to pay", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", payload: null });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await transactionRepository.getTransactionById(id);

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found", payload: null });
        }

        return res.status(200).json({ success: true, message: "Transaction found", payload: transaction });
    } catch (error) {
        console.error("Failed to get transaction by ID", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", payload: null });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTransaction = await transactionRepository.deleteTransaction(id);

        if (!deletedTransaction) {
            return res.status(404).json({ success: false, message: "Transaction not found", payload: null });
        }

        return res.status(200).json({ success: true, message: "Transaction deleted successfully", payload: deletedTransaction });
    } catch (error) {
        console.error("Failed to delete transaction", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", payload: null });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();
        return res.status(200).json({
            success: true,
            message: "Transactions found",
            payload: transactions,
        });
    } catch (error) {
        console.error("Failed to get transactions", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            payload: null,
        });
    }
};
