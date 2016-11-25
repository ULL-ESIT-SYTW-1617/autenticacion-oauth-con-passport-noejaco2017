"use strict";
var express = require('express');
var app = express();
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var exec = require('child_process').exec;
var logger = require('morgan');
// ### Jaco 12/11
var passport = require('passport');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var aplicacion = require(path.resolve(process.cwd(),"aplicacion.json"));


//*********************************************************
var github = require('octonode');
var url=require('url');

///*******************************************************
//app.use(express.static(__dirname + '/gh-pages'));
//##################################################### OAUTH WITH GITHUB
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(require('serve-static')(__dirname + 'views'));
app.use(logger('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'f584e68426cfda58592977e598a99eea68966503', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


//Inicializamos el midelware de passport con la app
// app.get('/', function (req, res) {
//   var html = "<ul>\
//     <li><a href='/auth/github'>GitHub</a></li>\
//     <li><a href='/logout'>logout</a></li>\
//   </ul>";
//
//   res.send(html);
// });

app.get('/',
  function(req, res) {
    console.log("RENDERIZO HOME");
    res.render('home', { user: req.user });
  });

  app.get('/login',
  function(req, res){
    console.log("RENDERIZO LOGIN");
    res.render('login');
  });


app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

app.get('/err', function(req, res){
  res.render('err');
});

app.get('/success', function(req, res){
  res.sendFile('index.html');
});

///
app.get('/gh-pages/index', function(req, res){
  res.redirect('https://alu0100836059.gitbooks.io/apuntes_sytw_16_17/content/');
});

app.get('/auth/github',
  passport.authenticate('github'));

  //function(req, res) {
    // No llegamos aquí
    // Aquí debemos comprobar si el usuario es miembro o no de la organización
    // y en función de eso dar acceso o no al libro.
    // GET /orgs/:org/members/:username

    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.


  //});
//////////////////////////////////////////////////////////////
// Organización a la que pertenece JacoboRG: demoMembership //
//////////////////////////////////////////////////////////////


app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),  function(req, res) {
    console.log("CCACACACACACACACCACCACACACACCCACACACCAC");


    //console.log("organizaciones: "+req.user.profile.username/orgs)
    console.log("ID:"+req.user.profile.id);
    console.log("TOKEEEEN"+req.user.accessToken)
    console.log("VALOR HTTP"+req.user.profile._json.organizations_url);
    console.log("USUARIO"+req.user.profile.username);

    var client = github.client( {id: req.user.profile.id, secret: req.user.accessToken});
    console.log("OBJECT CLIENT->"+ client);
    console.log("CLIENT LOGIN"+client.login);


    client.get('/users/'+req.user.profile.username+'/orgs', {}, function (err, status, body, headers) {
        if(err)console.log("ERROR -> "+err);
        console.log("HEAD -> "+headers);
        console.log("BODY -> "+body); //json object

        var i = 0;
        while (i < body.length){
          console.log(body[i].login);
          if(body[i].login == 'DSI1516' || 'demoMembership'){
          console.log("COINCIDE");
          app.use(express.static(__dirname + '/gh-pages'));
          res.redirect('/gh-pages/index')
          //res.redirect('./gh-pages/*');
        }else{
          console.log("No COINICIDEN");
          res.redirect('/err');
        }
        ++i;
        }

      });



    var urle = req.user.profile._json.organizations_url;
    var uri = url.parse(req.url);
    console.log("URIIIIIIIIIIIIIIIIIIIII"+uri.pathname);
    console.log("MOSTRANDO URL"+req.get(url+'/:org'));

    //if(req.get('/orgs/req.user.organizations_url/members/req.user.login')){
    // res.redirect('/users/' + req.user.username);

    //res.redirect('/auth/github/callback');
    //res.redirect('/');
  //  }

    // Successful authentication, redirect home.
    //res.redirect('/err');
});

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    console.log("RENDERIZO PROFILE");
    console.log(req.user);
    console.log("ID",req.user.profile.id);
    console.log("_RAW",req.user.profile._raw);
    res.render('profile', { id: req.user.profile.id,username:req.user.profile.username,user: req.user /*,displayName:*/});
  });

  passport.use(new GithubStrategy({
    clientID: aplicacion.Config.id_client,
    clientSecret: aplicacion.Config.secret_client,
    callbackURL: `https://${aplicacion.Config.nombre_app}.herokuapp.com/callback`
  }, function(accessToken, refreshToken, profile, done){
    console.log("ACCEDO A GITHUB PASSPORT");
      console.log("accessToken"+accessToken);
        console.log("refreshToken"+refreshToken);
          console.log("profile"+profile.id);
    //return done (null,profile);
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   console.log("BUSCO USUARIOS");
    //   console.log("accessToken"+accessToken);
    //     console.log("refreshToken"+refreshToken);
    //       console.log("profile"+profile);
    //       console.log("DONE"+done);
    //       console.log("USER"+user);
    //     return cb(err, user);
    //   });
    done(null, {
      accessToken: accessToken,
      profile: profile
    });
  }));

passport.serializeUser(function(user, done) {
  console.log("SERIALIZER");
  console.log("USUARIO"+user)
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  console.log("DESERIALIZER ID"+id);
//  User.findById(id, function(err, user) {
    //console.log("USER"+user);
    done(null, id);
  //});
});

 app.set('port', (process.env.PORT || 8080));



//
// Client ID
// 1f3b68617159ac9492c2
// Client Secret
// f584e68426cfda58592977e598a99eea68966503















//##################################################### OAUTH WITH GITHUB


// variable para acceder a nuestra confi de auth
// Areglar referencia a config/auth
// AQUI: var configAuth = './config/auth'
// configuracion estrategia facebook
// passport.use(new FacebookStrategy({
//     clientID: configAuth.facebookAuth.clientID,
//     clientSecret: configAuth.facebookAuth.clientSecret,
//     callbackURL: configAuth.facebookAuth.callbackURL
//   },



///////////////////////////////////////////////////////////////////////////
// passport.use(new FacebookStrategy({
//
//     callbackURL: 'http://localhost:8080/auth/facebook/callback'
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

/////////////////////////////////////////////////////////////////////////////


// OAuthStrategy = require('passport-oauth').OAuthStrategy;
// Comprobar el nombre de la estrategia y su compatibilidad
// con la nueva versión de la API de github v3.0
// ------- Comentado por cambio hacia una autenticacion a
// ------- través de facebook API -------------------
// var Strategy = require('passport-github').Strategy;
//
// passport.use(new Strategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: 'http://localhost:3000/login/github/return'
// },
// // Pasaremos aquí la referencia a nuestro token!?!?
// function(accessToken, refreshToken, profile, cb) {
//   return cb(null, profile);
// }));
//
// // Configurando sesión persistente
// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });
//
// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });
//
//
//
//
// ###



// // ###
// // app.use(require('morgan')('combined'));
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// // Inicializando passport y restaurando estado de autenticación si es que
// // existe alguno a través de session
// app.use(passport.initialize());
// app.use(passport.session());
// // ###

// app.get('/',function(req, res){
//   res.send('index');
// });

// ### Definiendo rutas autenticación github
// app.get('/',
//   function(req, res) {
//     res.render('home', { user: req.user });
//   });
//
// app.get('/login',
//   function(req, res){
//     res.render('login');
//   });
//
// app.get('/login/github',
//   passport.authenticate('github'));
//
// app.get('/login/github/return',
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });
//
// app.get('/profile',
//   require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//     res.render('profile', { user: req.user });
// });
// ###
////////////////////////////////////////////////////////////////////////////////
// ### TEMA FACEBOOK
// Añadimos al final el tema del scope:email para otorgar permisos en la
// obtención del email que nos servira para nuestra base de datos futura.
// app.get('/auth/facebook', passport.authenticate('facebook', {scope: ["email"]}));
//
// app.get('/auth/facebook/callback',
//         passport.authenticate('facebook', { successRedirect: '/',
//                                             failureRedirect: '/login'}));

/////////////////////////////////////////////////////////////////////////////////////

// este lo hace bien
//app.get('/get', function(request, response){
//
//   exec("ls", (err, stdout, stderr) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);
//     return;
//   });
//   return;
// });

app.post('/sync',function(req,res){
    console.log("Antes de la funcion");
    function puts(err,stdout,stderr){
      if(err)
      console.log("HA OCURRIDO UN ERROR"+err);
      }
      //proceso.exec('git clone git@github.com:ULL-ESIT-SYTW-1617/practica-despliegues-en-iaas-y-heroku-noejaco2017.git',puts);
      exec('git pull git@github.com:ULL-ESIT-SYTW-1617/practica-despliegues-en-iaas-y-heroku-noejaco2017 .',puts);
      //response.redirect('/');

      console.log("Después del pull de heroku");

});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

module.exports = app;
