import { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import Loading from "./components/common/Loading";

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      }
    >
      <AppRoutes />
    </Suspense>
  );
}

export default App;