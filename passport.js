const Admin              = require('./models/admin-model')
const LocalStrategy      = require('passport-local');
const bcrypt             = require('bcrypt');


function initialize(passport){
     
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => Admin.findById(id, (err, user) => done(err, user)))


passport.use(new LocalStrategy(function (username, password, done) {
    // Check username in database
   Admin.findOne({username: username}, function (err, user) {
     if(err){ return done(err) }
     if(!user){ return done(null, false, {msg: 'Username is incorrect!'}) }
   // Check password correctness
    bcrypt.compare(password, user.password, function (err, res) {
        if(err){ return done(err) }
        if(res === false || res === undefined) { return done(null, false, {msg: 'Password is incorrect!'})}

        return done(null, user)
    })
     

   })

    
}))

}

module.exports = initialize;