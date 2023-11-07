
require('dotenv').config();

const express = require("express"); //1
const path = require("path")
const app = express(); //2
const port = process.env.PORT || 3000 //4

const hbs = require("hbs")


//bcryptjs
const bcrypt = require("bcryptjs")
const securePassword = async(password)=>{
  //to decrpt pswd
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash)

  const passwordmatch = await bcrypt.compare("giri@", passwordHash);
  console.log(passwordmatch)
} 

securePassword("giri@123")
//if pswd cant be decrpted then how to recheck if pswd matches or not


require("./db/conn");

const Register = require("./models/registers")

//to use html page
const static_path = path.join(path.join(__dirname, "../public"));
const template_path = path.join(path.join(__dirname, "../templates/views"));
const partials_path = path.join(path.join(__dirname, "../templates/partials"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path)); //checks index.html
app.set("view engine", "hbs");
app.set("views",template_path) //instead of views, look for tempalate path
hbs.registerPartials(partials_path)
//////////////////////////////////////////


// console.log(process.env.SECRET_KEY);


app.get("/", (req,res)=>{ //3
  res.render("index")
});

app.get("/register",(req,res)=>{
  res.render("register")
})


//for login form
app.get("/login",(req,res)=>{
  res.render("login")
})


// create a new user in our db
app.post("/register",async (req,res)=>{
  try{
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if(password === cpassword){
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        gender:req.body.gender,
        phone:req.body.phone,
        age:req.body.age,
        password:password,
        confirmpassword:cpassword 
      })

      //By the above code, we get the data and by the below code
      // we save the data into database as plaintext
      //But inorder to hash it and then save, we need to 1st hash it

      //that is called as middleware

      // go to registerPartials.js last part


      //jwt token
      //also we need to verify if this token data belongs to user or not
      console.log("the success part" + registerEmployee);

      const token = await registerEmployee.generateAuthToken();
      console.log("the token part" + token);
      // go to registers.js

      const registered = await registerEmployee.save()
      console.log("the page part " + registered);

      res.status(201).render("index");

    }else{
      res.send("password not matching")
    }

  }catch(error){
    res.status(400).send(error);
    console.log("the error part page")
  }
})



//login check
app.post("/login",async(req,res)=>{
  try{
    const email = req.body.email;
    const password = req.body.password;

    //if email enterd is valid or not. i.e does the email already exist in db
    //if not, then give error
    const useremail = await Register.findOne({email:email}) //db email : user filled email
    // res.send(useremail.password); //to know user password

    const isMatch = await bcrypt.compare(password, useremail.password); //pwsd entered, with db pswd

    //adding tokens when user logins
    const token = await useremail.generateAuthToken();
    console.log("the token part " + token);

    if(isMatch){
      res.status(201).render("index");
    }else{
      res.send("invalid pswd details")
    }
    // console.log(useremail)

  }catch(error){
    res.status(400).send("invalid login details")
  }
})



//Json web token(jwt)
const jwt = require("jsonwebtoken")

const createToken = async() =>{
  const token = await jwt.sign({__id:"654885d2dc2f49135c3d5762"},process.env.SECRET_KEY,{
    expiresIn:"2d"
  });//({__id:},"secretkey to verify(32 chars)")
  console.log("this is token")
  console.log(token); //displays token
  //"header part"."payload(body data, here uniq __id)". "it gives some uniq data to differentiate"

  //user verification
  const userVar = await jwt.verify(token, "mynameisgiridharkirthikhstudentss");
  console.log(userVar); //we get id iat
}


createToken();



app.listen(port, ()=>{ //5
  console.log(`server is running at port no ${port}`)
})

//npm run dev

//go to db