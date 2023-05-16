const path = require('node:path'); // path module to find absolute paths on the system 
const fs = require('node:fs'); // file system module to manipulate files
const passport = require('passport'); // the main star of the show
const LocalStrategy = require('passport-local'); // the co-protagonist in this sequel 
const User = require("../models/userDetails");
// //const dbpath = path.join(__dirname, 'db.json'); // path to our custom in-house json database

// const fetchUser = (email, password, done) => {
//     const user = User.find({email: email})
//     if (!user)
//     {
//       done(null, false);
//     }
//     else if (!(user.password === password))
//     {
//       done(null, false);
//     }
//     else{
//       done(null, user);
//     }
// }

// passport.serializeUser((user, done) => { 
//   console.log(user)     
//   done(null, user.id)

// // Passport will pass the authenticated_user to serializeUser as "user" 
// // This is the USER object from the done() in auth function
// // Now attach using done (null, user.id) tie this user to the req.session.passport.user = {id: user.id}, 
// // so that it is tied to the session object
// } )


// passport.deserializeUser((id, done) => {
//       console.log(id)
//       const user = User.findById(id)
      
//       if (user)
//         done(null, user)  
//       else
//         done(null, false)    
// // This is the id that is saved in req.session.passport.{ user: "id"} during the serialization
// // use the id to find the user in the DB and get the user object with user details
// // pass the USER object in the done() of the de-serializer
// // this USER object is attached to the "req.user", and can be used anywhere in the App.
// }) 

// passport.serializeUser((user, done) => { 
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   if (!fs.existsSync(dbpath)) { // if db does not exist, create db
//     fs.writeFileSync(dbpath, JSON.stringify({ users: [] }));
//   }

//   const db = JSON.parse(fs.readFileSync(dbpath, { encoding: 'utf-8' }));

//   let user = db.users.find((item) => item.id === id);

//   if (!user) {
//     done(new Error('Failed to deserialize'));
//   }

//   done(null, user);
// });

// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     if (!fs.existsSync(dbpath)) { // if db.json does not exist yet, we create it
//       fs.writeFileSync(dbpath, JSON.stringify({ users: [] }));
//     }

//     const db = JSON.parse(fs.readFileSync(dbpath, { encoding: 'utf-8' }));

//     let user = db.users.find((item) => {
//       return item.username === username && item.password === password;
//     });

//     if (!user) {
//       user = {
//         id: Math.floor(Math.random() * 1000), // generate random id between numbers 1 - 999
//         username,
//         password,
//       };

//       db.users.push(user);
//       fs.writeFileSync(dbpath, JSON.stringify(db));
//     }

//     done(null, user);
//   })
// );

//module.exports = fetchUser;