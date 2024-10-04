const express = require("express");
const router = express.Router();
const itemController = require("../Controllers/itemController");
const { MemberAuthentication, AdminAuthentication } = require("../Middlewares/authenticationMiddleware");
const {itemValidatorFunction} = require("../Validations/itemValidator");
const {validateMiddleware} = require("../Validations/validate");
const upload = require("../Middlewares/imgUploadMiddleware");

//remember to add user authentication middleware
//future task : add update validation middleware

router.get("/getCategories", itemController.getCategories);
router.get("/getItems", itemController.getItems);
router.get("/getItem/:id", itemController.getItem);
router.post("/addItem",MemberAuthentication,AdminAuthentication, upload.single("image"),itemValidatorFunction() , validateMiddleware ,itemController.addItem);
router.patch("/updateItem/:id",MemberAuthentication,AdminAuthentication, upload.single("image"), itemController.updateItem);
router.delete("/deleteItem/:id", MemberAuthentication,AdminAuthentication, itemController.deleteItem);
router.all("/simple", itemController.simple);
// router.post("/uploadImage", upload.single("image"), itemController.simple);

router.all("*", (req, res) => {
    res.json({
        status: 404,
        message: "Route not found"
    });
})

module.exports = router