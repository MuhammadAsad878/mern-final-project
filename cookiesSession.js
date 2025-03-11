// MODULES || Packages || Libraries 
import express from 'express';                    // Express framework
import cookieParser from 'cookie-parser';  // middleware to parse cookies as we cant directly parse cookies
import expressSession from 'express-session';  // an attempt to make our session stateful storing data on server


const app = express();
const sessionOptions = {
  saveUninitialized: true,
  secret: 'mysecret',
  resave: true,
};
app.use(expressSession(sessionOptions));
app.use(cookieParser("ourSecretKey"));
// this middlware handles cookies to parse easily which otherwise is not possible in this we pass ourSecretKey in cookie parser to sign our cookies to be signed so that we can check whether our data in cookies is tempered or not if we change our signed cookie from browser application > cookies then it if we get req.signedCookies it will return object null prototype 
// if we change whole cookie value => {}
// if we change only cookie value => {namw: false}

//Cookies are small pieces of data stored in a user's browser when they visit a website. They help websites remember user preferences, sessions, and authentication details stored in name value pairs.

// app.get('/req-count',(req,res)=>{
//   if(req.session.count){
//     req.session.count ++;
//   }else{
//     req.session.count = 1;
//   }
//   res.cookie('count',req.session.count);
//   res.send(`Your request count is ${req.session.count}`);
// });

// app.get('/greet',(req,res)=>{
//   // let {name = "anonymus"} = req.cookies; if we want to access unsigned cookied
//   let {name = "anonymus"} = req.signedCookies; // 

//   res.send(name);
// });

// app.get('/set', (req,res)=>{
//   res.cookie("name","Muhammad Asad",{maxAge:10000,signed:true}); // maxAge shows in how much time this cookie expired
//   res.send("cookies set");
// });

// app.get('/del',(req,res)=>{
//   res.clearCookie("name");
//   res.send("Cookie delete");
// });

// // Signed Cookies


app.get('/',(req,res)=>{
  let count = req.session.count ? req.session.count++ : req.session.count = 1;
console.log(req.session);
  res.send(`<h1>Request received Request count = ${count}</h1>`);

});


app.listen(3000, ()=>console.log("Server started", 'http://localhost:3000/'));