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

// TODO: Implement the /dishes handlers needed to make the tests pass

module.exports = {
    list, read
}