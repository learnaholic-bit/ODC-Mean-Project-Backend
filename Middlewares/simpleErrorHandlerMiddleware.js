const ResponseMsg = require('../Utils/ResponseMsg');

const simpleErrorHandler = (err, req, res, next) => {
    // handle the message better here later and learn more about error handling
    //better be in if(err)

    // let errorMessage = err.message;
    // // Check for specific error messages
    // if (errorMessage === 'Multiple files uploaded') {
    //     return res.status(400).json({
    //         status: "error",
    //         data: "Only one file is allowed to be uploaded."
    //     });
    // }



    if (err) {
        return res.status(400).json({ 
            status: "error",
            data: err.message });
    }
    next();
}

module.exports = simpleErrorHandler