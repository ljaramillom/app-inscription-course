require('./config/config');
// session
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
// express
const express = require('express');
const app = express();
// path
const path = require('path');
// bodyParser
const bodyParser = require('body-parser');
// mongoose
const mongoose = require('mongoose');
// paths
const dirPublic = path.join(__dirname, "../public");
const dirNode_modules = path.join(__dirname, '../node_modules');
// server socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// static
app.use(express.static(dirPublic));

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }));
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// routes
app.use(require('./routes/index'));

// connection
mongoose.connect(process.env.URLDB, {
    useCreateIndex: true,
    useNewUrlParser: true
}, (err, resp) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connection successful")
    }
});

// captura de inicio de sesión
app.use((req, res, next) => {
    if (req.session.usuario) {
        res.locals.session = true
        res.locals.role = req.session.role
    }
    next();
})

console.log(__dirname);

// sockets
io.on('connection', client => {
    console.log('User connected with Sockets');
    client.on("texto", (texto, callback) => {
        io.emit("texto", (texto))
        callback()
    });
});

// port
server.listen(process.env.PORT, () => {
    console.log('Server on port ' + process.env.PORT)
});