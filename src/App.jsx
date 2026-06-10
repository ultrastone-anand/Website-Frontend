import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import ProductDetails from "./pages/Products/ProductDetails"
import ProductCategory from "./pages/Products/ProductCategory"
import Category from "./pages/Category/Category"

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

            <Route
         path="/categories"
        element={<Category/>}
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