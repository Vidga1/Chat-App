// Импорт стилей и необходимых библиотек
import "./style.css";
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { firestore } from "./firebaseConfig";
import store from "./redux/store";
import {
  sendMessage,
  clearChat,
  setCurrentSender,
  incrementUnreadCount,
  resetUnreadCount,
  fetchMessages,
  Message,
} from "./redux/actions";

import { ChatState } from "./redux/reducer";

// Типизация для thunk-действий
type AppDispatch = ThunkDispatch<ChatState, unknown, AnyAction>;
const { dispatch } = store as { dispatch: AppDispatch };

/* ------------------------------------------DOM---------------------------------------- */
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

const scrollToBottom = () => {
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

/* -------------------------------------ВЫБОР ПОЛЬЗОВАТЕЛЯ И СЧЁТЧИКИ------------------------------- */

function handleUserSelection(
  user: string,
  userButton: HTMLButtonElement,
  otherButton: HTMLButtonElement,
) {
  store.dispatch(setCurrentSender(user));
  userButton.classList.add("active-person");
  otherButton.classList.remove("active-person");
  store.dispatch(resetUnreadCount(user));

  // Сохранение сброшенного счётчика в localStorage
  localStorage.setItem(user === "Иван" ? "ivanUnread" : "maryaUnread", "0");
}

ivanSelectorButton.addEventListener("click", () =>
  handleUserSelection("Иван", ivanSelectorButton, maryaSelectorButton),
);
maryaSelectorButton.addEventListener("click", () =>
  handleUserSelection("Мария", maryaSelectorButton, ivanSelectorButton),
);

/* ------------------------------------------ФОРМА------------------------------------------ */
chatInputForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = chatInput.value;
  const timestamp = new Date().toISOString();
  const { currentSender } = store.getState();

  const messageData = { sender: currentSender, text: message, timestamp };

  // Отправка сообщения в Redux
  store.dispatch(sendMessage(messageData));

  // Сохранение сообщения в Firebase
  try {
    await addDoc(collection(firestore, "messages"), messageData);
  } catch (error) {
    console.error("Ошибка при добавлении сообщения: ", error);
  }

  chatInput.value = "";

  // Логика для обновления счетчиков непрочитанных сообщений
  const recipient = currentSender === "Иван" ? "Мария" : "Иван";
  store.dispatch(incrementUnreadCount(recipient));

  // Сохранение обновлённого счётчика в localStorage
  const updatedCount =
    store.getState()[recipient === "Иван" ? "ivanUnread" : "maryaUnread"];
  localStorage.setItem(
    recipient === "Иван" ? "ivanUnread" : "maryaUnread",
    updatedCount.toString(),
  );

  scrollToBottom();
});

/* --------------------------------------------ОБНОВЛЕНИЕ ИНТЕРФЕЙСА----------------------------------- */

const updateUI = () => {
  // Скрывает панель эмодзи
  emojiPanel.style.display = "none";

  const state = store.getState();
  chatMessages.innerHTML = "";

  // Отображение сообщений из состояния Redux
  state.messages.forEach((messageData) => {
    const messageHTML = createChatMessageElement(
      messageData,
      state.currentSender,
    );
    chatMessages.innerHTML += messageHTML;
  });
  scrollToBottom();
  // Обновление счетчиков непрочитанных сообщений
  ivanUnreadCount.style.display = state.ivanUnread > 0 ? "inline" : "none";
  maryaUnreadCount.style.display = state.maryaUnread > 0 ? "inline" : "none";

  if (state.ivanUnread > 0) {
    ivanUnreadCount.textContent = state.ivanUnread.toString();
  } else {
    ivanUnreadCount.style.display = "none";
  }

  if (state.maryaUnread > 0) {
    maryaUnreadCount.textContent = state.maryaUnread.toString();
  } else {
    maryaUnreadCount.style.display = "none";
  }
};

/* -------------------------------------ОЧИСТИТЬ ЧАТ---------------------------------------- */

clearChatButton.addEventListener("click", async () => {
  // Очистка Redux Store
  store.dispatch(clearChat());

  // Очистка сообщений в Firebase
  const messagesRef = collection(firestore, "messages");
  const querySnapshot = await getDocs(messagesRef);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
  updateUI();
});

/* -------------------------------СМАЙЛИКИ----------------------------------- */
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

emojiButton.addEventListener("click", () => {
  emojiPanel.style.display =
    emojiPanel.style.display === "none" ? "block" : "none";
});

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

/* ----------------------------------------------ОБНОВЛЕНИЕ----------------------------------------- */
// Инициализация интерфейса и загрузка данных
dispatch(fetchMessages());
console.log(store.getState());

// Подписка на обновления хранилища
store.subscribe(updateUI);

// Обновление интерфейса
updateUI();
