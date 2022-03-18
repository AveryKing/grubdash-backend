const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

// finds a dish
const findDish = (req, res, next) => {
    const foundDish = dishes.find(dish => dish.id === req.params.dishId);
    if (!foundDish) {
        // dish not found
        return next({
            status: 404,
            message: "dish not found"
        })
    }
    // save dish in res.locals
    res.locals.foundDish = foundDish
    next();
}

// validate request parameters
function validateParam(propertyName) {
    return function (req, res, next) {
        const {data = {}} = req.body;
        if (data.price < 0 || typeof (data.price) !== 'number') {
            // validate price > 0
            return next({status: 400, message: `price must be greater than 0`});
        }
        if (data[propertyName]) {
            // continue to next if property present
            return next();
        }
        next({status: 400, message: `Must include a ${propertyName}`});
    };

}

// list all dishes
const list = (req, res) => res.json({data: dishes});
// read single dish
const read = (req, res) => res.json({data: res.locals.foundDish});
// delete a dish
const deleteDish = (req, res) => res.status(405).json({error: 'not implemented'});

// create a dish
const create = (req, res) => {
    req.body.data.id = nextId();
    dishes.push(req.body.data);
    res.status(201).json({data: req.body.data});
}

/**
 *
 * updates a dish
 * dish id is ``not`` able to be overwritten
 *
 */
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