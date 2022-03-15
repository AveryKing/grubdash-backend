const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const list = (req,res) => {
    res.json({data:dishes})
}

const read = (req,res,next) => {
    const foundDish = dishes.find(dish => dish.id === req.params.dishId);
    if(!foundDish) {
        return next({
            status:404,
            message:"dish not found"
        })

    } else {
        return res.json({data:foundDish});
    }
}

const validateParams = (req,res,next) => {

}

const create = (req,res,next) => {
    if(!req.body.data.name || !req.body.data.description) {
        next({
            status:400,
            message: 'missing params'
        })
    } else {
        req.body.data.id = dishes.length + 1
        dishes.push(req.body.data)
        res.status(201).json({data: req.body.data})
    }
}

module.exports = {
    list, read, create
}