function saveData() {
    const userInput = document.getElementById('userInput').value;
    
    fetch('/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: userInput
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('output').innerText = data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getData() {
    fetch('/get-data')
    .then(response => response.text())
    .then(data => {
        document.getElementById('output').innerText = `Saved Data: ${data}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
