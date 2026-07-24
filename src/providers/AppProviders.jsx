import AccessibilityProvider from "../accessibility/AccessibilityProvider";

const AppProviders = ({ children }) => {
  return (
    <AccessibilityProvider>
      {children}
    </AccessibilityProvider>
  );
};

export default AppProviders;