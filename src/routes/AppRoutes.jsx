import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import ScrollToTop from "../components/common/ScrollToTop";
import WebsiteLayout from "../layouts/WebsiteLayout";

/* =========================================================
   HOME PAGE

   Direct import to remove the lazy-route dependency
   from initial homepage navigation.

   Other routes remain lazy-loaded.
========================================================= */

import Home from "../pages/Home";

/* =========================================================
   LAZY LOADED ROUTES
========================================================= */

const Contact = lazy(() =>
  import("../pages/Contact/Contact")
);

const Thankyoupage = lazy(() =>
  import("../pages/Contact/ThankYou")
);

const NotFound = lazy(() =>
  import("../components/common/NotFound")
);

const Location = lazy(() =>
  import("../pages/Location/Location")
);

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
  import(
    "../pages/Resource_Center/MerchandisingDisplays/MerchandisingDisplays"
  )
);

const BlogDetailedView = lazy(() =>
  import("../pages/Resource_Center/Our_Blogs/blog-detailed-view")
);

const PrivacyPolicy = lazy(() =>
  import("../pages/Resource_Center/privacy-policy")
);

const SafetyFirst = lazy(() =>
  import("../pages/Resource_Center/Silica_safety/silicaSafety")
);

const Resources = lazy(() =>
  import("../pages/Resource_Center/Resources/Resources")
);

const Productregistration = lazy(() =>
  import("../pages/Resource_Center/ProductRegistration/Productregistration")
);

/* =========================================================
   APPLICATION ROUTES
========================================================= */

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<WebsiteLayout />}>

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* MATERIAL PORTFOLIO */}
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

          {/* CONTACT */}
          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/thankyou"
            element={<Thankyoupage />}
          />

          {/* ULTRA EXPERIENCE */}
          <Route
            path="/locations/:slug"
            element={<Location />}
          />

          <Route
            path="/aboutus"
            element={<Aboutus />}
          />

          <Route
            path="/ourprocess"
            element={<OurProcess />}
          />

          {/* RESOURCE CENTER */}
          <Route
            path="/blogs"
            element={<Ourblogs />}
          />

          <Route
            path="/blog/:identifier"
            element={<BlogDetailedView />}
          />

          <Route
            path="/ceu"
            element={<Ceu />}
          />

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/career"
            element={<Career />}
          />

          <Route
            path="/careers/:slug"
            element={<CareerDetails />}
          />

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/merchandising-displays"
            element={<Merchandise />}
          />

          <Route
            path="/safety-first"
            element={<SafetyFirst />}
          />

          <Route
            path="/resources"
            element={<Resources />}
          />

          <Route
            path="/product_registration"
            element={<Productregistration />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;