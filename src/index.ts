// Импорт стилей
import "./style.css";

// Определение типов и интерфейсов
type Message = {
  sender: string;
  text: string;
  timestamp: string;
};

interface UnreadMessagesCount {
  Иван: number;
  Мария: number;
}

// Получение элементов DOM
const johnSelectorBtn = document.querySelector(
  "#john-selector",
) as HTMLButtonElement;
const janeSelectorBtn = document.querySelector(
  "#jane-selector",
) as HTMLButtonElement;
const chatHeader = document.querySelector(".chat-header") as HTMLElement;
const chatMessages = document.querySelector(".chat-messages") as HTMLElement;
const chatInputForm = document.querySelector(
  ".chat-input-form",
) as HTMLFormElement;
const chatInput = document.querySelector(".chat-input") as HTMLInputElement;
const clearChatBtn = document.querySelector(
  ".clear-chat-button",
) as HTMLButtonElement;
const johnUnreadCount = document.querySelector("#john-unread") as HTMLElement;
const janeUnreadCount = document.querySelector("#jane-unread") as HTMLElement;

// Начальные данные
let messages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");
let unreadMessagesCount: UnreadMessagesCount = JSON.parse(
  localStorage.getItem("unreadMessagesCount") || '{"Иван": 0, "Мария": 0}',
);
let messageSender: string = localStorage.getItem("currentSender") || "Иван";

// Функции
const createChatMessageElement = (message: Message): string => {
  const bgColorClass = message.sender === messageSender ? "blue-bg" : "gray-bg";
  return `
    <div class="message ${bgColorClass}">
      <div class="message-sender">${message.sender}</div>
      <div class="message-text">${message.text}</div>
      <div class="message-timestamp">${message.timestamp}</div>
    </div>
  `;
};

const updateUnreadMessagesDisplay = (): void => {
  johnUnreadCount.style.display =
    unreadMessagesCount["Иван"] > 0 ? "inline" : "none";
  janeUnreadCount.style.display =
    unreadMessagesCount["Мария"] > 0 ? "inline" : "none";

  johnUnreadCount.innerText = unreadMessagesCount["Иван"].toString();
  janeUnreadCount.innerText = unreadMessagesCount["Мария"].toString();
};

const saveUnreadMessagesCount = (): void => {
  localStorage.setItem(
    "unreadMessagesCount",
    JSON.stringify(unreadMessagesCount),
  );
};

const saveCurrentSender = (): void => {
  localStorage.setItem("currentSender", messageSender);
};

const redrawMessages = (): void => {
  chatMessages.innerHTML = "";
  messages.forEach((message) => {
    chatMessages.innerHTML += createChatMessageElement(message);
  });
};

const updateMessageSender = (name: string): void => {
  messageSender = name;
  const receivingPerson = name === "Иван" ? "Мария" : "Иван";
  chatHeader.innerText = `${receivingPerson} пишет...`;
  chatInput.placeholder = `Здесь пишет ${messageSender}...`;

  if (name === "Иван") {
    johnSelectorBtn.classList.add("active-person");
    janeSelectorBtn.classList.remove("active-person");
  } else if (name === "Мария") {
    janeSelectorBtn.classList.add("active-person");
    johnSelectorBtn.classList.remove("active-person");
  }

  redrawMessages();
  chatInput.focus();
  saveCurrentSender();
};

johnSelectorBtn.addEventListener("click", (): void => {
  updateMessageSender("Иван");
  unreadMessagesCount["Иван"] = 0;
  saveUnreadMessagesCount();
  updateUnreadMessagesDisplay();
});

janeSelectorBtn.addEventListener("click", (): void => {
  updateMessageSender("Мария");
  unreadMessagesCount["Мария"] = 0;
  saveUnreadMessagesCount();
  updateUnreadMessagesDisplay();
});

const sendMessage = (event: Event): void => {
  event.preventDefault();

  const timestamp = new Date().toLocaleString("ru-RU");
  const message: Message = {
    sender: messageSender,
    text: chatInput.value,
    timestamp,
  };

  messages.push(message);
  localStorage.setItem("messages", JSON.stringify(messages));

  chatMessages.innerHTML += createChatMessageElement(message);
  chatInputForm.reset();
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (messageSender === "Иван") {
    unreadMessagesCount["Мария"]++;
  } else {
    unreadMessagesCount["Иван"]++;
  }

  saveUnreadMessagesCount();
  updateUnreadMessagesDisplay();
};

chatInputForm.addEventListener("submit", sendMessage);

clearChatBtn.addEventListener("click", (): void => {
  messages = [];
  localStorage.setItem("messages", JSON.stringify(messages));

  unreadMessagesCount = { Иван: 0, Мария: 0 };
  localStorage.setItem(
    "unreadMessagesCount",
    JSON.stringify(unreadMessagesCount),
  );

  chatMessages.innerHTML = "";
  updateUnreadMessagesDisplay();
});

window.onload = (): void => {
  updateMessageSender(messageSender);

  // Отрисовка сообщений только если они еще не отображены
  if (chatMessages.innerHTML.trim() === "") {
    messages.forEach((message) => {
      chatMessages.innerHTML += createChatMessageElement(message);
    });
  }

  updateUnreadMessagesDisplay();
};

chatInputForm.addEventListener("submit", sendMessage);

clearChatBtn.addEventListener("click", (): void => {
  messages = [];
  localStorage.setItem("messages", JSON.stringify(messages));

  unreadMessagesCount = { Иван: 0, Мария: 0 };
  localStorage.setItem(
    "unreadMessagesCount",
    JSON.stringify(unreadMessagesCount),
  );

  chatMessages.innerHTML = "";
  updateUnreadMessagesDisplay();
});

// Добавление смайликов
const emojiContainer = document.querySelector(
  ".emoji-container",
) as HTMLElement;
const emojis = [
  "😀",
  "😂",
  "👍",
  "😍",
  "😎",
  "🤔",
  "😁",
  "😃",
  "😄",
  "😅",
  "😆",
  "😇",
  "😉",
  "😊",
  "😋",
  "😌",
  "😏",
  "😒",
  "😓",
  "😔",
  "😕",
  "😖",
  "😗",
  "😘",
  "😙",
  "😚",
  "😛",
  "😜",
  "😝",
  "😞",
  "😟",
  "😠",
  "😡",
  "😢",
  "😣",
  "😤",
  "😥",
  "😦",
  "😧",
  "😨",
  "😩",
  "😪",
  "😫",
  "😬",
  "😭",
  "😮",
  "😯",
  "😰",
  "😱",
  "😲",
  "😳",
  "😴",
  "😵",
  "😶",
  "😷",
  "🤐",
  "🤑",
  "🤒",
  "🤓",
  "🤔",
  "🤕",
  "🤗",
  "🤠",
  "🤡",
  "🤢",
  "🤣",
  "🤤",
  "🤥",
  "🤧",
  "🤨",
  "🤩",
  "🤪",
  "🤫",
  "🤬",
  "🤭",
  "🤮",
  "🤯",
  "🥳",
  "🤩",
  "🤪",
];

const addEmojiToInput = (emoji: string): void => {
  chatInput.value += emoji;
};

emojis.forEach((emoji) => {
  const button = document.createElement("button");
  button.textContent = emoji;
  button.addEventListener("click", () => addEmojiToInput(emoji));
  emojiContainer.appendChild(button);
});
