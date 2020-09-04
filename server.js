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

// https://expressjs.com/en/starter/basic-routing.html
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('view engine','pug');
app.set('views','./views');

app.get('/', function(req,res){
  res.render('index', {listToDo:db.get('listToDo').value()});
})

app.get('/search', function(req,res){
  var q = req.query.q;
  var filterTask = db.get('listToDo').value().filter(function(x){
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
  db.get('listToDo').push(req.body).write()
  res.redirect('/')
})

// listen for requests :)
app.listen(3000);
