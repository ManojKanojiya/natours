const AppError = require('../utils/appError')

const handleCasteErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
}

const handleDuplicateFieldDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate field value ${value}. Please use another one!`;
    return new AppError(message, 400);
}

const handleValidationDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid data sent. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = err => new AppError('Invalid token. Please login again!', 401)

const handleJWTExpiredError = err => new AppError('Your token has expired ! Please login again!', 401)

sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            error: err,
            stack: err.stack,
            status: err.status,
            message: err.message
        })
    }
    console.error("Error ", err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    })
}

sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }
        console.error("Error ", err)
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })

    }
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    }
    console.error("Error ", err)
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later!'
    })
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (err.name === 'CastError') error = handleCasteErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldDB(err);
        if (err.name === 'ValidationError') error = handleValidationDB(err);
        if (err.name === 'JsonWebTokenError') error = handleJWTError(err);
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(err);
        sendErrorProd(error, req, res)
    }
}