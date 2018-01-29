const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
console.log(`port: ${port}`);
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


var maintenance = false;

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile('server.log', log + '\n', (error) => {
    if (error) {
      console.log('failed to log');
    }
  })

  next();
});

app.use((req, res, next) => {
  if (maintenance) {
    res.render('maintenance.hbs');
  } else {
    next();
  }
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  //res.send('<h1>Hello express!</h1>');
  // res.send({
  //   name: 'Andrew',
  //   likes: [
  //     'biking',
  //     'cycling'
  //   ]
  // })
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    message: 'Hello express!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: 'Failed to handle request'
  })
});

app.listen(port, () => {
  console.log(`server up on port ${port}`);
});
