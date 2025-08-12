
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// Load config
dotenv.config();

// Passport config
require('./config/passport');

connectDB();

const app = express();

// CORS for frontend at localhost:3000 so cookies/sessions work
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/track-event', require('./routes/track'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
