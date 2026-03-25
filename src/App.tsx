import { ReactQueryProvider } from "@/app/providers/ReactQueryProvider";
import { AppRouter } from "@/app/router/AppRouter";
import { ThemeProvider } from "@/shared/hooks/useTheme";
import "./App.css";

const App = () => (
  <ReactQueryProvider>
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </ReactQueryProvider>
);

export default App;
