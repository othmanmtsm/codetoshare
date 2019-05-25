var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'eff app' });
});

router.get('/about', function(req,res,next){
  res.render('about', { title: 'eff app' })
});

router.route('/contact')
  .get((req,res,next) => {
    res.render('contact', { title: 'eff app' });
  })
  .post((req,res,next) => {
    req.checkBody('name', 'name required').notEmpty();
    req.checkBody('email', 'invalid email').isEmail();
    req.checkBody('message', 'message required').notEmpty();

var errors = req.validationErrors();

if (errors) {
  res.render('contact', { 
    title: 'eff app',
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    errorMessages: errors
});
}else{
    let mailOptions = {
      from: 'eff <no-reply@eff.com>',
      to: 'othman.motassim18@gmail.com',
      subject: 'you got a new message from a visitor',
      text: req.body.message
    }

    transporter.sendMail(mailOptions,(error,info)=>{
      if (error) {
        return  console.log(error);
      }
      res.render('thanku', { title: 'eff app' });
    });
  }
});

module.exports = router;
