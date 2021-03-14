'use strict';

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;

const app = express();

const public_path = '/build';

// the __dirname is the current directory from where the script is running
app.use( express.static(__dirname + public_path) );

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
    res.sendFile( path.resolve(__dirname + public_path, 'index.html') );
});

app.listen(port, () => console.log(`listening on port ${port}`));