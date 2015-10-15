# toEatly with Mongoose
Can you modify this CRUD app to use MongoDB?

##First things first:  Install Party!

We need to use brew to [install](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) our new **MongoDB** database system!

From the console:

```bash
brew install mongodb
```

Now we need to create a directory for **MongoDB** to save and store data.

From the console: 

```bash
sudo mkdir -p /data/db
```

Let's ensure that the folder permissions allow us to read and write to our newly made directory.

From the console:

```bash
sudo chown -R $USER	/data/db
```

You may also want to do a global install of [nodemon](http://nodemon.io). Nodemon automatically restarts our server when we make any changes in our source code.

```bash
npm install -g nodemon
```

## Project Setup

Install application packages/dependencies:

```bash
npm install
```

Run the server:

```bash
mongod
nodemon index.js
```

## Instructions

Our foods data is currently hardcoded in `server.js` and lives in active memory. When the server restarts, we lose our data. Your goal is integrate MongoDB into your routes so that you can permenantely save/persist data across sessions.

By the end of this process we should have the following application directory (note the `models` folder):

```
    models/
        index.js
        food.js
    public/
        css/
            main.css
        js/
            app.js
    views/
        index.html
    .gitignore
    server.js
    package.json
    README.md    
```

**NOTE:**
One important difference between the `toEatly_mongoose` project and the original toEatly project is that we have globally changed `foods.id` to `foods._id` because of a strict naming convention in `mongoose`


#### Step 1. Create the Food Model / Schema

Install `mongoose` inside our project directory:

``` bash
npm install --save mongoose
```

Next we want to create our models directory (this is where our database magic will happen):

``` bash
mkdir models
touch models/food.js
```

Let's create `Food` model. A `Food` has a few different characteristics: `name`, and `yumminess`.

To create a `Food` model we have to use a Schema in `models/food.js`

```js
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var FoodSchema = new Schema({
    name: String,
    yumminess: String
});
```

[Here is a link to all of the different datatypes we can use in a Schema](http://mongoosejs.com/docs/schematypes.html)

Finally, at the bottom of `food.js` we need to create the `Food` model and export it (that way we can use it in other parts of our app):

```js
var Food = mongoose.model('Food', FoodSchema);
module.exports = Food;
```

#### Step 2. Connect to the Database
Next, let's wire it all up:

```bash
touch models/index.js
```

Inside of `models/index.js` we need to create and connect to our mongoose database (this is where the magic happens):

``` javascript
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/to_eatly_app");

module.exports.Food = require("./food");
```

#### Step 3. Sanity Check - Plug the database into node

Now that we've done all the hard work, all that's left is to "require" our models.

If you open the node REPL by typing `node` in the terminal, you can do the following:

```bash
var db = require('./models');

db.Food.create({name: "foo", tastiness: "very"}, function (err, food) {
    if (err) { return console.log(err); };
    console.log(food);
});
```

Now you should be able to type the following, and see our new food item:

```js
    db.Food.find({}, function(err, foods){
        if (err) { return console.log("Error:  No Food db created."); }
        console.log(foods)
    })
```

If this does not work, the solutions branch includes a more complete `seed.js` file which you can copy and run from the CLI:

```bash

node seed.js
```

**Now let's do it in the express app!**

#### Step 3. Plug the database into express

Add this line near the top of `server.js`:

```
var db = require('./models');
```

#### Challenge

The time has come for us to swap out all our hardcoded data for live data from our database. This will require us to methodically alter each route to accomodate the new data store. Where should we start!?

Hint: Here's what our index route might look like:

``` javascript
app.get("/allthefoods", function(req, res){

    db.Food.find({}, function(err, foods){
        if (err) {
            console.log("Error! Could not find foods.");
            return res.sendStatus(400);
        }
        res.send(foods);
    })

})
```

