const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
// const auth = require("../Middlewares/authenticationMiddleware");
const { MemberAuthentication, AdminAuthentication } = require("../Middlewares/authenticationMiddleware");
const {userValidationFunction} = require("../Validations/userValidator");
const {validateMiddleware} = require("../Validations/validate");
const upload = require("../Middlewares/imgUploadMiddleware");

router.post("/register", upload.single("image"),userValidationFunction() , validateMiddleware, userController.addUser);
router.get("/getAllUsers", userController.getAllUsers);
router.get("/getUser", MemberAuthentication, userController.getUser);
router.get("/getUser/:id", MemberAuthentication, AdminAuthentication,userController.getUser);
router.patch("/updateUser", MemberAuthentication, upload.single("image"),userController.updateUser);
router.patch("/updateUser/:id", MemberAuthentication,AdminAuthentication, upload.single("image"),userController.updateUser);
router.delete("/deleteUser/", MemberAuthentication, userController.deleteUser);
router.delete("/deleteUser/:id", MemberAuthentication, AdminAuthentication, userController.deleteUser);
router.put("/changePassword/:id", userController.changePassword); // allow user to change password or admin to change any user password
router.all("/simple", userController.simple);
router.post("/login", upload.none(),userController.login);
router.all("/loggedIn", MemberAuthentication, userController.amIMember);
router.all("/loggedInAdmin", MemberAuthentication, AdminAuthentication, userController.amIAdmin);
router.all("/logout",MemberAuthentication, userController.logout);

router.all("*", (req, res) => {
    res.status(404).json({
        status: "error",
        data: "Route not found"
    });
})



module.exports = router