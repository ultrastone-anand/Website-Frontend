import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Contact from "../pages/Contact/Contact";
import Location from "../pages/Location/Location";
import Aboutus from "../pages/Ultra_Experience/About_us/aboutus";
import Category from "../pages/Material_Portfolio/Category/Category";
import { Ourblogs } from "../pages/Resource_Center/Our_Blogs/ourblogs";
import OurProcess from "../pages/Ultra_Experience/Our_Process/ourprocess";
import ProductDetails from "../pages/Material_Portfolio/Products/ProductDetails";
import ProductCategory from "../pages/Material_Portfolio/Products/ProductCategory";
import { Ceu } from "../pages/Resource_Center/CEU/Ceu";
import Career from "../pages/Resource_Center/Career/Carrer";
import CareerDetails from "../pages/Resource_Center/Career/CareerDetails";
import ScrollToTop from "../components/common/ScrollToTop";
import Videos from "../pages/Resource_Center/Videos/Videos";
import Merchandise from "../pages/Resource_Center/MerchandisingDisplays/MerchandisingDisplays";

const AppRoutes = () => {
    return (
        <>

              <ScrollToTop />

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
                path="/contact"
                element={<Contact />}
            />

            <Route
                path="/locations"
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

            <Route
                path="/blogs"
                element={<Ourblogs />}
            />

            <Route
                path="/ceu"
                element={<Ceu />}
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
                path="/videos"
                element={<Videos />}
            />

            <Route
                path="/merchandising-displays"
                element={<Merchandise />}
            />
        </Routes>

        </>
    );
};

export default AppRoutes;