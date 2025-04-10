const chatBox = document.getElementById("chat-box");
const mainDiv = document.getElementsByTagName("main")[0];
const infoDiv = document.getElementsByClassName("info")[0];
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    askQuestion();
  }
});

sendButton.addEventListener("click", () => {
  askQuestion();
});

function askQuestion() {
  const userText = userInput.value;

  if (userText.trim() === "") {
    return; // Impede o envio de mensagens vazias
  }

  chatBox.classList.add("message");
  mainDiv.style.gridTemplateRows = "auto 1fr";
  infoDiv.innerHTML = "";

  addMessage(userText, "user");
  userInput.value = "";

  // Resposta da API
  getBotResponse(userText).then((response) => {
    addMessage(response, "bot");
  });
}

function addMessage(text, sender) {
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", sender);
  messageElement.innerHTML = marked.parse(text);
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Role para a parte inferior
}

const url = "https://askscience-776890342339.southamerica-east1.run.app/question?q=";

async function getBotResponse(userInput) {
  userInput = encodeURIComponent(userInput);
  const data = await fetch(url + userInput).then((res) => res.json());

  console.log(data);

  return data.content;
}
function reloadPage(){
  location.reload();
}