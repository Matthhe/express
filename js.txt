const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500;


app.use(express.urlencoded({extended:false}))



//* app.get('^/$|/index.html') => will gave us index.html file
//* app.get('^/$|/index(.html)?') => will gave us index.html file, BUT .html will be optionan 
app.get('/', (req, res) => { //! here '/' is like index page
    res.sendFile(path.join(__dirname, 'index.html')); //! BUT if file in folder =>
    //! path.join(__dirname, 'folder_name', 'file_name')
});

app.get(/\/new-page(\.html)?/, (req, res) => { 
    res.sendFile(path.join(__dirname, 'new-page.html')); //* the second route
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

app.get(/.*/, (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))