import { ReactQueryProvider } from "@/app/providers/ReactQueryProvider";
import { AppRouter } from "@/app/router/AppRouter";
import { ThemeProvider } from "@/shared/hooks/useTheme";
import { NotificationProvider } from "@/shared/hooks/useNotification";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./App.css";

const App = () => (
  <ReactQueryProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </ReactQueryProvider>
);

export default App;
