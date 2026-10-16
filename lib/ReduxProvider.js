import { makeStore } from "./store";
import { Provider } from "react-redux";

const store = makeStore();

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
