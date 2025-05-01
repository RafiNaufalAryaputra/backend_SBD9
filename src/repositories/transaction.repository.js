const db = require("../database/pg.database");

exports.createTransaction = async (user_id, item_id, quantity) => {
    try {
        // Ambil harga dari tabel items
        const itemRes = await db.query("SELECT price FROM items WHERE id = $1", [item_id]);
        if (itemRes.rows.length === 0) {
            return { success: false, message: "Item not found", payload: null };
        }

        const price = itemRes.rows[0].price;
        const total = price * quantity;

        // Buat transaksi baru
        const res = await db.query(
            "INSERT INTO transactions (user_id, item_id, quantity, total) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, item_id, quantity, total]
        );

        return res.rows[0];
    } catch (error) {
        console.error("Failed to create transaction", error);
        throw error;
    }
};

exports.payTransaction = async (id) => {
    try {
        // Ambil transaksi
        const transactionRes = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
        if (transactionRes.rows.length === 0) {
            return { success: false, message: "Transaction not found", payload: null };
        }

        const transaction = transactionRes.rows[0];

        // Ambil saldo user
        const userRes = await db.query("SELECT balance FROM users WHERE id = $1", [transaction.user_id]);
        if (userRes.rows.length === 0) {
            return { success: false, message: "User not found", payload: null };
        }

        const balance = userRes.rows[0].balance;
        if (balance < transaction.total) {
            return { success: false, message: "Failed to Pay", payload: null };
        }

        // Update saldo user
        await db.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [transaction.total, transaction.user_id]);

        // Update status transaksi menjadi "paid"
        await db.query("UPDATE transactions SET status = 'paid' WHERE id = $1", [id]);

        return { success: true, message: "Payment successful", payload: transaction };
    } catch (error) {
        console.error("Failed to pay transaction", error);
        throw error;
    }
};

exports.getTransactionById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Failed to get transaction by ID", error);
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    try {
        const res = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [id]);

        if (res.rowCount === 0) {
            return null;
        }

        return res.rows[0];
    } catch (error) {
        console.error("Failed to delete transaction", error);
        throw error;
    }
};

exports.getAllTransactions = async () => {
    try {
        const res = await db.query(`
            SELECT 
                t.*, 
                row_to_json(u.*) as user,
                row_to_json(i.*) as item
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            JOIN items i ON t.item_id = i.id
        `);
        return res.rows;
    } catch (error) {
        console.error("Failed to get transactions", error);
        throw error;
    }
};
