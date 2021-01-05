const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('Uncaught exception Shutting down...');
    process.exit(1);
})

dotenv.config({ path: `./config.env` })
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log("DB connected..."));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection Shutting down...');
    server.close(() => {
        process.exit(1);
    })
})

