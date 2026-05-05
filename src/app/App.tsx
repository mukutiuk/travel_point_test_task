import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/app/providers/AppProviders";
import { appRouter } from "@/app/router";
import { ErrorBoundary } from "@/UIKit/ErrorBoundary";

function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <RouterProvider router={appRouter} />
      </ErrorBoundary>
    </AppProviders>
  );
}

export default App;
