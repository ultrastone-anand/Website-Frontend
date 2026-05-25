import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import ProductDetails from "./pages/ProductDetails"
import ProductCategory from "./pages/ProductCategory"

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
         path="/product-category/:slug"
        element={<ProductCategory/>}
      />

      <Route
        path="/product/:categorySlug/:productSlug"
        element={<ProductDetails />}
      />

    </Routes>
  )
}

export default App