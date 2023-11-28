// Определение типа для сообщения
export type Message = {
  sender: string;
  text: string;
  timestamp: string;
};

// Определение типов действий
export const SEND_MESSAGE = "SEND_MESSAGE";
export const CLEAR_CHAT = "CLEAR_CHAT";
export const INCREMENT_UNREAD_COUNT = "INCREMENT_UNREAD_COUNT";
export const RESET_UNREAD_COUNT = "RESET_UNREAD_COUNT";
export const SET_CURRENT_SENDER = "SET_CURRENT_SENDER";

export type SendMessageAction = {
  type: typeof SEND_MESSAGE;
  payload: Message;
};

export type ClearChatAction = {
  type: typeof CLEAR_CHAT;
};

export type IncrementUnreadCountAction = {
  type: typeof INCREMENT_UNREAD_COUNT;
  payload: string; // Добавляем payload
};

export type ResetUnreadCountAction = {
  type: typeof RESET_UNREAD_COUNT;
  payload: string;
};

export type SetCurrentSenderAction = {
  type: typeof SET_CURRENT_SENDER;
  payload: string;
};

// Объединение всех типов действий в один тип
export type ChatActionTypes =
  | SendMessageAction
  | ClearChatAction
  | IncrementUnreadCountAction
  | ResetUnreadCountAction
  | SetCurrentSenderAction;

// Действия
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
