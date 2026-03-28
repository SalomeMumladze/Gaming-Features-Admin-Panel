import { ReactQueryProvider } from "@/app/providers/ReactQueryProvider";
import { AppRouter } from "@/app/router/AppRouter";
import { ThemeProvider } from "@/shared/hooks/useTheme";
import { NotificationProvider } from "@/shared/hooks/useNotification";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import "./App.css";

const App = () => (
  <ReactQueryProvider>
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider>
          <NotificationProvider>
            <AppRouter />
          </NotificationProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  </ReactQueryProvider>
);

export default App;
