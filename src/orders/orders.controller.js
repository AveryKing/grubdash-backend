const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));

const nextId = require("../utils/nextId");

function validateParam(propertyName) {
    return function (req, res, next) {
        const {data = {}} = req.body;
        if (data[propertyName]) {
            return next();
        }
        next({status: 400, message: `Must include a ${propertyName}`});
    };
}

const validateDishesArray = (req,res,next) => {
    if (req.body.data.dishes.length === 0) {
        res.status(400).json({error: 'dishes array cannot be empty'})
    }
    if (typeof (req.body.data.dishes) !== 'object') {
        res.status(400).json({error: 'dishes must be an array'})
    }
    if (req.body.data.dishes.some(x => !x.quantity)) {
        res.status(400).json({error: 'dish must have a quantity of at least 1 (cannot be 0!)'});
    }
    req.body.data.dishes.forEach(dish => {
        if (!Number.isInteger(dish.quantity)) {
            res.status(400).json({error: `quantity must be an integer (1, 2, 3, 4, 5, etc... )`})
        }
    })
    next();
}
const doesOrderExist = (req,res, next) => {

}

const list = (req, res) => {
    res.json({data: orders});
}

const read = (req, res) => {
    const order = orders.find(x => x.id === req.params.orderId);
    if (!order) {
        return res.status(404).json({error: `order ${req.params.orderId} not found`})
    }
    return res.json({data: order})
}

const create = (req, res) => {
    req.body.data.id = nextId();
    orders.push(req.body.data);
    res.status(201).json({data: req.body.data});
}

module.exports = {
    list,
    read,
    create: [
        validateParam('deliverTo'),
        validateParam('mobileNumber'),
        validateParam('dishes'),
        validateDishesArray,
        create
    ]
}