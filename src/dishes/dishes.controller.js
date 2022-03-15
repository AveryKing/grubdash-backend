const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const list = (req,res) => {
    res.json({data:dishes})
}


// TODO: Implement the /dishes handlers needed to make the tests pass

module.exports = {
    list
}