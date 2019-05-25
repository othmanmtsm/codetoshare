var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



passport.serializeUser((user,done)=>{
    done(null, user._id);
});

passport.deserializeUser((id, done)=>{
    User.findOne({_id:id},(err,user)=>{
        done(err,user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    (username,password,done)=>{
        User.findOne({email: username}, (err,user)=>{
            if(err) return done(err);
            if(!user){
                return done(null, false, {
                    message: 'Email ou mot de passe incorrect'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Email ou mot de passe incorrect'
                });
            }
            
            return done(null, user);
        });
    }
));