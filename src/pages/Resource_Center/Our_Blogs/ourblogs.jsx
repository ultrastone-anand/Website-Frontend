import React, { useEffect, useState } from "react";
import Footer from "../../../components/common/Footer";
import Navbar from "../../../components/common/Navbar";
import { Link } from "react-router-dom";

const blogs = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    date: "March 1st, 2025",
    category: "Installation",
    title:
      "Why Settle for Less? Explore the Hottest Quartz Worktop Trends with Ultra Stones",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    date: "March 1st, 2025",
    category: "Remodeling",
    title:
      "Exotic Granite Colors Making a Comeback in Luxury Interiors",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
    date: "March 1st, 2025",
    category: "3D Design, Remodeling",
    title:
      "Countertop Edges 101: The Key to Style and Functionality in Kitchens & Baths",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    date: "March 1st, 2025",
    category: "Installation",
    title:
      "6 Popular White Quartzites to Transform Interiors into Masterpieces",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    date: "March 1st, 2025",
    category: "Remodeling",
    title:
      "9 Stunning Porcelain Tiles from Ultra Stones You Cannot Miss",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
    date: "March 1st, 2025",
    category: "3D Design, Remodeling",
    title:
      "7 Tips for Care and Maintenance of Natural & Engineered Stone Countertops",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    date: "March 1st, 2025",
    category: "Installation",
    title:
      "Modern Kitchen Designs Featuring Premium Quartz Countertops",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    date: "March 1st, 2025",
    category: "Remodeling",
    title:
      "Luxury Bathroom Renovation Ideas Using Natural Stone",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
    date: "March 1st, 2025",
    category: "3D Design, Remodeling",
    title:
      "Choosing the Right Stone Finish for Your Next Project",
  },
];

export const Ourblogs = () => {
  const BLOGS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.ceil(
    blogs.length / BLOGS_PER_PAGE
  );

  const currentBlogs = blogs.slice(
    (currentPage - 1) * BLOGS_PER_PAGE,
    currentPage * BLOGS_PER_PAGE
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <>
      <Navbar />

      <div className=" min-h-screen pt-[110px]">
        {/* Header */}
        <section>
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Our Blogs
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-3 mb-5" />

            <p className="text-[13px] text-[#777]">
              <Link
                to="/"
                className="hover:text-[#161412] duration-300"
              >
                Home
              </Link>

              {" / "}

              <Link
                to="/resource-center"
                className="hover:text-[#161412] duration-300"
              >
                Resource Center
              </Link>

              {" / "}

              <span className="text-[#161412] font-semibold">
                Our Blogs
              </span>
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-14">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {currentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.id}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-sm">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="
                        w-full
                        aspect-square
                        object-cover
                        duration-500
                        group-hover:scale-105
                      "
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 mt-6 text-[13px] text-[#444]">
                    <span>{blog.date}</span>
                    <span>{blog.category}</span>
                  </div>

                  <h2
                    className="
                      mt-3
                      text-[20px]
                      leading-[1.45]
                      text-[#161412]
                      group-hover:text-[#c91f26]
                      duration-300
                    "
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    {blog.title}
                  </h2>
                </Link>
              ))}
            </div>

            {/* Pagination */}
 {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-20">
                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.max(
                        currentPage - 1,
                        1
                      )
                    )
                  }
                  disabled={currentPage === 1}
                  className="
                    px-3 py-2
                    text-sm
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    hover:text-[#c91f26]
                  "
                >
                  Prev
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`
                      w-8 h-8 rounded text-sm
                      ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "hover:text-[#c91f26]"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        currentPage + 1,
                        totalPages
                      )
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="
                    px-3 py-2
                    text-sm
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    hover:text-[#c91f26]
                  "
                >
                  Next Page
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Ourblogs;