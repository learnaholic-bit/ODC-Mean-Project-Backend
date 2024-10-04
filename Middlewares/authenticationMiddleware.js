const jwt = require("jsonwebtoken");
const ResponseMsg = require("../Utils/ResponseMsg");

// sign role and member id in the token
exports.MemberAuthentication = (req, res, next) => {
    let token = req.cookies.AuthToken;
    console.log(token);
    if (!token) {
        return res.status(401).json({status: ResponseMsg.Error, data: "login required"});
    }
    try{
        let decoded = jwt.verify(token, process.env.JWTSecret);
        req.memberId = decoded.id;
        req.role = decoded.role;
        console.log(req.role);
        next();
    }
    catch(err){
        return res.status(401).json({status: ResponseMsg.Error, data: "error in token verification"});
    }
}

exports.AdminAuthentication = (req, res, next) => {
    // must be used after MemberAuthentication
    console.log(req.role);
    if (req.role !== "admin") {
        return res.status(401).json({status: ResponseMsg.Error, data: "you are not admin"});
    }
    next();
}
