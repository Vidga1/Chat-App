import {
  SEND_MESSAGE,
  CLEAR_CHAT,
  INCREMENT_UNREAD_COUNT,
  RESET_UNREAD_COUNT,
  SET_CURRENT_SENDER,
  ChatActionTypes,
  Message,
} from "./actions";

// Определение типа для состояния чата
type ChatState = {
  messages: Message[];
  ivanUnread: number;
  maryaUnread: number;
  currentSender: string;
};

// Начальное состояние
const initialState: ChatState = {
  messages: [],
  ivanUnread: 0,
  maryaUnread: 0,
  currentSender: "Иван",
};

// Редьюсер
const chatReducer = (
  state: ChatState | undefined,
  action: ChatActionTypes,
): ChatState => {
  const currentState = state || initialState;
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case CLEAR_CHAT:
      return {
        ...state,
        messages: [],
        ivanUnread: 0,
        maryaUnread: 0,
      };
    case INCREMENT_UNREAD_COUNT:
      if (action.payload === "Иван") {
        return { ...state, ivanUnread: state.ivanUnread + 1 };
      }
      if (action.payload === "Мария") {
        return { ...state, maryaUnread: state.maryaUnread + 1 };
      }
      return state;
    case RESET_UNREAD_COUNT:
      return {
        ...state,
        ivanUnread: 0,
        maryaUnread: 0,
      };
    case SET_CURRENT_SENDER:
      return {
        ...state,
        currentSender: action.payload,
      };
    default:
      return currentState;
  }
};

export default chatReducer;
