const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');

const port = process.env.PORT || 8080;
const app = express();
const cors = require('cors');
app.use(cors());

const db = require('./db/db')
const database = db()

const imitVideoRoutes = require('./api/routes/imitationVideo');
const userRoutes = require('./api/routes/user');
const origVideoRoutes = require('./api/routes/originalVideo');

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/imitationVideo', imitVideoRoutes);
app.use('/user', userRoutes);
app.use('/originalVideo', origVideoRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});