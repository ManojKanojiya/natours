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

sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        error: err,
        stack: err.stack,
        status: err.status,
        message: err.message
    })
}

sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error("Error ", err)
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (err.name === 'CastError') error = handleCasteErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldDB(err);
        if (err.name === 'ValidationError') error = handleValidationDB(err);
        sendErrorProd(error, res)
    }
}