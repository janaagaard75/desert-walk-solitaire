import { configure } from "mobx";
import { MainView } from "./src/MainView";

configure({
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
});

export default MainView;
