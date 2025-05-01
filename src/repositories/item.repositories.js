// src/repositories/item.repositories.js
const db = require('../database/pg.database');

exports.createItem = async ({ name, price, store_id, imageUrl, stock }) => {
    const query = `INSERT INTO items (name, price, store_id, image_url, stock) 
                   VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [name, price, store_id, imageUrl, stock || 0];

    const result = await db.query(query, values);
    return result.rows[0];
};

exports.updateItem = async ({ id, name, price, store_id, imageUrl, stock }) => {
    const query = `UPDATE items 
                    SET name = $1, price = $2, store_id = $3, 
                        image_url = COALESCE($4, image_url), stock = $5
                   WHERE id = $6 RETURNING *`;
    const values = [name, price, store_id, imageUrl, stock || 0, id];

    const result = await db.query(query, values);
    return result.rows[0];
};

exports.getAllItems = async () => {
    const query = `SELECT * FROM items ORDER BY created_at DESC`;
    const result = await db.query(query);
    return result.rows;
};

exports.getItemById = async (id) => {
    const query = `SELECT * FROM items WHERE id = $1`;
    const values = [id];

    try {
        const result = await db.query(query, values);
        return result.rows[0];  // Pastikan ada hasilnya
    } catch (error) {
        console.error("Database error in getItemById:", error);  // Tambahkan log ini
        throw error;
    }
};

exports.getItemsByStoreId = async (store_id) => {
    const query = `SELECT * FROM items WHERE store_id = $1`;
    const values = [store_id];

    try {
        console.log("Executing Query:", query, values);  // buat debugging
        const result = await db.query(query, values);
        return result.rows;
    } catch (error) {
        console.error("Database error in getItemsByStoreId:", error);  // buat debugging
        throw error;
    }
};

exports.deleteItem = async (id) => {
    const query = `DELETE FROM items WHERE id = $1 RETURNING *`;
    const values = [id];

    try {
        console.log("Executing DELETE Query:", query, values); // Debugging
        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            console.log("Item not found for deletion:", id);
            return null; // Jika tidak ada item yang dihapus
        }

        return result.rows[0];
    } catch (error) {
        console.error("Database error in deleteItem:", error); // Debugging
        throw error;
    }
};


