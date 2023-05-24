//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

  const itemSchema = new mongoose.Schema({
    name: String
  });

  const Item = mongoose.model('Item', itemSchema);
  const item1 = new Item({ name: 'Welcome to your todolist' });
  const item2 = new Item({ name: 'Hit the + button to add new items' });
  const item3 = new Item({ name: '<-- hit this to delete any item' });

  const defaultItems = [item1, item2, item3];
  

  app.get("/",async function(req, res) {
    const itemarr = await Item.find({});

    if (itemarr.length === 0) {
      Item.insertMany(defaultItems).then(function () {
      console.log("Successfully saved");
    });
  }
  console.log(itemarr.length);

  res.render("list", {listTitle: "Today", newListItems: itemarr});
    
  });
  app.post("/",function(req, res){

    const itemName = req.body.newItem;
    const NewTask = new Item({ name: itemName });
    NewTask.save();

    res.redirect("/");
    
  });

  app.post("/delete", (req,res)=>{
    const checkedid = req.body.checkbox;
    Item.findByIdAndRemove(checkedid).then(function () {
      console.log("Successfully deleted");
      res.redirect("/");
  })});
  
  app.get("/:customListname", (req,res)=>{
    const customlistname = req.params.customListname;  
    
  });

  app.get("/work", function(req,res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
  });
  
  app.get("/about", function(req, res){
    res.render("about");
  });
  
  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
}





