const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const itemRoutes = require("./src/routes/item.routes");
const storeRoutes = require("./src/routes/store.routes"); 
const userRoutes = require("./src/routes/user.routes");
const transactionRoutes = require("./src/routes/transaction.routes");

// Menggunakan Routes
app.use("/item", itemRoutes);
app.use("/store", storeRoutes); 
app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes);

// Menjalankan Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
