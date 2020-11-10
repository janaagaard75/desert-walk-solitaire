import { configure } from "mobx"
import { MainView } from "./src/MainView"

// See https://github.com/mobxjs/mobx/blob/main/docs/migrating-from-4-or-5.md#getting-started.
configure({ enforceActions: "never" })
export default MainView
