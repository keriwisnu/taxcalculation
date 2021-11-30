module.exports = app => {
    const taxes = require("../controllers/tax.controller.js");
  
    var router = require("express").Router();
  
    // Create item 
    router.post("/", taxes.create);
  
    // Retrieve all 
    router.get("/", taxes.findAll);
  
    app.use("/api/taxes", router);
  };