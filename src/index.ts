// Импорт стилей
import "./style.css";

import store from "./redux/store";
import {
  sendMessage,
  clearChat,
  setCurrentSender,
  incrementUnreadCount,
} from "./redux/actions";

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

// Обработчики событий
ivanSelectorButton.addEventListener("click", () => {
  store.dispatch(setCurrentSender("Иван"));
  ivanUnreadCount.style.display = "none";
});

maryaSelectorButton.addEventListener("click", () => {
  store.dispatch(setCurrentSender("Мария"));
  maryaUnreadCount.style.display = "none";
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
  const state = store.getState();
  chatMessages.innerHTML = "";

  state.messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${message.sender}: ${message.text} - ${message.timestamp}`;
    chatMessages.appendChild(messageElement);
  });

  // Обновление счётчиков непрочитанных сообщений
  ivanUnreadCount.textContent = state.ivanUnread.toString();
  maryaUnreadCount.textContent = state.maryaUnread.toString();
};

// Подписка на обновления хранилища
store.subscribe(updateUI);

// Инициализация интерфейса
updateUI();
