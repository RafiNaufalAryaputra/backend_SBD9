const storeRepository = require('../repositories/store.repositories');
const baseResponse = require('../utils/baseResponse.util');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, 'Stores retrieved successfully', stores);
    } catch (error) {
        console.error("Error in getAllStores:", error); // Debugging
        baseResponse(res, false, 500, 'Error getting stores', null);
    }
};

exports.createStore = async (req, res) => {
    if (!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, 'Name and address are required', null);
    }

    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, 'Store created successfully', store);
    } catch (error) {
        console.error("Error in createStore:", error); // Debugging
        baseResponse(res, false, 500, error.message || 'Server error', null);
    }
};

exports.getStoreById = async (req, res) => {
    try {
        const store = await storeRepository.getStoreById(req.params.id);
        if (!store) {
            return baseResponse(res, false, 404, 'Store not found', null);
        }
        baseResponse(res, true, 200, 'Store retrieved successfully', store);
    } catch (error) {
        console.error("Error in getStoreById:", error);
        baseResponse(res, false, 500, 'Store not found', null);
    }
};

exports.updateStore = async (req, res) => {
    if (!req.body.id || !req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, 'ID, Name, and Address are required', null);
    }

    try {
        const store = await storeRepository.updateStore(req.body);
        if (!store) {
            return baseResponse(res, false, 404, 'Store not found', null);
        }
        baseResponse(res, true, 200, 'Store updated successfully', store);
    } catch (error) {
        console.error("Error in updateStore:", error);
        baseResponse(res, false, 500, 'Server error', null);
    }
};

exports.deleteStore = async (req, res) => {
    try {
        console.log("🛠️ Deleting store with ID:", req.params.id);  // Debugging

        const store = await storeRepository.deleteStore(req.params.id);

        if (!store) {
            console.log("⚠️ Store not found in database:", req.params.id);
            return baseResponse(res, false, 404, 'Store not found', null);
        }

        console.log("✅ Store deleted successfully:", store);
        baseResponse(res, true, 200, 'Store deleted successfully', store);
    } catch (error) {
        console.error("❌ Error in deleteStore:", error);
        baseResponse(res, false, 500, error.message || 'Server error', null);
    }
};
