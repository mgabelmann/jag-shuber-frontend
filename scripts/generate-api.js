var fs = require('fs');
var request = require('superagent');
var CodeGen = require('swagger-typescript-codegen').CodeGen;

var swaggerUrl = "http://postg-rest-postgrest.192.168.99.100.nip.io/";

console.log("Downloading SwaggerFile from " + swaggerUrl);
var res = request.get(swaggerUrl)
    .then(res => {
        var swagger = res.body;

        // Generate Source Code
        var tsSourceCode = CodeGen.getTypescriptCode({
            moduleName: 'shuber',
            className: 'Client',
            swagger: swagger
        }); 

        // Write source code to file
        fs.writeFile('src/app/api/generated-index.ts', tsSourceCode, null, (err) => {
            if (err) throw err;
            console.log('The generated api has been updated');
        });
    })
    .catch(err => {
        console.error("Error occured while processing swagger file.", err);
    })

