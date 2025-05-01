/* const db = require("../database/pg.database");

exports.getAllStores = async () => {
    try {
        const res = await db.query("SELECT * FROM stores");
        return res.rows;
    } catch (error) {
        console.error("Failed to get all stores", error);
    }
};

exports.createStore = async (store) => {
    try {
        const res = await db.query(
            "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
            [store.name, store.address]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Failed to create store", error);
    }
};
*/

const db = require("../database/pg.database");

// Ambil store berdasarkan ID
exports.getStoreById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM stores WHERE id = $1", [id]);
        return res.rows[0];  // Mengembalikan satu store
    } catch (error) {
        console.error("Failed to get store by ID", error);
        throw error;
    }
};

// Update store berdasarkan ID
exports.updateStore = async (store) => {
    try {
        const res = await db.query(
            "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
            [store.name, store.address, store.id]
        );
        return res.rows[0];  // Mengembalikan store yang diperbarui
    } catch (error) {
        console.error("Failed to update store", error);
        throw error;
    }
};

// Hapus store berdasarkan ID
exports.deleteStore = async (id) => {
    try {
        console.log("🔍 Executing DELETE query for store ID:", id);  // Debugging ID yang dikirim

        const res = await db.query(
            "DELETE FROM stores WHERE id = $1 RETURNING *", [id]
        );

        console.log("📝 Query result:", res.rows);  //Debugging hasil query

        if (res.rowCount === 0) {
            console.log("Store not found:", id);
            return null; 
        }

        return res.rows[0];
    } catch (error) {
        console.error("Failed to delete store", error);
        throw error;  
    }
};



exports.getAllStores = async () => {
    try {
        const res = await db.query("SELECT * FROM stores");
        return res.rows;
    } catch (error) {
        console.error("Failed to get all stores", error);
    }
};

exports.createStore = async (store) => {
    try {
        const res = await db.query(
            "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
            [store.name, store.address]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Failed to create store", error);
    }
};