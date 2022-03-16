const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

const list = (req,res) => {
    res.json({data:orders});
}
// TODO: Implement the /orders handlers needed to make the tests pass

module.exports = {
    list
}