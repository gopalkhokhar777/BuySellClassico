const express =require("express");
const app= express();
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productsRoutes");
const bidsRoutes = require("./routes/bidsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
app.use(express.json());
dotenv.config();

const port =process.env.PORT || 5000;
const dbconfig = require("./config/config");

app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/bids",bidsRoutes);
app.use("/api/notifications",notificationRoutes);


// deployment config
const path =require("path");
__dirname = path.resolve();
// render deplyoment....
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/client/build")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"client","build","index.html"));
    })
}

app.listen(port,()=>{
    console.log(`Node/express js server on port ${port}`);
})