import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// Импорт редьюсера
import chatReducer from "./reducer";

// Создание хранилища с применением Redux Thunk и интеграцией Redux DevTools
const store = createStore(
  chatReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
