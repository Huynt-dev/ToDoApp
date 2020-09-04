// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ listToDo: []})
  .write()

const app = express();
var listToDo = [
  {id:1,task:'Đi chợ'},
  {id:2,task:'Nấu cơm'},
  {id:3,task:'Rửa bát'},
  {id:4,task:'Học code tại CodersX'}
]

// https://expressjs.com/en/starter/basic-routing.html
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('view engine','pug');
app.set('views','./views');

app.get('/', function(req,res){
  res.render('index', {listToDo});
})

app.get('/search', function(req,res){
  var q = req.query.q;
  var filterTask = listToDo.filter(function(x){
    return x.task.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  res.render('index', {
    listToDo: filterTask,
    queryValue: q
  });
})

app.get('/create', function(req,res){
  res.render('create')
})

app.post('/create', function(req,res){
  listToDo.push(req.body)
  res.redirect('/')
})

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
