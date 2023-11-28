// Импорт стилей
import "./style.css";

import store from "./redux/store";
import {
  sendMessage,
  clearChat,
  setCurrentSender,
  incrementUnreadCount,
  resetUnreadCount,
  Message,
} from "./redux/actions";

// Функция для создания элемента сообщения
const createChatMessageElement = (message: Message, messageSender: string) => {
  const isCurrentUserMessage = message.sender === messageSender;
  const bgColorClass = isCurrentUserMessage ? "blue-bg" : "gray-bg";
  const formattedTimestamp = new Date(message.timestamp).toLocaleString(
    "ru-RU",
  );

  return `
    <div class="message ${bgColorClass}">
      <div class="message-sender">${message.sender}</div>
      <div class="message-text">${message.text}</div>
      <div class="message-timestamp">${formattedTimestamp}</div>
    </div>
  `;
};

// Получение элементов DOM
const ivanSelectorButton = document.getElementById(
  "ivan-selector",
) as HTMLButtonElement;
const maryaSelectorButton = document.getElementById(
  "marya-selector",
) as HTMLButtonElement;
const chatInputForm = document.querySelector(
  ".chat-input-form",
) as HTMLFormElement;
const chatInput = document.querySelector(".chat-input") as HTMLInputElement;
const chatMessages = document.querySelector(".chat-messages") as HTMLDivElement;
const clearChatButton = document.querySelector(
  ".clear-chat-button",
) as HTMLButtonElement;
const ivanUnreadCount = document.getElementById(
  "ivan-unread",
) as HTMLSpanElement;
const maryaUnreadCount = document.getElementById(
  "marya-unread",
) as HTMLSpanElement;
const emojiButton = document.querySelector(
  ".emoji-button",
) as HTMLButtonElement;
const emojiPanel = document.querySelector(".emoji-panel") as HTMLDivElement;

// Проверка существования элементов DOM
if (
  !ivanSelectorButton ||
  !maryaSelectorButton ||
  !chatInputForm ||
  !chatInput ||
  !chatMessages ||
  !clearChatButton ||
  !emojiButton ||
  !emojiPanel
) {
  throw new Error("Some HTML elements are missing.");
}

emojiButton.addEventListener("click", () => {
  emojiPanel.style.display =
    emojiPanel.style.display === "none" ? "block" : "none";
});

// Обработчики событий для выбора пользователя
ivanSelectorButton.addEventListener("click", () => {
  store.dispatch(setCurrentSender("Иван"));
  ivanSelectorButton.classList.add("active-person");
  maryaSelectorButton.classList.remove("active-person");
  store.dispatch(resetUnreadCount("Иван")); // Сброс счетчика для Ивана
});

maryaSelectorButton.addEventListener("click", () => {
  store.dispatch(setCurrentSender("Мария"));
  maryaSelectorButton.classList.add("active-person");
  ivanSelectorButton.classList.remove("active-person");
  store.dispatch(resetUnreadCount("Мария")); // Сброс счетчика для Марии
});

chatInputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value;
  const timestamp = new Date().toISOString();
  const { currentSender } = store.getState();
  store.dispatch(
    sendMessage({ sender: currentSender, text: message, timestamp }),
  );
  chatInput.value = "";

  if (currentSender === "Иван") {
    store.dispatch(incrementUnreadCount("Мария"));
    maryaUnreadCount.style.display = "inline";
  } else {
    store.dispatch(incrementUnreadCount("Иван"));
    ivanUnreadCount.style.display = "inline";
  }
});

clearChatButton.addEventListener("click", () => {
  store.dispatch(clearChat());
});

// Функция для обновления интерфейса
const updateUI = () => {
  emojiPanel.style.display = "none";
  const state = store.getState();
  chatMessages.innerHTML = "";

  state.messages.forEach((message) => {
    const messageHTML = createChatMessageElement(message, state.currentSender);
    chatMessages.innerHTML += messageHTML;
  });

  ivanUnreadCount.style.display = state.ivanUnread > 0 ? "inline" : "none";
  maryaUnreadCount.style.display = state.maryaUnread > 0 ? "inline" : "none";

  if (state.ivanUnread > 0) {
    ivanUnreadCount.textContent = state.ivanUnread.toString();
    ivanUnreadCount.style.display = "inline";
  } else {
    ivanUnreadCount.style.display = "none";
  }

  // Обновление счетчика непрочитанных сообщений Марии
  if (state.maryaUnread > 0) {
    maryaUnreadCount.textContent = state.maryaUnread.toString();
    maryaUnreadCount.style.display = "inline";
  } else {
    maryaUnreadCount.style.display = "none";
  }
};

// Функция для вставки смайлика в поле ввода
const insertEmoji = (emoji: string) => {
  const start = chatInput.selectionStart;
  const end = chatInput.selectionEnd;
  const text = chatInput.value;
  const before = text.substring(0, start);
  const after = text.substring(end, text.length);
  chatInput.value = before + emoji + after;
  chatInput.selectionStart = start + emoji.length; // Разделяем присваивания
  chatInput.selectionEnd = start + emoji.length;
  chatInput.focus();
};

// Добавление обработчиков событий для каждого смайлика
document.querySelectorAll(".emoji").forEach((emojiElement) => {
  emojiElement.addEventListener("click", (e) => {
    const emoji = (e.target as HTMLElement).textContent; // Утверждение типа для EventTarget
    if (emoji) {
      insertEmoji(emoji);
      emojiPanel.style.display = "none"; // Скрыть панель смайликов после выбора
    }
  });
});

// Подписка на обновления хранилища
store.subscribe(updateUI);

// Инициализация интерфейса
updateUI();
