async function sendPrompt() {
    const prompt = document.getElementById('prompt').value;

    const response = await fetch('/gpt3', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById('response').innerText = JSON.stringify(data, null, 2);
    } else {
        document.getElementById('response').innerText = 'Error: Unable to get response';
    }
}
