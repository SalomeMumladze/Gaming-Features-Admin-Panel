import { ReactQueryProvider } from "@/app/providers/ReactQueryProvider";
import { AppRouter } from "@/app/router/AppRouter";
import { ThemeProvider } from "@/shared/providers/useTheme";
import { NotificationProvider } from "@/shared/providers/useNotification";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import { ConfirmProvider } from "@/shared/providers/ConfirmProvider";
import "./App.css";

const App = () => (
  <ReactQueryProvider>
    <ErrorBoundary>
      <ConfirmProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider>
            <NotificationProvider>
              <AppRouter />
            </NotificationProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </ConfirmProvider>
    </ErrorBoundary>
  </ReactQueryProvider>
);

export default App;
