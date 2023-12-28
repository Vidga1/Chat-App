import {
  ChatState,
  chatReducer,
  initialState as chatInitialState,
} from "./reducer";
import { ChatActionTypes } from "./actions";

class Store {
  private state: ChatState;

  private listeners: Array<() => void> = [];

  constructor(initialState: ChatState) {
    this.state = initialState;
  }

  getState = (): ChatState => this.state;

  dispatch = (action: ChatActionTypes): void => {
    this.state = chatReducer(this.state, action);
    this.listeners.forEach((listener) => listener());
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };
}

const store = new Store(chatInitialState);
export default store;
