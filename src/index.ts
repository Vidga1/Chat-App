import "./style.css";
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
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

const ivanSelectorButton = document.getElementById(
  "ivan-selector",
) as HTMLButtonElement;
const maryaSelectorButton = document.getElementById(
  "marya-selector",
) as HTMLButtonElement;
const chatInputForm = document.querySelector(
  ".chat-input-form",
) as HTMLFormElement;
const chatInput = document.querySelector(".chat-input") as HTMLTextAreaElement;
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

function handleUserSelection(
  user: string,
  userButton: HTMLButtonElement,
  otherButton: HTMLButtonElement,
) {
  store.dispatch(setCurrentSender(user));
  userButton.classList.add("active-person");
  otherButton.classList.remove("active-person");
  store.dispatch(resetUnreadCount(user));

  localStorage.setItem(user === "Иван" ? "ivanUnread" : "maryaUnread", "0");
  localStorage.setItem("currentSender", user);
  const chatHeader = document.querySelector(
    ".chat-header",
  ) as HTMLHeadingElement;
  const chatInputPlaceholder = document.querySelector(
    ".chat-input",
  ) as HTMLTextAreaElement;
  if (user === "Иван") {
    chatHeader.textContent = "Мария пишет...";
    chatInputPlaceholder.placeholder = "Здесь пишет, Иван...";
  } else {
    chatHeader.textContent = "Иван пишет...";
    chatInputPlaceholder.placeholder = "Здесь пишет, Мария...";
  }
}

ivanSelectorButton.addEventListener("click", () =>
  handleUserSelection("Иван", ivanSelectorButton, maryaSelectorButton),
);
maryaSelectorButton.addEventListener("click", () =>
  handleUserSelection("Мария", maryaSelectorButton, ivanSelectorButton),
);

async function sendMessageHandler() {
  const message = chatInput.value.trim();
  if (message) {
    const timestamp = new Date().toISOString();
    const { currentSender } = store.getState();

    const messageData = { sender: currentSender, text: message, timestamp };

    store.dispatch(sendMessage(messageData));

    try {
      await addDoc(collection(firestore, "messages"), messageData);
    } catch (error) {
      console.error("Ошибка при добавлении сообщения: ", error);
    }

    chatInput.value = "";

    const recipient = currentSender === "Иван" ? "Мария" : "Иван";
    store.dispatch(incrementUnreadCount(recipient));

    const updatedCount =
      store.getState()[recipient === "Иван" ? "ivanUnread" : "maryaUnread"];
    localStorage.setItem(
      recipient === "Иван" ? "ivanUnread" : "maryaUnread",
      updatedCount.toString(),
    );

    scrollToBottom();
  }
}

chatInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    await sendMessageHandler();
  }
});

chatInputForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await sendMessageHandler();
});

const updateUI = () => {
  emojiPanel.style.display = "none";

  const state = store.getState();
  chatMessages.innerHTML = "";

  state.messages.forEach((messageData) => {
    const messageHTML = createChatMessageElement(
      messageData,
      state.currentSender,
    );
    chatMessages.innerHTML += messageHTML;
  });
  scrollToBottom();

  ivanUnreadCount.textContent =
    state.ivanUnread > 0 ? state.ivanUnread.toString() : "";
  maryaUnreadCount.textContent =
    state.maryaUnread > 0 ? state.maryaUnread.toString() : "";
  ivanUnreadCount.style.display = state.ivanUnread > 0 ? "inline" : "none";
  maryaUnreadCount.style.display = state.maryaUnread > 0 ? "inline" : "none";
};

clearChatButton.addEventListener("click", async () => {
  store.dispatch(clearChat());

  store.dispatch(resetUnreadCount("Иван"));
  store.dispatch(resetUnreadCount("Мария"));

  localStorage.setItem("ivanUnread", "0");
  localStorage.setItem("maryaUnread", "0");

  const messagesRef = collection(firestore, "messages");
  const querySnapshot = await getDocs(messagesRef);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
  chatInput.value = "";
  updateUI();
});

const insertEmoji = (emoji: string) => {
  const start = chatInput.selectionStart;
  const end = chatInput.selectionEnd;
  const text = chatInput.value;
  const before = text.substring(0, start);
  const after = text.substring(end, text.length);
  chatInput.value = before + emoji + after;
  chatInput.selectionStart = start + emoji.length;
  chatInput.selectionEnd = start + emoji.length;
  chatInput.focus();
};

emojiButton.addEventListener("click", () => {
  const isPanelVisible = emojiPanel.style.display === "block";
  emojiPanel.style.display = isPanelVisible ? "none" : "block";
  clearChatButton.style.display = isPanelVisible ? "block" : "none";
});

document.querySelectorAll(".emoji").forEach((emojiElement) => {
  emojiElement.addEventListener("click", (e) => {
    const emoji = (e.target as HTMLElement).textContent;
    if (emoji) {
      insertEmoji(emoji);
      emojiPanel.style.display = "none";
      clearChatButton.style.display = "block";
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const savedSender = localStorage.getItem("currentSender");
  if (savedSender) {
    handleUserSelection(
      savedSender,
      savedSender === "Иван" ? ivanSelectorButton : maryaSelectorButton,
      savedSender === "Иван" ? maryaSelectorButton : ivanSelectorButton,
    );
  }

  if (emojiPanel) {
    emojiPanel.style.display = "none";
  }

  await fetchMessages(store.dispatch);

  store.subscribe(updateUI);
  updateUI();
});
