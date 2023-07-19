import { validate } from "email-validator";
import jwt from "jsonwebtoken";
import db from "../../config/dbConfig.js";


// @desc Register a new user
// route POST /user/register
// access Public
const registerUser = (req, res) => {
    const { firstname, lastname, email, phone, country, password, referred_by} = req.body;

    const randomNumber = Math.floor(Math.random() * 999)
    //generate referral code
    const referralCode = `BITJ${randomNumber}${firstname[0]}${firstname[1]}${lastname[0]}${lastname[1]}`

    //check if all field are filled
    if (!firstname || !lastname || !email || !phone || !country || !password) {
        res.status(400).json({
            data: "Fields cannot be empty"
        });
    } else {
        //check if email is valid
        if (!validate(email.toLowerCase())) {
            res.status(400).json({
                data: "Invalid email address"
            })
        } else {
            //check if user exists
            const checkUser = `SELECT * FROM users WHERE email = '${email}'`;
            db.query(checkUser, (error, results) => {
                if (error) {
                    res.status(500).json({
                        data: error.message
                    });
                } else {
                    if (results.length > 0) {
                        res.status(400).json({
                            data: "User aready exists"
                        })
                    } else {
                        //register user here
                        const registerUser = `INSERT INTO users(firstname, lastname, email, phone, country, password, referral_code, referred_by) 
                        VALUES ('${firstname}','${lastname}','${email.toLowerCase()}','${phone}','${country}','${password}', '${referralCode}', ${!referred_by ? 'null' : referred_by})`;
                        
                        db.query(registerUser, (error, result) => {
                            if (error) {
                                res.status(500).json({
                                    data: error.message
                                });
                            } else {
                                if (result) {
                                    //create wallet for user generate token for user
                                    //check if wallet exists for user 
                                    const checkWallet = `SELECT * FROM wallets WHERE user_id = '${result.insertId}'`;
                                    db.query(checkWallet, (walletError, walletResults) => {
                                        if (walletError) {
                                            res.status(500).json({
                                                data: walletError.message
                                            });
                                        } else {
                                            if (walletResults.length > 0) {
                                                res.status(400).json({
                                                    data: "There is already a wallet for this user"
                                                });
                                            } else {
                                                //create wallet
                                                const createWallet = `INSERT INTO wallets(user_id) VALUES ('${result.insertId}')`;
                                                db.query(createWallet, (createError, createResult) => {
                                                    if (createError) {
                                                        res.status(500).json({
                                                            data: createError.message
                                                        })
                                                    } else {
                                                        if (createResult) {
                                                            const createDemoWallet = `INSERT INTO demo_wallets(user_id) VALUES ('${result.insertId}')`;
                                                            db.query(createDemoWallet, (demoError, demoResult) => {
                                                                if (demoError) {
                                                                    res.status(500).json({
                                                                        data: demoError.message
                                                                    })
                                                                } else {
                                                                    if (demoResult) {
                                                                        // login and generate token for user
                                                                        const loginUser = `SELECT * FROM users WHERE id = '${result.insertId}'`;
                                                                        db.query(loginUser, (loginError, loginResult) => {
                                                                            if (loginError) {
                                                                                res.status(500).json({
                                                                                    data: loginError.message
                                                                                })
                                                                            } else {
                                                                                if (loginResult) {
                                                                                    //generate token
                                                                                    const token = jwt.sign({
                                                                                        id: loginResult[0].id,
                                                                                        firstname: loginResult[0].firstname,
                                                                                        lastname: loginResult[0].lastname,
                                                                                        email: loginResult[0].email,
                                                                                        phone: loginResult[0].phone,
                                                                                        country: loginResult[0].country,
                                                                                        referral_code: loginResult[0].referral_code
                                                                                    }, process.env.TOKEN_SECRET);

                                                                                    res.status(200).json({
                                                                                        ACCESS_TOKEN: token
                                                                                    })
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                            
                                                            
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    });
                                    
                                }
                            }
                        });

                    }
                }
            });
        } 
    }
}

// @desc Login an existing user
// route POST /user/register
// @access Public
const loginUser = (req, res) => {
    const { email, password} = req.body;

    //check if all field are filled
    if (!email || !password) {
        res.status(400).json({
            data: "Fields cannot be empty"
        });
    } else {
        //check if email is valid
        if (!validate(email.toLowerCase())) {
            res.status(400).json({
                data: "Invalid email address"
            })
        } else {
            //check if user exists
            const checkUser = `SELECT * FROM users WHERE email = '${email}'`;
            db.query(checkUser, (checkError, checkResults) => {
                if (checkError) {
                    res.status(500).json({
                        data: checkError.message
                    })
                } else {
                    if (checkResults.length < 1) {
                        res.status(400).json({
                            data: "No user with this email"
                        })
                    } else {
                        if (checkResults[0].password !== password) {
                            res.status(400).json({
                                data: "Incorrect password"
                            })
                        } else {
                            //login user
                            const token = jwt.sign({
                                id: checkResults[0].id,
                                firstname: checkResults[0].firstname,
                                lastname: checkResults[0].lastname,
                                email: checkResults[0].email,
                                phone: checkResults[0].phone,
                                country: checkResults[0].country,
                                referral_code: checkResults[0].referral_code
                            }, process.env.TOKEN_SECRET);
            
                            res.status(200).json({
                                ACCESS_TOKEN: token
                            })
                        }
                    }
                }
            });
        }
    }
}

// @desc Gets current logged in user using user token
// route GET /user
// @access Private
const currentUser = (req, res) => {
    res.status(200).json(req.user)
}

// @desc Gets current logged in user copy trade status
// route GET /user/copy/status
// @access Private
const getCopyStatus = (req, res) => {

    const userId = req.user.id;

    const getCopyStatus = `SELECT * FROM users WHERE id='${userId}'`;
    
    db.query(getCopyStatus, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            if (!results[0].copy_trade) {
                res.status(400).json({
                    message: "Not active"
                })
            } else {
                // get trader INFO
                const gerTraderInfo = `SELECT * FROM traders WHERE id = '${results[0].copy_trade}'`;
                db.query(gerTraderInfo, (getError, getResults) => {
                    if (getError) {
                        res.status(500).json({
                            message: getError.message
                        })
                    } else {
                        if (getResults.length < 1) {
                            res.status(400).json({
                                message: "Invalid trader"
                            })
                        } else {
                            res.status(200).json(getResults[0])
                        }
                        
                    }
                })
            }
        }
    })
}


// @desc Gets current logged in user copy trade status
// route GET /user/copy/bar
// @access Private
const getStatusBar = (req, res) => {

    const userId = req.user.id;

    const getCopyStatus = `SELECT * FROM users WHERE id='${userId}'`;
    
    db.query(getCopyStatus, (error, results) => {
        if (error) {
            res.status(500).json({
                message: error.message
            })
        } else {
            res.status(200).json(results[0].bar)
        }
    })
}

// @desc Update user password
// route POST /user/password
// @access Private
const updatePassword = (req, res) => {
    const id = req.user.id;

    const password = req.body.password;

    const updatePassword = `UPDATE users SET password = '${password}' WHERE id = '${id}'`;
    db.query(updatePassword, (error, result) => {
        if (error) {
            res.status(500).json({
                data: error.message
            })
        } else {
            if (result) {
                res.status(200).json({
                    data: "Password updated"
                });
            }
        }
    })
}


// @desc Get total referrals
// route GET user/referrals
// @access Public
const getReferrals = (req, res) => {
    const code = req.params.code;

    const getReferrals = `SELECT * FROM users WHERE referred_by = '${code}'`;

    db.query(getReferrals, (error, result) => {
        if (error) {
            res.status(500).json({
                data: error.message
            })
        } else {
            if (result) {
                res.status(200).json({
                    data: result.length
                })
            }
        }
    })
}






export { 
    registerUser, 
    loginUser, 
    currentUser,
    getCopyStatus,
    getStatusBar,
    updatePassword,
    getReferrals
}