import db from "../../config/dbConfig.js";

// @desc Create new demo trade
// route POST /trade/demo
// @access Private
const createDemoTrade = (req, res) => {
    const {
        user_id,
        trade_id,
        asset,
        stake,
        buy_sell,
        status,
        trade_result,
        win_loss,
        leverage
    } = req.body

    if (!user_id || !trade_id || !asset || !stake || !buy_sell || !status || !trade_result || !win_loss || !leverage) {
        res.status(400).json({
            message: "Fields cannot be empty"
        })
    } else {
        // create trade
        const createTrade = `INSERT INTO 
        demo_trades (
            user_id, 
            trade_id, 
            asset, 
            stake, 
            buy_sell, 
            status, 
            trade_result, 
            leverage,
            win_loss
        ) VALUES (
            '${user_id}',
            '${trade_id}',
            '${asset}',
            '${stake}',
            '${buy_sell}',
            '${status}',
            '${trade_result}',
            '${leverage}',
            '${win_loss}'
        )`;

        db.query(createTrade, (error, result) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                })
            } else {
                if (result) {
                    res.status(200).json({
                        message: "Trade added"
                    })
                }
            }
        });
    }
}


// @desc Get demo trades
// route GET /trade/demo/all
// @access Private
const getDemoTrades = (req, res) => {

    const userId = req.user.id;

    const getTrades = `SELECT * FROM demo_trades WHERE user_id = '${userId}' ORDER BY id DESC`;;
    db.query(getTrades, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            if (results) {
                res.status(200).json(results)
            }
        }
    })
}



// @desc Get demo trades
// route GET /trade/all
// @access Private
const getTrades = (req, res) => {

    const userId = req.user.id;

    const getTrades = `SELECT * FROM trades WHERE user_id = '${userId}' ORDER BY id DESC`;;
    db.query(getTrades, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            if (results) {
                res.status(200).json(results)
            }
        }
    })
}


export { createDemoTrade, getDemoTrades, getTrades }