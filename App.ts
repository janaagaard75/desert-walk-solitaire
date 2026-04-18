import { configure } from "mobx";
import App from "./src/App";

configure({
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
});

export default App;
