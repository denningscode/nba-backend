import db from "../../config/dbConfig.js";

// @desc Get trader info with trader code
// route POST /trader
// @access Public
const getTrader = (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({
            message: "Field cannot be empty"
        })
    } else {
        const getTrader = `SELECT * FROM traders WHERE trader_code = '${code}'`;

        db.query(getTrader, (error, results) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                })
            } else {
                if (results.length < 1) {
                    res.status(400).json({
                        message: "Invalid trader code"
                    })
                } else {
                    res.status(200).json(results[0])
                }
            }
        }); 


    }
}

export {
    getTrader
}