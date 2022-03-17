const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));

const nextId = require("../utils/nextId");

function validateParam(propertyName) {
    return function (req, res, next) {
        const {data = {}} = req.body;
        if(propertyName === 'status' && data['status'] === 'invalid') {
            next({status: 400, message: `status is invalid`});
        }
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
    const order = orders.find(x => x.id === req.params.orderId);
    if (!order) {
        next({
            status:404,
            message: `order ${req.params.orderId} not found`
        })
    }
    res.locals.order = order;
    next();
}

const list = (req, res) => res.json({data: orders});

const read = (req, res) => res.json({data: res.locals.order});

const create = (req, res) => {
    req.body.data.id = nextId();
    orders.push(req.body.data);
    res.status(201).json({data: req.body.data});
}

const update = (req, res) => {
    if (req.body.data.id && req.body.data.id !== req.params.orderId) {
        return res.status(400).json({error: `id ${req.body.data.id} does not equal ${req.params.orderId}`})
    }
    if (!req.body.data.id) {
        res.locals.order = req.body.data;
        res.locals.order.id = req.params.orderId;
        res.json({data: res.locals.order})
    }
    res.locals.order = req.body.data;
    res.json({data: res.locals.order});
}

const deleteOrder = (req,res) => {
    if(res.locals.order.status !== 'pending') {
        res.status(400).json({error:'order can only be deleted if status is pending'})
    } else {
        orders.splice(orders.indexOf(res.locals.order));
        res.status(204).json({data:res.locals.order});
    }

}

module.exports = {
    list,
    deleteOrder: [
        doesOrderExist,
        deleteOrder
    ],
    read: [
        doesOrderExist,
        read
    ],
    create: [
        validateParam('deliverTo'),
        validateParam('mobileNumber'),
        validateParam('dishes'),
        validateDishesArray,
        create
    ],
    update: [
        doesOrderExist,
        validateParam('deliverTo'),
        validateParam('mobileNumber'),
        validateParam('dishes'),
        validateParam('status'),
        validateDishesArray,
        update
    ]
}