var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/login')
  .get((req, res, next) => {
    res.render('login', { title: 'Authentifier'});
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/login'
  }), (req, res) => {
    res.redirect('/');
  });



router.route('/register')
    .get((req,res,next)=>{
        res.render('register',{ title: 'Register new account' });
    })
    .post((req,res,next)=>{
        req.checkBody('name', 'Nom vide').notEmpty();
        req.checkBody('email', 'Email non valide').isEmail();
        req.checkBody('password', 'Entrez votre mot de passe').notEmpty();
        req.checkBody('password', 'Erreur confirmation mot de pass').equals(req.body.confirmPassword).notEmpty();

        var errors = req.validationErrors();
        if (errors) {
        res.render('register', {
            name: req.body.name,
            email: req.body.email,
            errorMessages: errors
        });
        } else {
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.setPassword(req.body.password);
        user.save((err) => {
            if (err) {
            res.render('register', {errorMessages: err});
            } else {
            res.redirect('/login');
            }
        })
        }
    });

module.exports = router;