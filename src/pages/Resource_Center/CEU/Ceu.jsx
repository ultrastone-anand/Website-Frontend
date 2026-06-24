import React from "react";
import Footer from "../../../components/common/Footer";
import Navbar from "../../../components/common/Navbar";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Natural Stone Principles",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    description:
      "This course provides a solid introduction to natural stone as a building material. Participants will learn about stone formation, composition, extraction, fabrication, and installation considerations.",
    objectives: [
      "Understand the basic composition of natural stone.",
      "Review stone classifications and applications.",
      "Learn fabrication and installation considerations.",
      "Explore sustainability and maintenance practices.",
    ],
  },
  {
    id: 2,
    title: "The Art of Specifying Natural Stone",
    image:
      "https://images.unsplash.com/photo-1582582429416-47d7f8b89c86?w=1200&q=80",
    description:
      "Learn best practices for specifying natural stone and selecting the right materials for commercial and residential projects.",
    objectives: [
      "Understand specification requirements.",
      "Review common finish options.",
      "Learn stone performance characteristics.",
      "Apply specification principles to real projects.",
    ],
  },
  {
    id: 3,
    title: "Why Choose Natural Stone",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80",
    description:
      "Explore the beauty, durability, sustainability, and long-term value that natural stone brings to architectural and interior design projects.",
    objectives: [
      "Understand sustainability benefits.",
      "Compare natural stone to alternative materials.",
      "Review lifecycle performance advantages.",
      "Explore design possibilities and applications.",
    ],
  },
];

export const Ceu = () => {
  return (
    <>
      <Navbar />

      <div className="bg-[#f3f3f3] min-h-screen pt-[110px]">
        {/* Header */}
        <section>
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              CEU
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
                CEU
              </span>
            </p>
          </div>
        </section>

        {/* Hero Banner */}
      <section className="py-14">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <div className="relative h-[500px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1800&q=80"
                alt="CEU Lunch and Learn"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h2
                  className="
                    text-white
                    text-center
                    text-[30px]
                    md:text-[50px]
                    font-semibold
                    uppercase
                    tracking-wide
                    px-4
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  CEU: Lunch and Learn
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section className="py-24">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="space-y-32">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="
                    grid
                    lg:grid-cols-2
                    gap-12
                    lg:gap-20
                    items-start
                  "
                >
                  {/* Image */}
                  <div className="overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="
                        w-full
                        aspect-[4/3]
                        object-cover
                        duration-700
                        hover:scale-105
                      "
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <p
                      className="
                        uppercase
                        tracking-wider
                        text-[13px]
                        text-[#666]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      CEU Course for Architects &
                      Designers
                    </p>

                    <h3
                      className="
                        mt-3
                        text-[32px]
                        md:text-[40px]
                        text-[#c91f26]
                        leading-tight
                      "
                      style={{
                        fontFamily:
                          '"Cormorant Garamond", serif',
                      }}
                    >
                      {course.title}
                    </h3>

                    <p
                      className="
                        mt-6
                        text-[15px]
                        leading-[1.9]
                        text-[#555]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {course.description}
                    </p>

                    <div className="mt-8">
                      <h4
                        className="
                          text-[15px]
                          font-semibold
                          text-[#161412]
                          mb-3
                        "
                      >
                        Learning Objectives
                      </h4>

                      <ul className="space-y-2">
                        {course.objectives.map(
                          (
                            objective,
                            index
                          ) => (
                            <li
                              key={index}
                              className="
                                text-[14px]
                                text-[#555]
                                leading-relaxed
                                flex
                                gap-3
                              "
                            >
                              <span>
                                {index + 1}.
                              </span>
                              <span>
                                {objective}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <button
                      className="
                        mt-10
                        border
                        border-[#c91f26]
                        px-6
                        py-3
                        text-[13px]
                        uppercase
                        tracking-wide
                        text-[#c91f26]
                        hover:bg-[#c91f26]
                        hover:text-white
                        duration-300
                      "
                    >
                      Request Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Ceu;