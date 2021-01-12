const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP. Please try again in an hour!'
})
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist: [
        'ratingsAverage',
        'ratingsQuantity',
        'duration',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}))

app.use((req, res, next) => {
    console.log('Hello From Middleware...');
    next();
})

app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        name: 'Manoj'
    });
})


app.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours',
    });
})

app.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour',
    });
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler);

module.exports = app;