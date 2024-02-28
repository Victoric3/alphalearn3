const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const {callStartServerMultipleTimes} = require('./middlewares/executeGenerateData')


//body parser
app.use(express.json());
rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  keyGenerator: (req) => {
    // Use the user object to identify the user
    return req.user // Adjust this based on your user object structure
  },
});
app.get('/', (req, res) => {
  res.send('server successfully running');
});

callStartServerMultipleTimes(70, 1);

  

  

//allow requests from a diffrent port
// const allowedOrigins = ['https://kingsheart.com.ng'];
// const corsOptions = {
//   origin: function (origin, callback) {
//       if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
//   allowedHeaders: 'Content-Type,Authorization',
// };

app.use(cors())

// Connect to MongoDB
const heartDb = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.oimxptd.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(heartDb, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(console.log('heartDb server successfully running'))
    .catch(err => console.log(err))
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    
    //routes
    const questionRoute = require('./routes/questionRoutes')
    const userRoute = require('./routes/authRoute')
    app.use('/api/v1/questions', questionRoute)
    app.use('/api/v1/user', userRoute)
    

    app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
