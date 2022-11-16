const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const http = require('http')
const userRoutes = require('./routes/userRoutes')
const config = require('config')
const port = 5002;

app.use(express.static(process.cwd()+'/images'))
app.use('/images', express.static(process.cwd()+'/images'))

//mongodb on server
const mongoUrl = 'mongodb+srv://super4:Super42423@cluster0.xpj6y.mongodb.net/Super4?retryWrites=true&w=majority'

mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(mongoUrl, mongoOptions).then(()=>{
    console.log('mongoDb connected!')
    app.emit('mongoConnected')
})
.catch(err=>{
    console.log(err)
})

app.use(bodyParser.json());
app.use('/api/auth', userRoutes);
app.use('/uploads', express.static('uploads'))


const Port = 5000;
app.listen(Port, console.log (`server is running in development mode on port ${Port}`))
