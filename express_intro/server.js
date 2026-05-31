const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const { error } = require('console')
const PORT = process.env.PORT || 3500;


//! Logger need to be before everything 
//* custom middleware logger
app.use(logger)

//* whitelist is a list that shows, what websites can make request for our backend
const whitelist = ['https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500']
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true) //* enable CORS
        } else{
            callback(new Error("Not allowed by CORS")) //* Disable cors
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

//app.use(express.urlencoded({extended:false}))

//app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')))


//* app.get('^/$|/index.html') => will gave us index.html file
//* app.get('^/$|/index(.html)?') => will gave us index.html file, BUT .html will be optionan 
app.get('/', (req, res) => { //! here '/' is like index page
    res.sendFile(path.join(__dirname, 'views', 'index.html')); //! BUT if file in folder =>
    //! path.join(__dirname, 'folder_name', 'file_name')
});

app.get(/\/new-page(\.html)?/, (req, res) => { 
    res.sendFile(path.join(__dirname, 'views', 'new-page.html')); //* the second route
});

app.get(/\/old-page(\.html)?/, (req, res) => {
    res.redirect(302, '/new-page.html'); 
});

//* Route handlers
app.get(/\/hello(\.html)?/, (req, res, next) => {
    console.log('attemted to load hello.html')
    next() //* moves on next handler
}, (req, res) => {
    res.send('Hello World');
})

const one = (req, res, next) => {
    console.log('one')
    next()
}

const two = (req, res, next) => {
    console.log('two')
    next()
}

const three = (req, res) => {
    console.log('three')
    res.send('Finished!!!')
}

app.get(/\/chain(\.html)?/, [one, two, three])

app.all(/.*/, (req, res) => { //* 'all' for all requests
    res.status(404)
    if(req.accepts('html')){
       res.sendFile(path.join(__dirname, 'views', '404.html')); 
    }

    else if(req.accepts('json')){
       res.json({error: "404 Not Found"})
    }

    else{
        res.type('txt').send("404 Not Found")
    }
    
})

app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))