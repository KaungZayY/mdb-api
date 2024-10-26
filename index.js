import express from 'express'
import mongoose from 'mongoose';
import connectDB from './database.js';
import movieRouteV1 from './v1/routes/movieRoute.js'
import userRouteV1 from './v1/routes/userRoute.js'

connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api/v1/movies',movieRouteV1);
app.use('/api/v1/users',userRouteV1);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!')
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})