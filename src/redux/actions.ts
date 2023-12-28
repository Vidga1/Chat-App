import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

export const SEND_MESSAGE = "SEND_MESSAGE";
export const CLEAR_CHAT = "CLEAR_CHAT";
export const INCREMENT_UNREAD_COUNT = "INCREMENT_UNREAD_COUNT";
export const RESET_UNREAD_COUNT = "RESET_UNREAD_COUNT";
export const SET_CURRENT_SENDER = "SET_CURRENT_SENDER";
export const FETCH_MESSAGES_SUCCESS = "FETCH_MESSAGES_SUCCESS";

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

export type FetchMessagesSuccessAction = {
  type: typeof FETCH_MESSAGES_SUCCESS;
  payload: Message[];
};

export type ChatActionTypes =
  | SendMessageAction
  | ClearChatAction
  | IncrementUnreadCountAction
  | ResetUnreadCountAction
  | SetCurrentSenderAction
  | FetchMessagesSuccessAction;

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

export const fetchMessagesSuccess = (
  messages: Message[],
): FetchMessagesSuccessAction => ({
  type: FETCH_MESSAGES_SUCCESS,
  payload: messages,
});

export const fetchMessages = async (
  dispatch: (action: ChatActionTypes) => void,
) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "messages"));
    const messages: Message[] = querySnapshot.docs.map(
      (doc) => doc.data() as Message,
    );
    messages.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    dispatch(fetchMessagesSuccess(messages));
  } catch (error) {
    console.error("Ошибка при получении сообщений: ", error);
  }
};
