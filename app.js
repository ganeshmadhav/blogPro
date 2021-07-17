    
const express = require('express');

// express app
const app = express();

// morgan
const mongan = require('morgan');

// listen for requests
app.listen(3001);

// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');

// middleware & static files
app.use(express.static('public'));


app.use((req, res, next) => {
    console.log('new request made:');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next();
  });
  
  app.use((req, res, next) => {
    console.log('in the next middleware');
    next();
  });
  
  app.use(morgan('dev'));
  
  app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });

  
app.get('/', (req, res) => {
  const blogs = [
    {title: 'Title 1', snippet: 'SNIP1'},
    {title: 'Title 2', snippet: 'SNIP2'},
    {title: 'Title 3', snippet: 'SNIP3'},
  ];
  res.render('index', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});