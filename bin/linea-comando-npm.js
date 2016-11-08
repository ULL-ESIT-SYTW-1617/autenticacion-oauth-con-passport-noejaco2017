#!/usr/bin/env node
var express = require('express');
var app = express()
var path = require('path');
var fs= require('fs-extra');
var ejs=require('ejs');
var child = require("child_process");


//MINIMIST
var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);


function estructura(directorio){
      //CREACION DE LOS DIRECTORIOS TXT, SCRIPTS, Y LA CARPETA A GENERAR
      //creamos el directorio raiz

      var direct = process.cwd() + directorio;
      console.log("VARIABLE DIRECTORIO "+direct);

             //Creamos el directorio
             fs.mkdirsSync(directorio);


      //Creamos una copia de los scripts
      console.log("LLEGOOOOOOOOOOO SCRIPTS");
      fs.copy(path.join(__dirname,'..','scripts'), path.join(process.cwd(), directorio , 'scripts'),function(err){
        if(err)
          console.log(err);
      });
             console.log("LLEGOOOOOOOOOOO TXT");
             //Creamos una copia de los txt
             fs.copy(path.join(__dirname,'..','txt'), path.join(process.cwd(), directorio , 'txt'),function(err){
               if(err)
                 console.log(err);
             });

      console.log("LLEGOOOOOOOOOOO BOOK");
      fs.copy(path.join(__dirname,'..','book.json'),path.join(process.cwd(), directorio , 'book.json'),function(err){
        if(err)
        console.log(err);
      });
console.log("LLEGOOOOOOOOOOO APP");
      //copiamos server.js
      fs.copy(path.join(__dirname,'..','app.js'),path.join(process.cwd(), directorio , 'app.js'),function(err){
        if(err)
        console.log(err);
      });
      console.log("LLEGOOOOOOOOOOO Procfile");
            //copiamos server.js
            fs.copy(path.join(__dirname,'..','Procfile'),path.join(process.cwd(), directorio , 'Procfile'),function(err){
              if(err)
              console.log(err);
            });
console.log("SALGO");

}




if(argv.h || argv.help){

    //MENU
    console.log("gitbook-start [OPTIONS]\n"+
    "--autor: autor del libro a crear node gitbook-star -a AutorDelLibro\n"+
    "--email: email de contacto del usuario\n"+
    "--version: version repositorio github contra el que se va a trabajar -r github.com/repo.git\n"+
    "--url: repositorio github contra el que se va a trabajar -r github.com/repo.git\n"+
    "--wiki: direccion web de la wiki en github -w github.com/repo.wiki.git\n"+
    "--directorio: nombre del directorio a crear\n"+
    "--help: muestra ayuda sobre las opciones disponibles\n"+
    "--deploy: Deploy en IaaS(iaas.ull.es)"+
    "--iaasIP: Direccion de la maquina virtual\n"+
    "--iaaspath: Repositorio que va a contener el libro en iaas\n"+
    "--heroku: Nombre de su api en heroku\n");


}else{

    if(argv.deploy && argv.directorio ){
                         if( argv.iaasIP && argv.iaaspath){//Cuando pasamos el directorio

                             estructura(argv.directorio);
                                  console.log("Despues de crear estructura");
                                     child.exec('npm install --save-dev gitbook-start-plugin-iaas-ull-es-noejaco2017', function(error, stdout, stderr){
                                       if(error)
                                         console.log(error)

                                       console.log(stderr);
                                       console.log(stdout);
                                     })

                                     console.log("TAREA GULP");
                                     //añadir las tareas al gulp
                                     var iaas = require(path.join(__dirname,'../node_modules','gitbook-start-plugin-iaas-ull-es-noejaco2017','linea-comando-iaas'));
                                     iaas.initialize(argv.directorio);

                                     console.log("LLEGOOOOOOOOOOO PACKAGE");

                                     var heroku        = argv.herokupath || '';

                                       ejs.renderFile(path.join(__dirname, '../template_npm', 'package.ejs'),{nombre:argv.name, direcciongit:argv.url, direccionwiki:argv.wiki, autor:argv.autor, email:argv.email,direccionip:argv.iaasIP,direccionpath:argv.iaaspath,nombreheroku:heroku},function(err, result) {
                                          // render on success

                                                  if (!err) {
                                                      // result.nombre=argv.name;
                                                      // result.direcciongit=argv.url;
                                                      // result.direccionwiki='argv.wiki';
                                                       console.log(result);
                                                           //CREAMOS EL PACKAGE.JSON del template

                                                               fs.writeFile(path.join(process.cwd(), `${argv.directorio}`, 'package.json'), result);
                                                                      if (err) throw err;
                                                                      console.log('CREADO PACKAGE.JSON');

                                                  }
                                                  // render or error
                                                  else {
                                                           console.log('Error renderFile(package.ejs)');
                                                           console.log(err);
                                                  }
                                           });

                          }else{
                                    if(argv.heroku ){

                                     estructura(argv.directorio);
                                          console.log("Despues de crear estructura");
                                             child.exec('npm install --save-dev gitbook-start-plugin-heroku-noejaco2017', function(error, stdout, stderr){
                                               if(error)
                                                 console.log(error)

                                               console.log(stderr);
                                               console.log(stdout);
                                             })

                                             console.log("TAREA GULP");
                                             //añadir las tareas al gulp
                                             var heroku = require(path.join(__dirname,'./node_modules','gitbook-start-plugin-heroku-noejaco2017','linea-comando-heroku'));
                                             heroku.initialize(argv.directorio);

                                             console.log("LLEGOOOOOOOOOOO PACKAGE");


                                             var iaasip     = argv.iaasIP || '';
                                            var iaaspath        = argv.iaaspath || '';


                                             ejs.renderFile(path.join(__dirname, '../template_npm', 'package.ejs'),{nombre:argv.name, direcciongit:argv.url, direccionwiki:argv.wiki, autor:argv.autor, email:argv.email,nombreheroku:argv.heroku,direccionip:iaasip,direccionpath:iaaspath},function(err, result) {
                                                // render on success

                                                        if (!err) {
                                                            // result.nombre=argv.name;
                                                            // result.direcciongit=argv.url;
                                                            // result.direccionwiki='argv.wiki';
                                                             console.log(result);
                                                                 //CREAMOS EL PACKAGE.JSON del template

                                                                     fs.writeFile(path.join(process.cwd(), `${argv.directorio}`, 'package.json'), result);
                                                                            if (err) throw err;
                                                                            console.log('CREADO PACKAGE.JSON');

                                                        }
                                                        // render or error
                                                        else {
                                                                 console.log('Error renderFile(package.ejs)');
                                                                 console.log(err);
                                                        }
                                                 });


                                      }else{
                                            if(!argv.iaasIP || !argv.iaaspath || !argv.deploy ){
                                                         console.log("Falta el argumento IP, path o directorio, consulte el help");
                                            }else if(!argv.heroku){
                                              console.log("Falta el argumento de heroku, consulte el help");
                                            }
                                      }
                          }
      }else{
                  console.log("Consulte el help FINAL");
      }
}
