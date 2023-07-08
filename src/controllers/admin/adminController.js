import db from "../../config/dbConfig.js";

// @desc Admin approve funding
// route POST /admin/approve/transaction_id
// @access Private
const approveFunding = (req, res) => {

    const { status } = req.body;
    const transactionId = req.params.id;

    if (!status) {
        res.status(400).json({
            message: "Transaction status is needed to approve or decline transaction"
        });
    } else {
        // check if transaction exists in DB
        const checkTransaction = `SELECT * FROM transactions WHERE id = ${transactionId}`;
        db.query(checkTransaction, (checkError, checkResult) => {
            if (checkError) {
                res.status(500).json({
                    message: checkError.message
                });
            } else {
                if (checkResult.length < 1) {
                    res.status(400).json({
                        message: "No such transaction in database"
                    });
                } else {
                    // update transaction here
                    const updateTransaction = `UPDATE transactions SET status='${status}' 
                    WHERE id = '${transactionId}'`;

                    db.query(updateTransaction, (error, result) => {
                        if (error) {
                            res.status(500).json({
                                message: error.message
                            });
                        } else {
                            if (result) {
                                // send approval or declined email here
                                res.status(200).json({
                                    message: "Transaction updated"
                                });
                            }
                        }
                    })
                }
            }
        })
    }

}



export { approveFunding }


