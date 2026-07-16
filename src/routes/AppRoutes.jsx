import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import ScrollToTop from "../components/common/ScrollToTop";

const Home = lazy(() => import("../pages/Home"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const Location = lazy(() => import("../pages/Location/Location"));
const Aboutus = lazy(() =>
  import("../pages/Ultra_Experience/About_us/aboutus")
);
const Category = lazy(() =>
  import("../pages/Material_Portfolio/Category/Category")
);
const Ourblogs = lazy(() =>
  import("../pages/Resource_Center/Our_Blogs/ourblogs")
);
const OurProcess = lazy(() =>
  import("../pages/Ultra_Experience/Our_Process/ourprocess")
);
const ProductDetails = lazy(() =>
  import("../pages/Material_Portfolio/Products/ProductDetails")
);
const ProductCategory = lazy(() =>
  import("../pages/Material_Portfolio/Products/ProductCategory")
);
const Ceu = lazy(() =>
  import("../pages/Resource_Center/CEU/Ceu")
);
const Career = lazy(() =>
  import("../pages/Resource_Center/Career/Carrer")
);
const CareerDetails = lazy(() =>
  import("../pages/Resource_Center/Career/CareerDetails")
);
const Gallery = lazy(() =>
  import("../pages/Resource_Center/Gallery/Gallery")
);
const Merchandise = lazy(() =>
  import("../pages/Resource_Center/MerchandisingDisplays/MerchandisingDisplays")
);

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/product-category/:slug" element={<ProductCategory />} />
        <Route
          path="/product/:categorySlug/:productSlug"
          element={<ProductDetails />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/locations/:slug" element={<Location />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/ourprocess" element={<OurProcess />} />
        <Route path="/blogs" element={<Ourblogs />} />
        <Route path="/ceu" element={<Ceu />} />
        <Route path="/career" element={<Career />} />
        <Route path="/careers/:slug" element={<CareerDetails />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route
          path="/merchandising-displays"
          element={<Merchandise />}
        />
      </Routes>
    </>
  );
};

export default AppRoutes;