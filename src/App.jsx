import { Suspense } from "react";

import AppRoutes from "./routes/AppRoutes";
import AccessibilityMenu from "./accessibility/AccessibilityMenu";
import Loading from "./components/common/Loading";

function InitialPageLoader() {
  return (
    <Loading/>
  );
}

function App() {
  return (
    <>
      <div className="site-content">
        <Suspense fallback={<InitialPageLoader />}>
          <AppRoutes />
        </Suspense>
      </div>

      <AccessibilityMenu />
    </>
  );
}

export default App;