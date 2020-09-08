const cors = require('cors');
const createError =  require('http-errors');

const allowedOrigins = [process.env.URL_APP, process.env.URL_APP_DEV];

module.exports = cors({
  origin: (origin, next) => {
    const isAllowed = !origin || allowedOrigins.some(o => o === origin);
    isAllowed ? next(null, isAllowed) : next(createError(401, 'Not allowed by CORS'))
  }, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
  credentials: true
})