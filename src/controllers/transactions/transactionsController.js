import db from "../../config/dbConfig.js";

// @desc Get all user transactions
// route GET transaction/
// @access Private
const getTrancactions = (req, res) => {
    const userId = req.user.id;

    const getTrancactions = `SELECT * FROM transactions WHERE user_id = '${userId}' ORDER BY id DESC`;
    db.query(getTrancactions, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            res.status(200).json(results)
        }
    })
}


// @desc Get all user demo transactions
// route GET transaction/
// @access Private
const getDemoTrancactions = (req, res) => {
    const userId = req.user.id;

    const getTrancactions = `SELECT * FROM demo_transactions WHERE user_id = '${userId}' ORDER BY id DESC`;
    db.query(getTrancactions, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            res.status(200).json(results)
        }
    })
}

export { getTrancactions, getDemoTrancactions }