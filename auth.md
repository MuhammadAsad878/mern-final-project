 **Authentication**
 is to authenticate user like signup and login to check whether user is registered or not

 **Authorization** is the process of verifiying what specific applications, files, and data a user has access to
 like post edit, delete comment, delete post etc. A review is only deleted by its creator only

 **Storing Passwords**
 we never store the passwords as it it. We store their hashded form so that if it leaks then the unauthorized person even if he had passwords does't able to view it as hashing causes passwords to be irreversible to decrypt 
 **e.g**
 password = "helloworld"
 hashedForm = "983jjdsf983nkdsf8723n4sdf9832nfjso03f9832nfjso03nkdsf87"

 **Hashing**
// In hashing we convert password to hash form which is impossible to retrieve and whenever user login or change password then user entered password will also be converted to hash password using hasing function if both user entered and user stored password in database are equal then authentication successfull
// Hasing output remains same for same input

**Hashing Characteristics**
1. For every input, there is a fixed output
2. They are one-way function as we can only convert simple   password to hash form  e.g modulus function to calculate absolute value like Math.abs(-5) = 5, Math.abs(5) =5 we can't justify that what will be the previous value 
3. For a different input, there is different output but of same length
4. Small changes in input should bring large change in output
5. For every input, there is a fixed output
6. Output length will be same for different input

**Hasing Functions examples**
We mostly prefer slow algorithms or hash functions
1. SHA-256 `is not very good but fast as it will not prevent brute force attack as anyone can try brute force fastly `
2. MD5
3. Bycrypt
4. CRC

**Salting**
Password salting is a technique to protect passwords tored in databased by `adding a string of 32 or more characters and then hashing them`.
So, that by appending extra values or we say bits like in networking it will change original password also so that even if hackers can crack our hashing algorithm then he will not retrieve password as it is also changed by adding salting so that even if common password then it will also be not normal
`Reverse Lookup table made by hackers so that they can retrieve some common passwords`

*Node.js* also has prebuilt tools which provide automatic salting and hashing of passwords so we dont have to apply authentication from scratch e.g 

***Passport.js***
Passport is an authentication middleware or we say a library which provide 
*multiple strategies*
like signup or login using
github, google,appleid, slack, discord, instagram, amazon email id, linkedin, spotify, microsoft, or facebook etc based authentication.

we first use passport local strategy to setup authentication and authorizaitons

**Get Started with Passport.js using pbkdf2 hashingAlgo**
1. `npm i passport`
strategy for example passport-local
2. `npm i passport-local`
if we want to use with mongoose for db then
3. `npm i passport-local-mongoose`

// You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
`https://www.npmjs.com/package/passport-local-mongoose?activeTab=readme`
`https://mherman.org/blog/user-authentication-with-passport-dot-js/`


**User Model**
e.g 
user: username, password, email,
 models > user.js 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// It will automatically adds instance methods like
1. setPassword(password, [cb])
2. changePassword(oldPassword, newPassword, [cb])
3. authenticate(password, [cb])
4. resetAttempts([cb])


const userSchema = new Schema({
  email: {
    type: String,
    required: true, 
  }  // username will automatically add username, hash, salt fields  by passportLocalMongoose
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

**Configuring Strategy**
Basic settings to apply our strategy e.g we are using local strategy

1. passport.initialize()
A middleware that initializes passport.

2. passport.session()
A web application needs the ability to identify users as they browse from page to page. This series of requeist and responses, each associated with the same user, is known as a session.

3. passport.use( new LocalStrategy( User.authenticate()));

**Implementation**
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

// to add or serializeUser from session
// to remove or deserializeUser from session


**DEMO User**

app.get( '/registerUser', async ( req, res ) => {
  let fakeUser = new User({ 
    email: "abc@gmail.com",
    username: "user1"
    });
//let newUser = await User.register(user,"password");
this method automatically register our user in db

    let newUser = await User.register(fakeUser,"helloworld");
    res.send(newUser);
});

**Signup user GET /signup POST /signup**
// GET /signup to get signup form
// POST /signup to register user 

1. routes > user.js
const express = require('express');
const router = express.Router();

router.get("/signup", (req,res)=>{
  res.render('signup.ejs');
});

router.post("/signup", wrapAsync( req,res )=>{
  try{
  let {username, email, password} = req.body;
  const newUser = new User({email, username});
  const regUser = await User.register(newUser,password);
  req.flash("success","User registered successfully");
  res.redirect("/home or /listing");
  }catch(err){
    throw new ExpressError(400,err); 
    OR
    req.flash("error", err.message);
    res.redirect("signup");
  }
})

module.exports = router;

2. views/users/signup.ejs
layout('boilerplate')

    <form action="/signup" method="POST" class="needs-validation" novalidate>
    username required
    email    required
    passport required
    button

    </form>


**LOGIN User**
GET /login to get login form
POST /login to authenticate user

routes > user.js

router.get('/login', (req,res)=>{
  res.render('login.ejs');
});

// we add passport.authenticate() middleware before request to authenticate request with parameters as first your strategy e.g local or your strategy name  then options 

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  wrapAsync(req,res)=>{
    req.flash("success","Welcome back..");
    res.redirect('/home or /listings');
  })