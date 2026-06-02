const whitelist = ['https://www.google.com', 
                    'http://127.0.0.1:5500', 
                    'http://localhost:3500'];


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

module.exports = corsOptions;