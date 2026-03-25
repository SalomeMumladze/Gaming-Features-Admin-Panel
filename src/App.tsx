import { ReactQueryProvider } from "./app/providers/ReactQueryProvider";
import { AppRouter } from "./app/router/AppRouter";
import "./App.css";

const App = () => (
  <ReactQueryProvider>
    <AppRouter />
  </ReactQueryProvider>
);

export default App;
