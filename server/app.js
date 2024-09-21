const express = require('express');
const app = express();
const authRoute = require('./routes/auth.route');
const postRoute = require('./routes/post.route');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwtUtils = require('./utils/jwt.utils');

// Apply CORS middleware before defining any routes
app.use(cors({
    origin: '*', // Allow requests from all origins
    credentials: true, // Allow credentials (e.g., cookies) to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    headers: ['Content-Type', 'Authorization'] // Allow these headers
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// Define routes after applying CORS
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.use(jwtUtils.authenticate);

try {
    app.listen(5000, () => {
        console.log('Server started on port 5000');
    });
} catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
}