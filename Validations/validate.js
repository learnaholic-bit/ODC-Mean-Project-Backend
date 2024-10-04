// Middleware to handle validation results
const {validationResult} = require('express-validator');
const ResponseMsg = require('../Utils/ResponseMsg');
exports.validateMiddleware = (req, res, next) => {
    // console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: ResponseMsg.Error,
            data: errors.array() 
        });
    }
    next();
};