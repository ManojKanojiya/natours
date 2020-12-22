const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Hello From Express App');
});

app.get('/jsonData', (req, res) => {
    res.status(200).json({ message: 'Hello', app: 'natours' });
});

app.post('/', (req, res) => {
    res.status(200).send('Post method');
});

const port = 5000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});