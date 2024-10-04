const itemModel = require("../Model/itemModel")
const errorHandler = require("../Utils/ErrorHandler.js");
const ResponseMsg = require("../Utils/ResponseMsg");
const path = require("path");
const {ConcacatPhotoPathAndBackendUrl} = require("../Utils/uploadReturnUrl.js");
exports.addItem = async (req, res) => {
    // res.send("add item");

    //validation in the validator package
    //----------- add unique validation 

    if (['', undefined, null].includes(req.body.photoPath)) {
        req.body.photoPath = "./../uploads/restaurant.png";
    }
    try{
        await itemModel.create(req.body)
            .then((data) => {
                res.json({
                    status: ResponseMsg.Success, data: data
                })
            })
            .catch((err) => {
                res.status(500).json({
                    status: ResponseMsg.Error,
                    data: err
                })
            })
    }catch(err){
        errorHandler(err, res);
    }
}

exports.getCategories = async (req, res) => {
    // res.send("get categories");
    let categories = await itemModel.distinct('category');
    res.json({
        status: ResponseMsg.Success,
        data: categories
    })
}

exports.getItems = async (req, res) => {
    // res.send("get all items");
    // you can show certain properties in the response using .select()
    //remember to add the pagination section from query
    let pageNumber = req.query.pageNumber || 1;
    let pageSize = req.query.pageSize || 10;
    let skip = (pageNumber - 1) * pageSize;
    let category = req.query.category;
    let result
    // get a list of available categories
    const categories = await itemModel.distinct('category');
    // console.log(categories);
    if(category && category != "all" && categories.includes(category)){
        result = await itemModel.find({category: category}).skip(skip).limit(pageSize);
    }else{
        result = await itemModel.find().skip(skip).limit(pageSize);
    }
    

    result = await ConcacatPhotoPathAndBackendUrl(result);
    // console.log(result)

    res.json({
        status: ResponseMsg.Success,
        data: result
    })
    
}

exports.getItem = async (req, res) => {
    // res.send("get item");
    let id = req.params.id;
    try
    {
        // won't happen due to routing
        // if(!id)
        // {
        //     throw ("id is required");
        // }
        // id validation
        if(!id.match(/^[0-9a-fA-F]{24}$/))
        {
            throw ("id is not valid");
        }

        let result = await itemModel.findOne({_id: id});
        if(result == null)
        {
            throw ("item not found");
        }
        result = await ConcacatPhotoPathAndBackendUrl(result);
        res.json({
            status: ResponseMsg.Success,
            data: result
        })
    }
    catch(err)
    {
        res.status(400).json({
            status: ResponseMsg.Error,
            data: err
        })
    }
}

exports.updateItem = async (req, res) => {
    // res.send("update item");
    //validate authority in the middleware and add flag 8alba
    //validation of data in the validator package

    let id = req.params.id;
    console.log(id)
    await itemModel.updateOne({_id: id}, req.body)
        .then((data) => {
            // console.log(data)
            res.status(200).json({
                status: ResponseMsg.Updated,
                data: data
            })
        })
        .catch((err) => {
            res.status(500).json({
                status: ResponseMsg.Error,
                data: err
            })
        })



}

exports.deleteItem = async (req, res) => {
    // res.send("delete item");
    let id = req.params.id;
    //validate authority in the middleware and add flag 8alba
    //no need for try and catch outside 8alba
    try{
        await itemModel.deleteOne({_id: id})
        .then((data) => {
            res.status(200).json({
                status: ResponseMsg.Deleted,
                data: data
            })
        })
        .catch((err) => {
            res.status(400).json({
                status: ResponseMsg.Error,
                data: err
            })
        })

    }catch(err){
        errorHandler(err, res);
    }
}


exports.simple = (req, res) => {
    res.send("simple");
}
