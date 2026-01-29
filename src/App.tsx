import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const { worker } = await import("./mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
      });

      setReady(true);
    }

    init();
  }, []);

  

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
