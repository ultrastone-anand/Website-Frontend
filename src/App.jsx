import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Contact from "./pages/Contact/Contact"
import Location from "./pages/Location/Location"
import Aboutus from "./pages/Ultra_Experience/About_us/aboutus"
import Category from "./pages/Material_Portfolio/Category/Category"
import ProductDetails from "./pages/Material_Portfolio/Products/ProductDetails"
import ProductCategory from "./pages/Material_Portfolio/Products/ProductCategory"
import OurProcess from "./pages/Ultra_Experience/Our_Process/ourprocess"

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/categories"
        element={<Category />}
      />

      <Route
        path="/product-category/:slug"
        element={<ProductCategory />}
      />

      <Route
        path="/product/:categorySlug/:productSlug"
        element={<ProductDetails />}
      />

      <Route
        path='/contacts'
        element={<Contact />}
      />

      <Route
        path='/locations'
        element={<Location />}
      />

      <Route
        path='/aboutus'
        element={<Aboutus />}
      />

      <Route
        path='/ourprocess'
        element={<OurProcess />}
      />

    </Routes>
  )
}

export default App