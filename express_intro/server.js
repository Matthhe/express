const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOption')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const { error } = require('console')
const PORT = process.env.PORT || 3500;


//! Logger need to be before everything 
//* custom middleware logger
app.use(logger)

app.use(cors(corsOptions))
app.use(express.urlencoded({extended:false}))

app.use(express.json()); //! need to read req.body

//* middleware for cookies
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '/public')))

//* routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh'))

app.use(verifyJWT) //* will work for /employees only
app.use('/employees', require('./routes/api/employees'))



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