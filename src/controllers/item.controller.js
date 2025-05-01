const itemRepository = require("../repositories/item.repositories");

exports.createItem = async (req, res) => {
    try {
        console.log("Request received:", req.body);
        console.log("Uploaded file:", req.file);

        const { name, price, store_id, stock } = req.body;
        const imageUrl = req.file ? req.file.path : null; // URL dari Cloudinary

        console.log("Image URL:", imageUrl);

        const newItem = await itemRepository.createItem({
            name, price, store_id, imageUrl, stock
        });

        console.log("New item created:", newItem);
        res.status(201).json(newItem);
    } catch (err) {
        console.error("Error in createItem:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { id, name, price, store_id, stock } = req.body;
        const imageUrl = req.file ? req.file.path : null; // URL Cloudinary

        const updatedItem = await itemRepository.updateItem({
            id, name, price, store_id, imageUrl, stock
        });

        res.status(200).json(updatedItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        res.status(200).json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await itemRepository.getItemById(id);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json(item);
    } catch (err) {
        console.error("Error in getItemById:", err);  
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getItemsByStoreId = async (req, res) => {
    try {
        const { store_id } = req.params;
        console.log("Request Store ID:", store_id); // buat debugging

        const items = await itemRepository.getItemsByStoreId(store_id);
        
        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No items found for this store",
                payload: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Items retrieved successfully",
            payload: items
        });

    } catch (err) {
        console.error("Error in getItemsByStoreId:", err);  // buat debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting item with ID:", id); // buat debugging

        const deletedItem = await itemRepository.deleteItem(id);

        if (!deletedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (err) {
        console.error("Error in deleteItem:", err); // buat debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
};

