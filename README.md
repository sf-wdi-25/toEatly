# toEatly with Mongoose

## Instructions
Earlier we built an Express app using hard-coded data, without a database. The data lives in active memory, so when the server restarts, we lose any changes to our data.

Your goal is integrate MongoDB into your routes so that you can permenantely save and persist data across sessions.

The master branch of this repo gives us the state of code at the end of Sprint three.


##Step 0:  Install MongoDB and mongoose

We need to use brew to [install](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) our new **MongoDB** database system. We start by updating brew, just in case anything has changed. From the console:

```bash
brew update

brew install mongodb
```

Now we need to create a directory on our hard drive for **MongoDB** to save and store data. From the console: 

```bash
sudo mkdir -p /data/db
```

We need to change ownership (`chown`) of this database folder to set permissions for our user to read and write to our newly made data directories. From the console:

```bash
sudo chown -R $USER /data/db
```

We are also going to do a global install of [nodemon](http://nodemon.io). This is an optional step, but `nodemon` automatically restarts our server when we make any changes in our source code.

```bash
npm install -g nodemon
```

## Project Setup

If you aren't there already, change directory to your project. Since a new clone Now let's install our new application packages/dependencies:

```bash
npm install
```

Finally, install `mongoose` inside our project directory:

``` bash
npm install --save mongoose
```

Now we are ready to turn on our MongoDB database engine:

```bash
mongod
```

You need to leave this process running while you develop. In Mac Terminal, press `command T` to open a new tab at the same directory.

Now let's fire up the server!

```bash
nodemon
```

#### Step 1. Create the Food Model / Schema

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
    yuminess: String
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

There should be a considerable amount of output.

If this did not work, the solutions branch includes a more complete `seed.js` file which you can copy and run from the CLI:

```bash
node seed.js
```

**Now let's do the same thing in the Express app!**

#### Step 3. Plug the database into express

Add this line near the top of `server.js`:

```
var db = require('./models');
```

#### Challenge

The time has come for us to swap out all our hardcoded data for live data from our database. This will require us to methodically alter each route to accomodate the new data store. Where should we start!?

Hint: Here's what our index route might look like:

``` js
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

*NOTE: You will need to change `foods.id` to `foods._id` because of a strict naming convention in `mongoose`.*




