    
const express = require('express');
// morgan
const morgan = require('morgan');
// mongoose
const mongoose = require('mongoose');

const Blog = require('./models/blog');
// express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://user1:XXXXXX@nodebl.07fm1.mongodb.net/blogpro?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3001))
    .catch((err) => console.log(err));

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
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes

// mongoose and mongodb sandbox routines

app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'blog1',
        snippet: 'snippet for blog',
        body: 'this is a blog'
    });

    blog.save()
    .then((result) => {
        res.send(result);
    })
    .catch((err) =>  {
        console.log(err);
    });
});

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1})
        .then((result) => {
            res.render('index', {title: 'All blogs', blogs: result});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});