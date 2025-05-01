const cors = require("cors");
const corsOptions = {
    origin: "https://os.netlabdte.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
};
module.exports = cors(corsOptions);
