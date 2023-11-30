import {
  SEND_MESSAGE,
  CLEAR_CHAT,
  INCREMENT_UNREAD_COUNT,
  RESET_UNREAD_COUNT,
  SET_CURRENT_SENDER,
  FETCH_MESSAGES,
  ChatActionTypes,
  Message,
} from "./actions";

// Определение типа для состояния чата
export type ChatState = {
  messages: Message[];
  ivanUnread: number;
  maryaUnread: number;
  currentSender: string;
};

// Начальное состояние
const initialState: ChatState = {
  messages: [],
  ivanUnread: localStorage.getItem("ivanUnread")
    ? parseInt(localStorage.getItem("ivanUnread"), 10)
    : 0,
  maryaUnread: localStorage.getItem("maryaUnread")
    ? parseInt(localStorage.getItem("maryaUnread"), 10)
    : 0,
  currentSender: "Иван",
};

// Редьюсер
const chatReducer = (
  state: ChatState | undefined,
  action: ChatActionTypes,
): ChatState => {
  const currentState = state || initialState;
  switch (action.type) {
    case SEND_MESSAGE: {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    }
    case CLEAR_CHAT: {
      return {
        ...state,
        messages: [],
      };
    }
    case INCREMENT_UNREAD_COUNT: {
      const updatedIvanUnread =
        action.payload === "Иван" ? state.ivanUnread + 1 : state.ivanUnread;
      const updatedMaryaUnread =
        action.payload === "Мария" ? state.maryaUnread + 1 : state.maryaUnread;

      if (action.payload === "Иван") {
        localStorage.setItem("ivanUnread", updatedIvanUnread.toString());
        return { ...state, ivanUnread: updatedIvanUnread };
      }
      if (action.payload === "Мария") {
        localStorage.setItem("maryaUnread", updatedMaryaUnread.toString());
        return { ...state, maryaUnread: updatedMaryaUnread };
      }
      return state;
    }
    case RESET_UNREAD_COUNT: {
      if (action.payload === "Иван") {
        localStorage.setItem("ivanUnread", "0");
        return { ...state, ivanUnread: 0 };
      }
      if (action.payload === "Мария") {
        localStorage.setItem("maryaUnread", "0");
        return { ...state, maryaUnread: 0 };
      }
      return state;
    }
    case SET_CURRENT_SENDER: {
      return {
        ...state,
        currentSender: action.payload,
      };
    }
    case FETCH_MESSAGES: {
      return {
        ...state,
        messages: action.payload,
      };
    }
    default:
      return currentState;
  }
};

export default chatReducer;
