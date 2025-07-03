const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const path = require("path");
const cors = require('cors')
//const bodyParser = require('body-parser')
//routes installing
const userRoute = require('./user/user.routes')
const multerRoute= require('./multer/routes')
const signatureRoute = require('./signature/signature.routes');
const signedRoute = require('./generateSign/signed.routes');
const emailRoute = require("./email/email.routes");
const auditRoute = require('./audit/audit.route'); 
const pdfDownRoutes = require('./pdfDownload/pdfDown.router');

const app = express()
dotenv.config()
//app.use(bodyParser.json())
app.use(express.json());
app.use(cors())

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/signed', express.static('signed'));


const PORT =process.env.PORT || 4000
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("mongodb connected succesfully"))
    .catch((err)=>console.log("not connected to DB",err))

//  Register routes AFTER middleware
app.use('/user',userRoute)
app.use('/api/docs',multerRoute) //multer main route
app.use('/api/signature', signatureRoute);
app.use('/api/signed', signedRoute);
app.use("/api/email", emailRoute);
app.use('/api/audit', auditRoute);
app.use("/api/docs", pdfDownRoutes); 

app.get('/',(req,res)=>{
    res.send("<h1>welcome to signature app</h1>")
})

app.listen(PORT,()=>{
    console.log(`server is running port number ${PORT}`)
})
