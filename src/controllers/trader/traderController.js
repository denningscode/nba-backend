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


// @desc Copy trader with trader code
// route POST /trader/copy
// @access Private
const copyTrader = (req, res) => {
    const { code } = req.body;
    const id = req.user.id;

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
                    // update user info
                    const updateUser = `UPDATE users SET copy_trade='${results[0].id}' WHERE id = '${id}'`;
                    db.query(updateUser, (updateError, updateResult) => {
                        if (updateError) {
                            res.status(500).json({
                                message: updateError.message
                            })
                        } else {
                            res.status(200).json("Successfully copied trader")
                        }
                    })
                    
                }
            }
        }); 


    }
}


// @desc Stop copy with trader code
// route POST /trader/stop
// @access Private
const stopCopy = (req, res) => {
    const id = req.user.id;
    // update user info
    const updateUser = `UPDATE users SET copy_trade='NULL' WHERE id = '${id}'`;
    db.query(updateUser, (updateError, updateResult) => {
        if (updateError) {
            res.status(500).json({
                message: updateError.message
            })
        } else {
            res.status(200).json("Successfully stopped copying trader")
        }
    })
}



export {
    getTrader,
    copyTrader,
    stopCopy
}