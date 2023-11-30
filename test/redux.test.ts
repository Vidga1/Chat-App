// actions.test.ts
import { collection, getDocs } from "firebase/firestore";
import * as actions from "../src/redux/actions";
import { Message, fetchMessages, ChatActionTypes } from "../src/redux/actions";
import { chatReducer, initialState, ChatState } from "../src/redux/reducer";
import store from "../src/redux/store";
import { firestore } from "../src/firebaseConfig";

describe("chat actions", () => {
  it("should create an action to send a message", () => {
    const message: Message = {
      sender: "Иван",
      text: "Привет",
      timestamp: "2021-01-01T00:00:00.000Z",
    };
    const expectedAction = {
      type: actions.SEND_MESSAGE,
      payload: message,
    };
    expect(actions.sendMessage(message)).toEqual(expectedAction);
  });
});

describe("chat reducer", () => {
  it("should handle SEND_MESSAGE", () => {
    const startState: ChatState = { ...initialState };
    const message: actions.Message = {
      sender: "Иван",
      text: "Привет",
      timestamp: "2021-01-01T00:00:00.000Z",
    };
    const action = actions.sendMessage(message);
    const expectedState: ChatState = {
      ...initialState,
      messages: [...initialState.messages, message],
    };
    expect(chatReducer(startState, action)).toEqual(expectedState);
  });
});

describe("Store", () => {
  it("should update state correctly when dispatching an action", () => {
    const message = {
      sender: "Иван",
      text: "Привет",
      timestamp: "2021-01-01T00:00:00.000Z",
    };
    store.dispatch(actions.sendMessage(message));
    expect(store.getState().messages).toEqual([message]);
  });
  it("should clear messages when the chat is cleared", () => {
    store.dispatch(actions.clearChat());
    expect(store.getState().messages).toEqual([]);
  });
  it("should notify subscribers when the state changes", () => {
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);

    store.dispatch(
      actions.sendMessage({
        sender: "Иван",
        text: "Привет",
        timestamp: "2021-01-01T00:00:00.000Z",
      }),
    );
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.dispatch(actions.clearChat());
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it("should update state for incrementUnreadCount action", () => {
    store.dispatch(actions.incrementUnreadCount("Иван"));
    expect(store.getState().ivanUnread).toBe(1);
  });

  it("should update state for resetUnreadCount action", () => {
    store.dispatch(actions.resetUnreadCount("Иван"));
    expect(store.getState().ivanUnread).toBe(0);
  });

  it("should update state for setCurrentSender action", () => {
    store.dispatch(actions.setCurrentSender("Мария"));
    expect(store.getState().currentSender).toBe("Мария");
  });
});

jest.mock("../src/firebaseConfig", () => ({
  firestore: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

describe("fetchMessages", () => {
  it("fetches messages successfully", async () => {
    const mockDispatch = jest.fn();
    const mockMessages = [
      { sender: "Иван", text: "Привет", timestamp: "2021-01-01T00:00:00.000Z" },
    ];

    // Мокаем getDocs
    (getDocs as jest.Mock).mockResolvedValue({
      docs: mockMessages.map((message) => ({ data: () => message })),
    });

    await fetchMessages(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "FETCH_MESSAGES_SUCCESS",
      payload: mockMessages,
    });
    expect(collection).toHaveBeenCalledWith(firestore, "messages");
  });
});

describe("clearChat action", () => {
  it("should create an action to clear the chat", () => {
    const expectedAction = {
      type: actions.CLEAR_CHAT,
    };
    expect(actions.clearChat()).toEqual(expectedAction);
  });
});

describe("incrementUnreadCount action", () => {
  it("should create an action to increment unread count", () => {
    const userName = "Иван";
    const expectedAction = {
      type: actions.INCREMENT_UNREAD_COUNT,
      payload: userName,
    };
    expect(actions.incrementUnreadCount(userName)).toEqual(expectedAction);
  });
});

describe("chat reducer for CLEAR_CHAT", () => {
  it("should clear messages when clearing the chat", () => {
    const startState: ChatState = {
      ...initialState,
      messages: [
        {
          sender: "Иван",
          text: "Привет",
          timestamp: "2021-01-01T00:00:00.000Z",
        },
      ],
    };
    const action = actions.clearChat();
    const expectedState: ChatState = {
      ...initialState,
      messages: [],
    };
    expect(chatReducer(startState, action)).toEqual(expectedState);
  });
});

describe("chat reducer for INCREMENT_UNREAD_COUNT", () => {
  it("should increment unread count for Иван", () => {
    const startState: ChatState = { ...initialState, ivanUnread: 0 };
    const action = actions.incrementUnreadCount("Иван");
    const expectedState: ChatState = {
      ...initialState,
      ivanUnread: 1,
    };
    expect(chatReducer(startState, action)).toEqual(expectedState);
  });
  it("should increment unread count for Мария", () => {
    const startState: ChatState = { ...initialState, maryaUnread: 0 };
    const action = actions.incrementUnreadCount("Мария");
    const expectedState: ChatState = {
      ...initialState,
      maryaUnread: 1,
    };
    expect(chatReducer(startState, action)).toEqual(expectedState);
  });
  it("should not increment unread count for Мария when action is for Иван", () => {
    const state = chatReducer(
      initialState,
      actions.incrementUnreadCount("Иван"),
    );
    expect(state.maryaUnread).toBe(0);
  });
  it("should not increment unread count for Иван when action is for Мария", () => {
    const state = chatReducer(
      initialState,
      actions.incrementUnreadCount("Мария"),
    );
    expect(state.ivanUnread).toBe(0);
  });
});

describe("resetUnreadCount action", () => {
  it("should create an action to reset unread count for a user", () => {
    const userName = "Иван";
    const expectedAction = {
      type: actions.RESET_UNREAD_COUNT,
      payload: userName,
    };
    expect(actions.resetUnreadCount(userName)).toEqual(expectedAction);
  });
});

describe("setCurrentSender action", () => {
  it("should create an action to set the current sender", () => {
    const sender = "Иван";
    const expectedAction = {
      type: actions.SET_CURRENT_SENDER,
      payload: sender,
    };
    expect(actions.setCurrentSender(sender)).toEqual(expectedAction);
  });
});

describe("chat reducer for RESET_UNREAD_COUNT", () => {
  it("should reset unread count for Иван", () => {
    const customInitialState = { ...initialState, ivanUnread: 3 };
    const state = chatReducer(
      customInitialState,
      actions.resetUnreadCount("Иван"),
    );
    expect(state.ivanUnread).toBe(0);
  });

  it("should not reset unread count for Мария when action is for Иван", () => {
    const customInitialState = { ...initialState, maryaUnread: 3 };
    const state = chatReducer(
      customInitialState,
      actions.resetUnreadCount("Иван"),
    );
    expect(state.maryaUnread).toBe(3);
  });
});

describe("chat reducer for SET_CURRENT_SENDER", () => {
  it("should set current sender", () => {
    const startState: ChatState = { ...initialState, currentSender: "Мария" };
    const action = actions.setCurrentSender("Иван");
    const expectedState: ChatState = {
      ...initialState,
      currentSender: "Иван",
    };
    expect(chatReducer(startState, action)).toEqual(expectedState);
  });
});

describe("chat reducer for SEND_MESSAGE", () => {
  it("should add a new message to the state", () => {
    const newMessage = {
      sender: "Мария",
      text: "Как дела?",
      timestamp: "2021-01-01T00:00:00.000Z",
    };
    const state = chatReducer(initialState, actions.sendMessage(newMessage));
    expect(state.messages).toContainEqual(newMessage);
  });
});

describe("chat reducer for FETCH_MESSAGES_SUCCESS", () => {
  it("should update all messages in the state", () => {
    const fetchedMessages = [
      { sender: "Иван", text: "Привет", timestamp: "2021-01-01T00:00:00.000Z" },
      {
        sender: "Мария",
        text: "Как дела?",
        timestamp: "2021-01-02T00:00:00.000Z",
      },
    ];
    const state = chatReducer(
      initialState,
      actions.fetchMessagesSuccess(fetchedMessages),
    );
    expect(state.messages).toEqual(fetchedMessages);
  });
});

describe("chat reducer additional tests", () => {
  it("INCREMENT_UNREAD_COUNT should not change state for unknown user", () => {
    const action = actions.incrementUnreadCount("Незнакомец");
    const state = chatReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it("RESET_UNREAD_COUNT should not change state for unknown user", () => {
    const action = actions.resetUnreadCount("Незнакомец");
    const state = chatReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it("should return the initial state when state is undefined", () => {
    const action = { type: "DUMMY_ACTION" };
    const state = chatReducer(undefined, action as ChatActionTypes);
    expect(state).toEqual(initialState);
  });
});
