const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const TEST_SERVER_URL = 'http://20.244.56.144/test';
let numbersWindow = [];
let total = 0;

const fetchNumbers = async (qualifier) => {
    try {
        const response = await fetch(`${TEST_SERVER_URL}/${qualifier}`);
        const numbers = await response.json();
        return numbers.filter((num, index) => numbers.indexOf(num) === index); // Remove duplicates
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        return [];
    }
};

const handleNumbersRequest = async (req, res) => {
    const qualifier = req.params.numberid;

    const fetchedNumbers = await fetchNumbers(qualifier);

    numbersWindow = [...numbersWindow.slice(-WINDOW_SIZE + 1), ...fetchedNumbers];
    total = numbersWindow.reduce((acc, num) => acc + num, 0);
    const average = total / numbersWindow.length;

    const response = {
        numbers: numbersWindow,
        windowPrevState: numbersWindow.slice(0, -fetchedNumbers.length),
        windowCurrState: numbersWindow,
        avg: average.toFixed(2)
    };

    res.json(response);
};

app.get('/numbers/:numberid', handleNumbersRequest);

app.listen(PORT, () => {
    console.log(`Average Calculator microservice running on port ${PORT}`);
});