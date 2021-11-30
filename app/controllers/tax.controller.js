const { INTEGER } = require("sequelize/dist");
const db = require("../models");
const Tax = db.taxes;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate item request
    if (!req.body.name) {
      res.status(400).send({
        message: "item cant be empty!"
      });
      return;
    }
  
    // Create item request
    const tax = {
      name: req.body.name,
      taxcode: req.body.taxcode,
      price: req.body.price
    };
  
    // Insert item into the database
    Tax.create(tax)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating item"
        });
      });
  };

// Retrieve all items and count subtotal, taxtotal and grandtotal.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  
    Tax.findAll({ where: condition })
      .then(data => {
        let subTotal = 0;
        let refundable = [];
        let grandTotal = 0;
        let taxTotal = 0;

        data.forEach(record => {
          let tax = 0;
          switch(record.taxcode){
            case '1' : 
            tax = 0.1 * +record.price;
            console.log(record.price)
            console.log(tax)
            refundable.push({
              'Name': record.name,
              'Tax Code': record.taxcode,
              'Type': 'Food & Beverage',
              'Refundable': 'Yes',
              'Price': record.price,
              'Tax': tax,
              'Amount': +tax + +record.price
            });
            taxTotal = +taxTotal + +tax;
              break;
            case '2' :
              tax = 0.01 * record.price + 10;
            refundable.push({
              'Name': record.name,
              'Tax Code': record.taxcode,
              'Type': 'Tobacco',
              'Refundable': 'No',
              'Price': record.price,
              'Tax': tax,
              'Amount': +tax + +record.price
            });
            taxTotal = taxTotal + tax;
              break;
            case '3' :
              tax = record.price < 100 ? 0 : 0.01 * (record.price - 100); 
            refundable.push({
              'Name': record.name,
              'Tax Code': record.taxcode,
              'Type': 'Entertainment',
              'Refundable': 'No',
              'Price': record.price,
              'Tax': tax,
              'Amount': +tax + +record.price
            });
            taxTotal = +taxTotal + +tax;
              break;
            default: 
              break;
          }
          subTotal = +subTotal + +record.price
          grandTotal = +grandTotal + +tax + +record.price;
        });
        console.log(subTotal);
        console.log(taxTotal);
        console.log(grandTotal);
        res.send({'Data': refundable, 'Price Subtotal' : subTotal, 'Tax Subtotal': taxTotal, 'Grand Total': grandTotal});
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving items"
        });
      });
  };