import { Suspense } from "react";

import Loading from "./components/common/Loading";
import AppRoutes from "./routes/AppRoutes";
import AccessibilityMenu from "./accessibility/AccessibilityMenu";

function App() {
  return (
    <>
      <div className="site-content">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <Loading />
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </div>

      <AccessibilityMenu />
    </>
  );
}

export default App;