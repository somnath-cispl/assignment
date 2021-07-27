const express = require("express");
const bodyParser = require('body-parser')
const router = require('./routes/routes');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
const DB = process.env.DB;

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}).then(() => console.log('DB Connected!'));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(3000, () => {
  console.log("NodeJS Server is running!");
});

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

app.get('/', function(req, res) {
	res.render('index.html');
});

app.use('/api', router);