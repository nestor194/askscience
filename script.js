const chatBox = document.getElementById("chat-box");
const mainDiv = document.getElementsByTagName("main")[0];
const infoDiv = document.getElementsByClassName("info")[0];
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

marked.use({
  renderer: {
    link({ href }) {
      return href;
    },
  },
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendButton.disabled == false && askQuestion();
  }
});

sendButton.addEventListener("click", () => {
  askQuestion();
});

function askQuestion() {
  sendButton.disabled = true;

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

    lucide.createIcons(); // Criar os novos ícones adicionados na mensagem

    sendButton.disabled = false;
  });
}

function addMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  if (sender == "bot") {
    const referencesElement = document.createElement("ul");
    referencesElement.className = "references-list";

    const markdownTextParsedToHTML = marked.parse(message.content);

    const parsedText = parseTextReferences(
      {
        ...message,
        content: markdownTextParsedToHTML,
      },
      referencesElement
    );

    messageElement.innerHTML = parsedText;
    messageElement.appendChild(referencesElement);
  } else {
    messageElement.innerHTML = message;
  }
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Role para a parte inferior
}

function parseTextReferences({ content, references }, referencesElement) {
  const urlRegex = /{{\s*(https?:\/\/[^}]+)\s*}}/g;

  const allReferencesUrls = Array.from(content.matchAll(urlRegex));

  const prevUrls = [];

  allReferencesUrls.forEach(([_, url], index) => {
    const thisUrlAlreadyWasProceed = prevUrls.includes(url); // Evitar duplicar urls

    const reference = references.find((re) => re.article.url === url);

    if (!reference) return;

    if (thisUrlAlreadyWasProceed == false) prevUrls.push(url);

    const referenceElement = createReferenceLinkElement({
      ...reference,
      index: prevUrls.indexOf(url) + 1,
    });

    content = content.replace(`{{${url}}}`, referenceElement);

    if (thisUrlAlreadyWasProceed == false)
      referencesElement.append(createReferenceInfoElement(reference));
  });

  return content;
}

function createReferenceLinkElement(reference) {
  const linkElement = document.createElement("a");
  linkElement.href = `#r-${reference.article.url}`; // Quando clicar no <a>, vai para a referência do artigo embaixo da resposta
  linkElement.className = "reference-link";
  linkElement.textContent = reference.index;

  return linkElement.outerHTML;
}

function createReferenceInfoElement(reference) {
  const referenceElement = document.createElement("li");
  const titleElement = document.createElement("h3");
  const excerptElement = document.createElement("p");

  const headerElement = document.createElement("div");
  const urlElement = document.createElement("a");

  headerElement.append(titleElement, urlElement);

  referenceElement.id = "r-" + reference.article.url;

  titleElement.innerText = reference.article.title;
  excerptElement.innerText = reference.excerpt;

  urlElement.href = reference.article.url;
  urlElement.target = "_blank";
  urlElement.innerHTML = `<i data-lucide="external-link"></i>`;

  referenceElement.append(headerElement, excerptElement);

  return referenceElement;
}

const url = "https://askscience-776890342339.southamerica-east1.run.app/question?q=";

async function getBotResponse(userInput) {
  userInput = encodeURIComponent(userInput);
  const data = await fetch(url + userInput).then((res) => res.json());

  console.log(data);

  return data;
}

function reloadPage() {
  location.reload();
}
