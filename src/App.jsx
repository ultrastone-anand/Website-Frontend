import AppRoutes from "./routes/AppRoutes";
import AccessibilityMenu from "./accessibility/AccessibilityMenu";

function App() {
  return (
    <>
      <div className="site-content">
        <AppRoutes />
      </div>

      <AccessibilityMenu />
    </>
  );
}

export default App;