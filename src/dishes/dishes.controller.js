const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

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

function validateParam(propertyName) {
    return function (req, res, next) {
        const {data = {}} = req.body;
        if (data.price < 0 || typeof (data.price) !== 'number') {
            return next({status: 400, message: `price must be greater than 0`});
        }
        if (data[propertyName]) {
            return next();
        }
        next({status: 400, message: `Must include a ${propertyName}`});
    };

}

const list = (req, res) => res.json({data: dishes});
const read = (req, res) => res.json({data: res.locals.foundDish});
const deleteDish = (req, res) => res.status(405).json({error: 'not implemented'});

const create = (req, res) => {
    req.body.data.id = nextId();
    dishes.push(req.body.data);
    res.status(201).json({data: req.body.data})
}

const update = (req, res) => {
    if (req.body.data.id && req.body.data.id !== req.params.dishId) {
        return res.status(400).json({error: `id ${req.body.data.id} does not equal ${req.params.dishId}`})
    }
    if (!req.body.data.id) {
        res.locals.foundDish = req.body.data;
        res.locals.foundDish.id = req.params.dishId;
        res.json({data: res.locals.foundDish})
    }
    res.locals.foundDish = req.body.data;
    res.json({data: res.locals.foundDish})
}

module.exports = {
    create: [
        validateParam("name"),
        validateParam("description"),
        validateParam("image_url"),
        validateParam("price"),
        create
    ],
    read: [
        findDish,
        read
    ],
    update: [
        findDish,
        validateParam("name"),
        validateParam("description"),
        validateParam("image_url"),
        validateParam("price"),
        update
    ],
    deleteDish,
    list,
}