const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const urlDatabase = require('./route/service/url-database');

require('dotenv').config({ path: 'variables.env' });

async function setupServer(){
    
    const appServer = express();
    appServer.use(bodyParser.urlencoded({extended: true}));
    appServer.use(bodyParser.json());
    appServer.use(cors());

    const home = require('./route/home');

    appServer.use('/', home);

    const serverPort = process.env.PORT || 8080;
    appServer.listen(serverPort, function () {
        console.log('Server Node Express server is up on ' + serverPort);
        urlDatabase.processURLDatasets();
    });
    
}

setupServer();

