var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


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


passport.use(new FacebookStrategy({
        clientID: '417121469127771',
        clientSecret: '0f4bcdf5715512304adc47b188429a65',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['id','displayName','email']
    },function(token,refreshToken,profile,done){
        User.findOne({'facebookId':profile.id},function(err,user){
            if(err) return done(err);

            if (user) {
                return done(null,user);
            }else{
                User.findOne({email:profile.emails[0].value},function(err, user){
                    if (user) {
                        user.facebookId = profile.id;
                        return user.save(function(err){
                            if(err) return done(null,false,{message:'cannot save user'});
                            return done(null, user);
                        })
                    }

                    var user = new User();
                    user.name = profile.displayName;
                    user.email = profile.emails[0].value;
                    user.facebookId = profile.id;
                    user.save(function(err){
                        if(err) return done(null,false,{message:'cannot save user'});
                        return done(null,user);
                    });
                })
            }
        })
    }
));