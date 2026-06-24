import React from "react";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";
import { Link } from "react-router-dom";

const jobs = [
  {
    id: 1,
    title: "Receptionist Position at Ultra Stones",
    location: "Levittown, PA",
    type: "Full Time",
    description:
      "We are seeking a professional and friendly receptionist to join our team. The receptionist will be the first point of contact for visitors and clients while providing administrative support across the organization.",
  },
  {
    id: 2,
    title: "Sales Executive",
    location: "New York, NY",
    type: "Full Time",
    description:
      "Build and maintain relationships with architects, designers, builders, and homeowners while promoting Ultra Stones products.",
  },
  {
    id: 3,
    title: "Warehouse Associate",
    location: "Levittown, PA",
    type: "Full Time",
    description:
      "Assist with inventory management, slab movement, loading, unloading, and warehouse organization.",
  },
  {
    id: 4,
    title: "Marketing Coordinator",
    location: "Remote",
    type: "Full Time",
    description:
      "Support digital marketing initiatives, social media campaigns, website updates, and lead generation activities.",
  },
   {
    id: 5,
    title: "Receptionist Position at Ultra Stones",
    location: "Levittown, PA",
    type: "Full Time",
    description:
      "We are seeking a professional and friendly receptionist to join our team. The receptionist will be the first point of contact for visitors and clients while providing administrative support across the organization.",
  },
  {
    id: 6,
    title: "Sales Executive",
    location: "New York, NY",
    type: "Full Time",
    description:
      "Build and maintain relationships with architects, designers, builders, and homeowners while promoting Ultra Stones products.",
  },
  {
    id: 7,
    title: "Warehouse Associate",
    location: "Levittown, PA",
    type: "Full Time",
    description:
      "Assist with inventory management, slab movement, loading, unloading, and warehouse organization.",
  },
  {
    id: 8,
    title: "Marketing Coordinator",
    location: "Remote",
    type: "Full Time",
    description:
      "Support digital marketing initiatives, social media campaigns, website updates, and lead generation activities.",
  },
];

const CustomSelect = ({
  children,
}) => (
  <div className="relative">
    <select
      className="
        w-full
        h-[58px]
        bg-white
        border
        border-[#e5e5e5]
        px-5
        appearance-none
        outline-none
        text-[#555]
        cursor-pointer
      "
    >
      {children}
    </select>

    <svg
      className="
        absolute
        right-5
        top-1/2
        -translate-y-1/2
        w-4
        h-4
        pointer-events-none
      "
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

const Career = () => {
  return (
    <>
      <Navbar />

      <div className="bg-[#f3f3f3] min-h-screen pt-[110px]">
        {/* Header */}
        <section className="py-12">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="
                text-[34px]
                md:text-[42px]
                font-semibold
                text-[#161412]
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Careers
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4" />

            <p className="text-[13px] text-[#777]">
              <Link
                to="/"
                className="hover:text-[#161412]"
              >
                Home
              </Link>

              {" / "}

              <Link
                to="/resource-center"
                className="hover:text-[#161412]"
              >
                Resource Center
              </Link>

              {" / "}

              <span className="font-semibold text-[#161412]">
                Careers
              </span>
            </p>
          </div>
        </section>

        {/* Career Content */}
        <section className="pb-20">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              <CustomSelect>
                <option>
                  Job Type
                </option>
                <option>
                  Full Time
                </option>
                <option>
                  Part Time
                </option>
              </CustomSelect>

              <CustomSelect>
                <option>
                  Job Location
                </option>
                <option>
                  New York
                </option>
                <option>
                  Pennsylvania
                </option>
                <option>
                  Remote
                </option>
              </CustomSelect>

              <CustomSelect>
                <option>
                  Department
                </option>
                <option>
                  Sales
                </option>
                <option>
                  Operations
                </option>
                <option>
                  Marketing
                </option>
              </CustomSelect>

              <button
                className="
                  h-[58px]
                  bg-[#c91f26]
                  text-white
                  font-medium
                  hover:bg-[#a9191f]
                  duration-300
                "
              >
                Search Jobs
              </button>
            </div>

            {/* Main Layout */}
            <div className="grid lg:grid-cols-[1fr_360px] gap-10">

              {/* Jobs */}
              <div className="bg-white">
                {jobs.map(
                  (job, index) => (
                    <div
                      key={job.id}
                      className={`
                        py-10
                        px-6
                        ${
                          index !==
                          jobs.length -
                            1
                            ? "border-b border-[#e5e5e5]"
                            : ""
                        }
                      `}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div>
                          <h2
                            className="
                              text-[26px]
                              md:text-[34px]
                              text-[#161412]
                              mb-4
                            "
                            style={{
                              fontFamily:
                                '"Cormorant Garamond", serif',
                            }}
                          >
                            {job.title}
                          </h2>

                          <p
                            className="
                              text-[#555]
                              leading-[1.8]
                              max-w-[900px]
                            "
                          >
                            {
                              job.description
                            }
                          </p>
                        </div>

                        <div
                          className="
                            flex
                            flex-col
                            lg:items-end
                            gap-4
                            min-w-[180px]
                          "
                        >
                          <span className="text-sm text-[#777]">
                            {
                              job.location
                            }
                          </span>

<Link
  to={`/careers/${job.slug}`}
  className="
    bg-[#c91f26]
    text-white
    px-6
    py-3
    text-sm
    hover:bg-[#a9191f]
    duration-300
  "
>
  More Details
</Link>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Resume Form */}
              <div
                className="
                  bg-white
                  border
                  border-[#e5e5e5]
                  p-6
                  h-fit
                  sticky
                  top-[140px]
                "
              >
                <h3
                  className="
                    text-[24px]
                    text-[#161412]
                    mb-3
                  "
                  style={{
                    fontFamily:
                      '"Cormorant Garamond", serif',
                  }}
                >
                  Submit Your Resume
                </h3>

                <p
                  className="
                    text-[14px]
                    text-[#666]
                    mb-6
                    leading-relaxed
                  "
                >
                  Didn't find the right
                  opening? Upload your
                  resume and we'll get
                  in touch when
                  something matches.
                </p>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                    "
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    className="
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                    "
                  />

                  <input
                    type="text"
                    placeholder="Department"
                    className="
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                    "
                  />

                  <textarea
                    rows="5"
                    placeholder="Tell us about yourself"
                    className="
                      w-full
                      border
                      border-[#ddd]
                      px-4
                      py-3
                      resize-none
                      outline-none
                    "
                  />

                  <input
                    type="file"
                    className="w-full"
                  />

                  <button
                    className="
                      w-full
                      h-[52px]
                      bg-[#c91f26]
                      text-white
                      font-medium
                      hover:bg-[#a9191f]
                      duration-300
                    "
                  >
                    Submit Resume
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Career;