import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import userRoute from "./src/routes/user/userRoute.js";
import walletRoute from "./src/routes/wallet/walletRoute.js";
import adminRoute from "./src/routes/admin/adminRoute.js";
import transactionRoute from "./src/routes/transactions/transactionsRoute.js";
import tradeRoute from "./src/routes/trades/tradeRoute.js";
import traderRoute from "./src/routes/trader/traderRoute.js"

const app = express();
const port = 5577 || process.env.PORT;

app.use(express.json());

app.use(cors({
    origin: "*"
}));


app.use("/user", userRoute);
app.use("/wallet", walletRoute);
app.use("/admin", adminRoute);
app.use("/transaction", transactionRoute);
app.use("/trade", tradeRoute);
app.use("/trader", traderRoute);

app.listen(port, () => console.log("Server running on port "  + port));
