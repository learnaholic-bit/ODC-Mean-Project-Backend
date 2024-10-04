
exports.errorHandler = (err, res) => {
    if (err) {
        res.status(400).json({
            status: "error",
            message: err
        });
    }
    return;
}