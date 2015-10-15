// SERVER-SIDE JAVASCRIPT

// REQUIREMENTS //
var express = require("express"),
    app = express(),
    path = require("path"),
    bodyParser = require("body-parser");

var where = require("./utils/where");

var db = require('./models');

// CONFIG //
// set ejs as view engine
app.set('view engine', 'ejs');
// serve js & css files
app.use("/static", express.static("public"));
// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

// DATA //
// This will come from seed.js
// var foods =[
//   {_id: 0, name: "Sushiritto", yumminess: "quite"},
//   {_id: 1, name: "Green Eggs & Ham", yumminess: "sure"},
//   {_id: 2, name: "Crayfish", yumminess: "depending"},
//   {_id: 3, name: "Foie Gras", yumminess: "omg"},
//   {_id: 4, name: "Kale", yumminess: "meh"}
// ];

// ROUTES //
app.get("/", function (req, res){
  db.Food.find().exec(function(err, foods){
     res.render('index', {foods: foods});
  });
  // render index.html and send with foods data filled in
  // res.render('index', {foods: foods});
});

// api route to get all foods (sanity check)
app.get("/api/foods", function (req, res){
  console.log('get happens');
    var foods = db.Food.find();
 // get foods from Mongo db
 db.Food.find({}, function(err, foods){
    if (err) {
      console.log("Error: Could not find Food db: " + err);
      return res.sendStatus(400);
    }
    res.send(foods);
  });
});

// api route to create new food
app.post("/api/foods", function (req, res){
  var newFood = req.body;
   console.log(newFood);  
  db.Food.create(newFood, function(err, food){
    if (err) { return console.log(err); }
    console.log("created ", food.name);
    res.json(food);
    process.exit();
});

  // add a unique _id
  // if (foods.length !== 0){
	 //  newFood._id = foods[foods.length - 1]._id + 1;
  // } else {
  // 	newFood._id = 0;
  // }
  // add new food to DB (which, in this case, is an array)
  // foods.push(newFood);
  // send a response with newly created object
  // res.json(newFood);
});

// api route to delete a food
app.delete("/api/foods/:_id", function (req, res){
  var food = req.body;
  db.Food.find({_id:req.params.id}).remove().exec();
  // res.render('index', {foods: foods});
  // set the value of the id
  // var targetId = parseInt(req.params._id);
  // find item in the array matching the id
  // var targetItem = where(foods, {_id: targetId});
  // get the index of the found item
  // var index = foods.indexOf(targetItem);
  // remove the item at that index, only remove 1 item
  // foods.splice(index, 1);
  // send back deleted object
  // res.json(targetItem);
});

app.listen(3000, function (){
  console.log("listening on port 3000");
});