var fs = require('fs');
var path = require('path');
var child = require("child_process");
var fs_extended = require('fs-extended');
var prompt = require("prompt");
var heroku = require('heroku-client');





function initialize(directorio) {


    console.log("\n============ Generando tarea gulp ============")
    console.log("\nEspere mientras el proceso termina ...")

    var contenido = `gulp.task("deploy-heroku-oauth" ,function(){
            var heroku = require("gitbook-start-heroku-token-oauth-alex-moi");
            var url = paquete.repository.url;
            heroku.deploy();
     });`;

    //Copia el server.js
    fs_extended.copyFile(path.join(process.cwd(),'node_modules','gitbook-start-heroku-token-oauth-noejaco17','server.js'),path.join(process.cwd(), 'server.js'),function(err){
        if(err)
        console.log(err);
     });

      fs.copyDir(path.join(process.cwd(),'node_modules','gitbook-start-heroku-token-oauth-noejaco17','views'),path.join(process.cwd(), 'views'),function(err){
        if(err)
        console.log(err);
     });

    //  fs.copyDir(path.join(process.cwd(),'node_modules','gitbook-start-heroku-token-oauth-noejaco17','public'),path.join(process.cwd(), 'public'),function(err){
    //     if(err)
    //     console.log(err);
    //  });

    //añadimos la tarea
    fs.writeFileSync(path.resolve(process.cwd(),'gulpfile.js'), contenido,  {'flag':'a'},  function(err) {
        if (err) {
            return console.error(err);
        }


    });

    //datos_usuario_token(directorio);

};


//

//
// function deploy() {
//
//
//
//     console.log("Comenzando el deploy en HEROKU");
//
//
//
//     child.exec('git add . ; git commit -m "subiendo a heroku"; git push heroku master;', function(error, stdout, stderr){
//         if(error)
//           console.log(error)
//
//         console.log(stderr);
//         console.log(stdout);
//       });
//
//
//
// };

module.exports = {
  initialize,
  //deploy
}
