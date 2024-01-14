const express= require("express");
const app=express();
const mongoose= require("mongoose");
const path =require("path");
const Chat =require("./models/chat.js");
const methodOverride = require('method-override');

// -------------------------------INITIALIZATION-----------------------------------------------------------------------
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 

app.listen(8080,()=>{
console.log("Server is listening to port 8080");
});

main().then(()=>{
    console.log("connection succsessful with database");
})
.catch((err) =>console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}
// -----------------------------------------------------------------------------------------------------

//saving chat to database whatsapp. we will create a file init.js where some sample data will be there
// after running it our db will store that data

// Data added by using init.js file in whatsapp database

// -------------------------------------------------------------------------------------------------------

// Index Route Creation

app.get("/chats", async (req,res)=>{
    let chats= await Chat.find();        // async it will be so await is needed then get all chats from db;
    res.render("index.ejs",{chats});
});

//New chat Route
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");

});

// Create and Post
app.post("/chats",(req,res)=>{
    let {from,msg,to}=req.body;
    let newChat= new Chat({
        from:from,
        msg: msg,
        to: to,
        created_at : new Date()
    });
     newChat.save().then((res)=>{console.log("Saved new Chat");})
                   .catch((err)=> {console.log(err);})
    res.redirect("/chats");
});

//Edit Route
app.get("/chats/:id/edit",async (req,res)=>{
     let {id}=req.params;
     let chat= await Chat.findById(id);
     res.render("edit.ejs",{chat});
});

app.put("/chats/:id", async (req,res)=>{
   let {id}=req.params;
   let {msg: newmsg}=req.body;
 
let updatedChat= await Chat.findByIdAndUpdate(id,{msg:newmsg},{runValidators:true ,new:true});
console.log(updatedChat);

   res.redirect("/chats");

});

//Delete Route

app.delete("/chats/:id",async (req,res)=>{
    let {id}=req.params;
    let chat= await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
});














