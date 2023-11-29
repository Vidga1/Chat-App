import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; // Предполагается, что путь верный
import { ChatState } from "./reducer"; // Импортируем тип состояния чата

// Определение типов действий
export const SEND_MESSAGE = "SEND_MESSAGE";
export const CLEAR_CHAT = "CLEAR_CHAT";
export const INCREMENT_UNREAD_COUNT = "INCREMENT_UNREAD_COUNT";
export const RESET_UNREAD_COUNT = "RESET_UNREAD_COUNT";
export const SET_CURRENT_SENDER = "SET_CURRENT_SENDER";
export const FETCH_MESSAGES = "FETCH_MESSAGES"; // Новый тип действия для получения сообщений

// Определение типа для сообщения
export type Message = {
  sender: string;
  text: string;
  timestamp: string;
};

export type SendMessageAction = {
  type: typeof SEND_MESSAGE;
  payload: Message;
};

export type ClearChatAction = {
  type: typeof CLEAR_CHAT;
};

export type IncrementUnreadCountAction = {
  type: typeof INCREMENT_UNREAD_COUNT;
  payload: string;
};

export type ResetUnreadCountAction = {
  type: typeof RESET_UNREAD_COUNT;
  payload: string;
};

export type SetCurrentSenderAction = {
  type: typeof SET_CURRENT_SENDER;
  payload: string;
};

export type FetchMessagesAction = {
  // Новый тип действия
  type: typeof FETCH_MESSAGES;
  payload: Message[];
};

export type ChatActionTypes =
  | SendMessageAction
  | ClearChatAction
  | IncrementUnreadCountAction
  | ResetUnreadCountAction
  | SetCurrentSenderAction
  | FetchMessagesAction;

// Action Creators
export const sendMessage = (message: Message): SendMessageAction => ({
  type: SEND_MESSAGE,
  payload: message,
});

export const clearChat = (): ClearChatAction => ({
  type: CLEAR_CHAT,
});

export const incrementUnreadCount = (
  userName: string,
): IncrementUnreadCountAction => ({
  type: INCREMENT_UNREAD_COUNT,
  payload: userName,
});

export const resetUnreadCount = (userName: string): ResetUnreadCountAction => ({
  type: RESET_UNREAD_COUNT,
  payload: userName,
});

export const setCurrentSender = (sender: string): SetCurrentSenderAction => ({
  type: SET_CURRENT_SENDER,
  payload: sender,
});

// Асинхронный Action Creator (Thunk)
export const fetchMessages =
  (): ThunkAction<void, ChatState, unknown, Action<string>> =>
  async (dispatch) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "messages"));
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data() as Message);
      });
      dispatch({
        type: FETCH_MESSAGES,
        payload: messages,
      });
    } catch (error) {
      console.error("Ошибка при получении сообщений: ", error);
    }
  };
