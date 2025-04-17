//сервер

// const express = require('express')
// const fs = require('fs')
import express from "express"
import fs from "fs"


const port = 4000;
const host = 'localhost';
const app = express();

app.use(express.static(process.cwd() + '/public'));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/public/main.html')
});

app.listen(port, host, () =>{
    console.log(`Listening on ${host}:${port}`)
});