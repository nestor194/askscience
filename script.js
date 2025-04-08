const infoDiv = document.getElementsByClassName("info")[0];

document.getElementById('send-button').addEventListener('click',  function() {
    infoDiv.innerHTML = "";

const userInput = document.getElementById('user-input');
const userText = userInput.value;

if (userText.trim() === "") {
return; // Impede o envio de mensagens vazias 
}

addMessage(userText, 'user');
userInput.value = '';

// Resposta da API
const botResponse = getBotResponse(userText).then(() => {
addMessage(botResponse, 'bot');
});
});

function addMessage(text, sender) {
const chatBox = document.getElementById('chat-box');
const messageElement = document.createElement('div');
messageElement.classList.add('message', sender);
messageElement.textContent = text;
chatBox.appendChild(messageElement);
chatBox.scrollTop = chatBox.scrollHeight; // Role para a parte inferior
}

const url = "https://askscience-776890342339.southamerica-east1.run.app/question?q="

async function getBotResponse(userInput) {
   const data = await fetch(url + userInput).then(res => res.json());

   console.log(data)

   return data.summary;
}