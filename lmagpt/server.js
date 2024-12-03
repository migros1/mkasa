const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Test route to ensure server is working
app.get('/test', (req, res) => {
    res.send('Server is up and running!');
});

app.post('/gpt3', async (req, res) => {
    const userPrompt = req.body.prompt;

    try {
        const response = await axios.get('https://darkness.ashlynn.workers.dev/chat/', {
            params: {
                prompt: userPrompt,
                model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error communicating with the API');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
