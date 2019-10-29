const cors = require('cors');
const createError =  require('http-errors');

const allowedOrigins = [process.env.URL_APP, 'http://localhost:3000'];
module.exports = cors({
  origin: (origin, next) => {
    const isAllowed = !origin || allowedOrigins.some(o => o === origin);
    isAllowed ? next(null, isAllowed) : next(createError(401, 'Not allowed by CORS'))
  }, 
  credentials: true
})