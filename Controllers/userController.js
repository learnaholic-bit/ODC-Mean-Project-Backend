const userModel = require("../Model/userModel")
const bcrypt = require("bcrypt");
const {errorHandler} = require("../Utils/ErrorHandler.js");
const ResponseMsg = require("../Utils/ResponseMsg");
const jwt = require("jsonwebtoken");
const {ConcacatPhotoPathAndBackendUrl, CleanAnItem} = require("../Utils/uploadReturnUrl.js");

const encryptPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

exports.addUser = async (req, res) => {
    // res.send("add user");
    // return
    
    //validation in the validator package
    // this.changePassword(req, res);
    req.body.password = await encryptPassword(req.body.password);
    req.body.role = "user";
    try{
        // console.log(req.body)
        await userModel.create(req.body)
            .then((data) => {
                res.status(200).json({
                    status: ResponseMsg.Success, 
                    data: data,
                    msg: "admin must be logged in to upgrade role"
                });
            })
            .catch((err) => {
                res.status(400).json({
                    status: ResponseMsg.Error, 
                    data: err
                });
        })
    }catch(err){
        console.log(err)
        errorHandler(err, res);
    }
}

exports.getAllUsers = async (req, res) => {
    // res.send("users");
    // you can show certain properties in the response using .select()
    //remember to add the pagination section from query
    
    await userModel.find().select("-password")
        .then((data) => {
            data = ConcacatPhotoPathAndBackendUrl(data);
            // console.log(data)

            res.json({status: ResponseMsg.Success, data: data});
        })
        .catch((err) => {
            res.status(500).json({status: ResponseMsg.Error, data: data});
        })
}

// exports.getUserOld = async (req, res) => {
//     // res.send("user");

//     await userModel.findOne({_id : req.params.id}).select("-password")
//         .then((data) => {
//             res.json({status: ResponseMsg.Success, data: data});
//         })
//         .catch((err) => {
//             res.status(500).json({status: ResponseMsg.Error, data: err});
//         })

// }

exports.getUser = async (req, res) => {
    // res.send("user");
    // the id is stored in the middleware

    let idToCheck;
    //params are only allowed if admin is logged in (route middleware / admin middleware)
    if (req.params.id)
    {
        idToCheck = req.params.id
    }
    else
    {   
        //memberId is only allowed if user is logged in (member middleware)
        idToCheck = req.memberId
    }

    // why get user is ignored ?
    await userModel.findOne({_id : idToCheck}).select("-password")
        .then((data) => {
            data = ConcacatPhotoPathAndBackendUrl(data);
            // console.log(data)
            // console.log(CleanAnItem(data));
            // data = CleanAnItem(data);
            res.json({status: ResponseMsg.Success, data: data});
        })
        .catch((err) => {
            res.status(500).json({status: ResponseMsg.Error, data: err});
        })

}



exports.updateUser = async (req, res) => {
    //res.send("update user");
    //validation in the validator package

    //not allow to change password using this method
    // delete req.body.password;
    // encrypt password
    if (req.body.password) {
        req.body.password = await encryptPassword(req.body.password);
    }
    else {
        delete req.body.password;
    }
    console.log(req.body)

    // not allow to change role if not admin
    if (req.body.role == "admin" && req.role !== "admin") {
        res.status(403).json({status: ResponseMsg.Error, data: "You are not allowed to change the role, please login with and admin account"});
        return;
    }

    //add search using email later instead of id
    let idToCheck;
    //params are only allowed if admin is logged in (route middleware / admin middleware)
    if (req.params.id)
    {
        idToCheck = req.params.id
        // check if this user exists
        let user = await userModel.findOne({_id: idToCheck});
        if (!user)
        {
            res.status(404).json({status: ResponseMsg.Error, data: "User not found"});
            return;
        }
        console.log(idToCheck)
    }
    else
    {   
        //memberId is only allowed if user is logged in (member middleware)
        idToCheck = req.memberId
    }

    await userModel.updateOne({_id: idToCheck}, req.body)
        .then((data) => {
            res.status(200).json({status: ResponseMsg.Updated, data: data});
        })
        .catch((err) => {
            res.status(500).json({status: ResponseMsg.Error, data: err});
        })
}

exports.changePassword = async (req, res) => {
    //Access permission validation in middleware
    //let it for the user only maybe should i use token for each ??
    // create custom validator for the password
    // res.send("change password");
    let hashedPassword = await encryptPassword(req.body.password);
    console.log(hashedPassword)
    await userModel.updateOne({_id: req.params.id}, {password: hashedPassword})
        .then((data) => {
            res.status(200).json({status: ResponseMsg.Updated, data: data});
        })
        .catch((err) => {
            res.status(500).json({status: ResponseMsg.Error, data: err});
        })
}

exports.deleteUser = async (req, res) => {
    //Access permission validation in middleware
    // res.send("delete user");

    //add search using email later instead of id
    let idToCheck;
    //params are only allowed if admin is logged in (route middleware / admin middleware)
    if (req.params.id)
    {
        idToCheck = req.params.id
        // check if this user exists
        let user = await userModel.findOne({_id: idToCheck});
        if (!user)
        {
            res.status(404).json({status: ResponseMsg.Error, data: "User not found"});
            return;
        }
        console.log(idToCheck)
    }
    else
    {   
        //memberId is only allowed if user is logged in (member middleware)
        idToCheck = req.memberId
    }


    await userModel.deleteOne({_id: idToCheck})
        .then((data) => {
            res.status(200).json({status: ResponseMsg.Deleted, data: data});
        })
        .catch((err) => {
            res.status(500).json({status: ResponseMsg.Error, data: err});
        })


}

exports.simple = (req, res) => {
    res.send("simple from user");
}

exports.login = async (req, res) => {
    try{
        // implement cookies store and jwt and token later maybe by userid
        let password = req.body.password;
        // add username option later
        let stored = await userModel.findOne({email: req.body.email})//.select("password");
        // console.log(stored)
        if (!stored) {
            return res.status(401).send("User not found");
        }
        let result = await bcrypt.compare(password, stored.password);
        // console.log(result)
        
        if(result){
            //res.send("password matched");
            let token = jwt.sign({id: stored._id, role: stored.role}, process.env.JWTSecret, {expiresIn: "1d"});
            console.log(process.env.JWTSecret)
            console.log(token)
            res.cookie("AuthToken", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 24*60*60*1000,
            }).status(200).json({
                status:ResponseMsg.Success,
                data:token
            })
        }else{
            res.status(401).json({
                status:ResponseMsg.Error,
                data:"password not matched"
            });        
        }

    }catch(err){
        res.status(500).json({
            status:ResponseMsg.Error,
            data:"Internal server error"
        });
    }

}

//assuming verfication is done in the middleware and if reach here then it is a valid user


exports.amIMember = async (req, res) => {
    res.status(200).json({
        status: ResponseMsg.Success,
        data: req.role
    })
}

exports.amIAdmin = async (req, res) => {
    res.status(200).json({
        status: ResponseMsg.Success,
        data: req.role
    })
}


exports.logout = async (req, res) => {
    res.clearCookie("AuthToken");
    res.status(200).json({
        status: ResponseMsg.Success,
        data: "logged out"
    })
}