const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const list = (req, res) => {
    res.json({data: dishes})
}

const findDish = (req, res, next) => {
    const foundDish = dishes.find(dish => dish.id === req.params.dishId);
    if (!foundDish) {
        return next({
            status: 404,
            message: "dish not found"
        })
    }
    res.locals.foundDish = foundDish
    next();
}

const read = (req, res, next) => {
    return res.json({data: res.locals.foundDish});

}

function validateParam(propertyName) {
    return function (req, res, next) {
        const {data = {}} = req.body;
        if (data.price < 0) {
            return next({status: 400, message: `price must be greater than 0`});
        }
        if (data[propertyName]) {
            return next();
        }
        next({status: 400, message: `Must include a ${propertyName}`});
    };

}

const create = (req, res, next) => {
    req.body.data.id = dishes.length + 1
    dishes.push(req.body.data)
    res.status(201).json({data: req.body.data})

}

const update = (req,res,next) => {
    res.locals.foundDish = req.body.data;
    res.json({data: res.locals.foundDish})
}

module.exports = {
    list, read: [
        findDish,
        read
    ],
    create: [
        validateParam("name"),
        validateParam("description"),
        validateParam("image_url"),
        validateParam("price"),
        create
    ],
    update: [
        findDish,
        update
    ]
}