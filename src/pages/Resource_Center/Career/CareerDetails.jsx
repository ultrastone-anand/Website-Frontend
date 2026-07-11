import React from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

const jobs = [
  {
    slug: "receptionist-position-at-ultra-stones",
    title: "Receptionist at Ultra Stones",
    type: "Full Time",
    mode: "Onsite",
    location: "Levittown PA",

    summary:
      "The Receptionist will be the first point of contact for clients, visitors, and vendors, playing a key role in shaping first impressions and supporting day-to-day administrative operations. This position requires excellent communication skills, attention to detail, and a polished, professional demeanor.",

    responsibilities: [
      "Warmly welcome and assist all visitors upon arrival, ensuring a professional and courteous experience.",
      "Direct guests to the appropriate departments or staff members.",
      "Manage and route incoming calls promptly and professionally.",
      "Maintain a clean, organized, and well-stocked reception area.",
      "Provide accurate company information in person, by phone, and via email.",
      "Receive, sort, and distribute incoming mail, packages, and deliveries.",
      "Enforce front-desk security protocols and visitor logs.",
      "Perform general clerical duties including filing, scanning, photocopying and data entry.",
      "Support internal departments with administrative tasks as needed.",
    ],

    qualifications: [
      "Previous experience as a receptionist, administrative assistant, or front-office role.",
      "Proficiency in Microsoft Office Suite (Word, Excel, Outlook).",
      "Familiarity with common office equipment.",
      "Strong verbal and written communication skills.",
      "Professional appearance and customer-focused attitude.",
      "Ability to handle multiple tasks simultaneously.",
      "Strong organizational skills and attention to detail.",
      "Dependable, proactive, and able to work both independently and as part of a team.",
    ],

    howToApply:
      "To be considered for this position, please reply to this post with your resume and indicate your earliest availability. You may also contact us directly to schedule an interview appointment.",
  },
];

const CareerDetails = () => {
  const { slug } = useParams();

  const job =
    jobs.find((item) => item.slug === slug) ||
    jobs[0];

  return (
    <>
      <Navbar />

      <div className=" min-h-screen pt-[110px]">
        {/* Header */}
        <section className="py-12">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[38px] md:text-[52px] text-[#161412]"
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-3 mt-6">
              <span
                className="
                  px-4 py-2
                  bg-white
                  border
                  border-[#e5e5e5]
                  text-[14px]
                "
              >
                {job.type}
              </span>

              <span
                className="
                  px-4 py-2
                  bg-white
                  border
                  border-[#e5e5e5]
                  text-[14px]
                "
              >
                {job.mode}
              </span>

              <span
                className="
                  px-4 py-2
                  bg-white
                  border
                  border-[#e5e5e5]
                  text-[14px]
                "
              >
                {job.location}
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-20">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <div className="grid lg:grid-cols-[1fr_500px] gap-16">
              {/* Left Side */}
              <div>
                <div className="mb-12">
                  <p className="text-[#555] leading-[1.9]">
                    Office Hours: Monday - Friday
                    8:00 AM - 5:00 PM |
                    Saturday 9:00 AM - 1:00 PM
                    <br />
                    {job.location}
                  </p>
                </div>

                <div className="mb-10">
                  <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                    Job Summary
                  </h2>

                  <p className="text-[#444] leading-[1.9]">
                    {job.summary}
                  </p>
                </div>

                <div className="mb-10">
                  <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                    Responsibilities
                  </h2>

                  <ul className="list-disc pl-6 space-y-2 text-[#444]">
                    {job.responsibilities.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mb-10">
                  <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                    Qualifications
                  </h2>

                  <ul className="list-disc pl-6 space-y-2 text-[#444]">
                    {job.qualifications.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                    How To Apply
                  </h2>

                  <p className="text-[#444] leading-[1.9]">
                    {job.howToApply}
                    <br />
                    <br />
                    +1 (215) 647-3972
                  </p>
                </div>
              </div>

              {/* Right Side Form */}
              <div
                className="
                  bg-white
                  border
                  border-[#e5e5e5]
                  rounded-xl
                  p-8
                  h-fit
                  sticky
                  top-[140px]
                "
              >
                <form className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name*
                      </label>

                      <input
                        type="text"
                        placeholder="First Name"
                        className="
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                        "
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name*
                      </label>

                      <input
                        type="text"
                        placeholder="Last Name"
                        className="
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                        "
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email*
                      </label>

                      <input
                        type="email"
                        placeholder="Email"
                        className="
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                        "
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number*
                      </label>

                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message*
                    </label>

                    <textarea
                      rows="6"
                      placeholder="Tell us about yourself..."
                      className="
                        w-full
                        border
                        border-[#ddd]
                        p-4
                        resize-none
                        outline-none
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      How much work experience do
                      you have?
                    </label>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="experience"
                        />
                        <span>
                          0 - 2 Years
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="experience"
                        />
                        <span>
                          3 - 5 Years
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="experience"
                        />
                        <span>
                          5+ Years
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Resume*
                    </label>

                    <input
                      type="file"
                      className="w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="
                      bg-[#c91f26]
                      hover:bg-[#a91a20]
                      text-white
                      px-10
                      py-3
                      font-medium
                      transition-all
                    "
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default CareerDetails;