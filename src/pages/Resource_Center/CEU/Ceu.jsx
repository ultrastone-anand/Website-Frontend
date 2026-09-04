import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import {
  createPortal,
} from "react-dom";

import {
  X,
} from "lucide-react";

import Loading from "../../../components/common/Loading";

/* =========================================================
   EYEBROW
========================================================= */

const Eyebrow = ({
  children,
  light = false,
  centered = false,
}) => {
  return (
    <div
      className={`
        flex
        items-center
        gap-3

        ${centered
          ? "justify-center"
          : ""
        }

        text-[11px]
        sm:text-[12px]
        lg:text-[13px]

        font-semibold
        uppercase
        tracking-[0.08em]

        ${light
          ? "text-white/90"
          : "text-[#262320]"
        }
      `}
      style={{
        fontFamily:
          "Montserrat, sans-serif",
      }}
    >
      <span>
        {children}
      </span>

      <span
        className="
          text-[#c91f26]
          text-[16px]
          leading-none
        "
      >
        →
      </span>
    </div>
  );
};

/* =========================================================
   OUTLINE BUTTON
========================================================= */

const OutlineButton = ({
  children,
  onClick,
  light = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-between

        gap-7

        min-w-[160px]
        h-[42px]

        px-5
        sm:px-6

        border

        text-[9px]
        sm:text-[10px]
        lg:text-[11px]

        font-semibold
        uppercase
        tracking-[0.05em]

        transition-all
        duration-300

        ${light
          ? `
              border-white/35
              text-white

              hover:bg-white
              hover:text-[#161412]
            `
          : `
              border-[#aaa6a1]
              text-[#161412]

              hover:bg-[#161412]
              hover:border-[#161412]
              hover:text-white
            `
        }
      `}
      style={{
        fontFamily:
          "Montserrat, sans-serif",
      }}
    >
      <span>
        {children}
      </span>

      <span className="text-[#c91f26]">
        →
      </span>
    </button>
  );
};

/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
  label,
  required = false,
  children,
}) => {
  return (
    <div>
      <label
        className="
          block

          mb-2

          text-[9px]
          sm:text-[10px]

          font-semibold
          uppercase
          tracking-[0.08em]

          text-[#4f4a46]
        "
        style={{
          fontFamily:
            "Montserrat, sans-serif",
        }}
      >
        {label}

        {required && (
          <span className="text-[#c91f26]">
            {" "}
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
};

/* =========================================================
   REQUEST COURSE MODAL
========================================================= */

const RequestCourseModal = ({
  course,
  onClose,
}) => {
  const [
    form,
    setForm,
  ] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    preferredDate: "",
    message: "",
  });

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /* =======================================================
     LOCK BODY
  ======================================================= */

  useEffect(() => {
    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, []);

  /* =======================================================
     ESC TO CLOSE
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [onClose]);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        value,
    }));
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

const handleSubmit =
  async (
    event,
  ) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.company.trim()
    ) {
      alert(
        "Please fill all required fields.",
      );

      return;
    }

    try {
      setSubmitting(
        true,
      );

      const API_URL =
        import.meta.env
          .VITE_API_URL;

      const payload = {
        course:
          String(
            course?.title ||
              "",
          ).trim(),

        name:
          form.name.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        phone:
          form.phone.trim(),

        company:
          form.company.trim(),

        role:
          form.role.trim(),

        preferredDate:
          form.preferredDate ||
          "",

        message:
          form.message.trim(),
      };

      console.log(
        "📚 CEU REQUEST PAYLOAD:",
        payload,
      );

      console.log(
        "📡 CEU REQUEST URL:",
        `${API_URL}/ceu-request`,
      );

      const response =
        await axios.post(
          `${API_URL}/ceu-request`,
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );

      console.log(
        "✅ CEU REQUEST RESPONSE:",
        response.data,
      );

      console.log(
        "✅ CEU REQUEST STATUS:",
        response.status,
      );

      if (
        response.data
          ?.success ===
        false
      ) {
        throw new Error(
          response.data
            ?.message ||
            "Failed to submit CEU request.",
        );
      }

      alert(
        response.data
          ?.message ||
          "CEU course request submitted successfully.",
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        preferredDate: "",
        message: "",
      });

      onClose();
    } catch (error) {
      console.error(
        "❌ CEU REQUEST FAILED:",
        error,
      );

      console.error(
        "STATUS:",
        error.response
          ?.status,
      );

      console.error(
        "BACKEND RESPONSE:",
        error.response
          ?.data,
      );

      console.error(
        "REQUEST URL:",
        error.config
          ?.url,
      );

      alert(
        error.response
          ?.data
          ?.message ||
          error.message ||
          "Unable to submit CEU request. Please try again.",
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  };
  /* =======================================================
     PORTAL
  ======================================================= */

  return createPortal(
    <div
      className="
        fixed
        inset-0

        z-[99999]

        flex
        items-center
        justify-center

        p-4
        sm:p-6
      "
    >
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close CEU request form"
        onClick={onClose}
        className="
          absolute
          inset-0

          w-full
          h-full

          bg-black/65

          backdrop-blur-[2px]
        "
      />

      {/* MODAL */}

      <div
        className="
          relative
          z-10

          w-full
          max-w-[760px]

          max-h-[90vh]

          overflow-y-auto

          bg-white

          shadow-[0_30px_90px_rgba(0,0,0,0.28)]
        "
      >
        {/* RED TOP LINE */}

        <div
          className="
            h-[4px]
            w-full

            bg-[#c91f26]
          "
        />

        <div
          className="
            px-5
            sm:px-8
            md:px-10

            py-7
            sm:py-9
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              items-start
              justify-between

              gap-6
            "
          >
            <div>
              <Eyebrow>
                CEU Course Request
              </Eyebrow>

              <h2
                className="
                  mt-5

                  text-[32px]
                  sm:text-[38px]
                  md:text-[42px]

                  leading-[1.06]

                  tracking-[-0.03em]

                  text-[#161412]
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Request This
                Course
              </h2>

              <p
                className="
                  mt-4

                  max-w-[540px]

                  text-[12px]
                  sm:text-[13px]

                  leading-[1.75]

                  text-[#77716c]
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                Complete the form
                below and our team
                will contact you to
                coordinate your CEU
                session.
              </p>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              className="
                shrink-0

                w-[38px]
                h-[38px]

                flex
                items-center
                justify-center

                border
                border-[#d8d4cf]

                text-[#161412]

                hover:bg-[#161412]
                hover:text-white
                hover:border-[#161412]

                transition-all
                duration-300
              "
            >
              <X
                size={17}
              />
            </button>
          </div>

          {/* SELECTED COURSE */}

          <div
            className="
              mt-7

              bg-[#efedea]

              px-5
              py-4

              border-l-[3px]
              border-[#c91f26]
            "
          >
            <span
              className="
                text-[9px]
                sm:text-[10px]

                font-semibold

                uppercase
                tracking-[0.1em]

                text-[#77716c]
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Selected Course
            </span>

            <h3
              className="
                mt-2

                text-[17px]
                sm:text-[19px]

                text-[#161412]
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              {
                course.title
              }
            </h3>
          </div>

          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
            className="
              mt-7
            "
          >
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-x-5
                gap-y-5
              "
            >
              <FormField
                label="Full Name"
                required
              >
                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  className="ceu-input"
                />
              </FormField>

              <FormField
                label="Email"
                required
              >
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="ceu-input"
                />
              </FormField>

              <FormField
                label="Phone"
                required
              >
                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  autoComplete="tel"
                  className="ceu-input"
                />
              </FormField>

              <FormField
                label="Company / Firm"
                required
              >
                <input
                  required
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company or firm"
                  autoComplete="organization"
                  className="ceu-input"
                />
              </FormField>

              <FormField label="Professional Role">
                <select
                  name="role"
                  value={
                    form.role
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    ceu-input
                    bg-white
                  "
                >
                  <option value="">
                    Select role
                  </option>

                  <option value="Architect">
                    Architect
                  </option>

                  <option value="Interior Designer">
                    Interior Designer
                  </option>

                  <option value="Designer">
                    Designer
                  </option>

                  <option value="Specifier">
                    Specifier
                  </option>

                  <option value="Contractor">
                    Contractor
                  </option>

                  <option value="Developer">
                    Developer
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </FormField>

              <FormField label="Preferred Date">
                <input
                  type="date"
                  name="preferredDate"
                  value={
                    form.preferredDate
                  }
                  onChange={
                    handleChange
                  }
                  className="ceu-input"
                />
              </FormField>
            </div>

            <div className="mt-5">
              <FormField label="Additional Notes">
                <textarea
                  name="message"
                  value={
                    form.message
                  }
                  onChange={
                    handleChange
                  }
                  rows={4}
                  placeholder="Any questions or scheduling preferences..."
                  className="
                    ceu-input

                    h-auto
                    min-h-[110px]

                    py-3

                    resize-none
                  "
                />
              </FormField>
            </div>

            {/* FOOTER */}

            <div
              className="
                mt-8

                pt-6

                border-t
                border-[#e2ded9]

                flex
                flex-col-reverse
                sm:flex-row

                sm:items-center
                sm:justify-between

                gap-5
              "
            >
              <p
                className="
                  max-w-[380px]

                  text-[10px]
                  sm:text-[11px]

                  leading-[1.65]

                  text-[#8b8681]
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                Our team will follow
                up regarding course
                availability and
                scheduling.
              </p>

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="
                  inline-flex
                  items-center
                  justify-between

                  gap-7

                  min-w-[175px]
                  h-[44px]

                  px-6

                  bg-[#161412]

                  border
                  border-[#161412]

                  text-white

                  text-[10px]
                  sm:text-[11px]

                  font-semibold
                  uppercase
                  tracking-[0.05em]

                  hover:bg-[#c91f26]
                  hover:border-[#c91f26]

                  transition-all
                  duration-300

                  disabled:opacity-50
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                <span>
                  {submitting
                    ? "Submitting..."
                    : "Submit Request"}
                </span>

                {!submitting && (
                  <span>
                    →
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,

    document.body,
  );
};

/* =========================================================
   CEU
========================================================= */

const Ceu = () => {
  const [
    page,
    setPage,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedCourse,
    setSelectedCourse,
  ] = useState(null);

  /* =======================================================
     FETCH PAGE
  ======================================================= */

  useEffect(() => {
    const fetchPage =
      async () => {
        try {
          const response =
            await axios.get(
              `${import.meta.env
                .VITE_API_URL
              }/pages/ceu`,
            );

          const result =
            response.data;

          if (
            result.success
          ) {
            setPage(
              result.data,
            );
          }
        } catch (error) {
          console.error(
            "Error fetching CEU page:",
            error,
          );
        } finally {
          setLoading(
            false,
          );
        }
      };

    fetchPage();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <Loading />
    );
  }

  /* =======================================================
     PAGE NOT FOUND
  ======================================================= */

  if (!page) {
    return (
      <div
        className="
          min-h-screen

          pt-[90px]
          sm:pt-[110px]

          flex
          items-center
          justify-center

          px-6

          text-center
        "
      >
        Page not found
      </div>
    );
  }

  /* =======================================================
     CONTENT
  ======================================================= */

  const content =
    page.content || {};

  const hero =
    content.hero || {};

  const courses =
    Array.isArray(
      content.courses,
    )
      ? content.courses
      : [];

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <div
        className="
          min-h-screen

          pt-[90px]
          sm:pt-[110px]

          bg-white
        "
      >
        {/* =================================================
            HERO
        ================================================= */}

        <section>
          <div
            className="
              relative

              h-[500px]
              sm:h-[570px]
              lg:h-[650px]

              overflow-hidden

              bg-[#161412]
            "
          >
            {/* HERO IMAGE */}

            {hero.image && (
              <img
                src={
                  hero.image
                }
                alt={
                  hero.imageAlt ||
                  hero.headingLine2 ||
                  hero.headingLine1 ||
                  ""
                }
                className="
                  absolute
                  inset-0

                  w-full
                  h-full

                  object-cover
                  object-center
                "
              />
            )}

            {/* OVERLAY */}

            <div
              className="
                absolute
                inset-0

                bg-black/50

                sm:bg-gradient-to-r
                sm:from-black/65
                sm:via-black/30
                sm:to-black/10
              "
            />

            {/* HERO CONTENT */}

            <div
              className="
                absolute
                inset-0

                flex
                items-center

                px-6
                sm:px-10
                md:px-14
                lg:px-16
              "
            >
              <div
                className="
                  max-w-[700px]

                  text-white
                "
              >
                {hero.eyebrow && (
                  <Eyebrow light>
                    {
                      hero.eyebrow
                    }
                  </Eyebrow>
                )}

                {(
                  hero.headingLine1 ||
                  hero.headingLine2
                ) && (
                    <h1
                      className="
                      mt-6
                      sm:mt-8

                      text-[40px]
                      sm:text-[50px]
                      md:text-[60px]
                      xl:text-[66px]

                      leading-[1.02]

                      tracking-[-0.035em]

                      font-normal
                    "
                      style={{
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      {
                        hero.headingLine1
                      }

                      {hero.headingLine2 && (
                        <>
                          <br />

                          {
                            hero.headingLine2
                          }
                        </>
                      )}
                    </h1>
                  )}

                {hero.description && (
                  <p
                    className="
                      mt-6
                      sm:mt-8

                      max-w-[520px]

                      text-[12px]
                      sm:text-[13px]

                      leading-[1.75]

                      text-white/80
                    "
                    style={{
                      fontFamily:
                        "Montserrat, sans-serif",
                    }}
                  >
                    {
                      hero.description
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SPACING
        ================================================= */}

        <section
          className="
            py-10
            sm:py-12
            lg:py-16
          "
        />

        {/* =================================================
            COURSES
        ================================================= */}

        {courses.length > 0 && (
          <section
            className="
              pb-16
              sm:pb-20
              lg:pb-28
            "
          >
            <div
              className="
                max-w-[1750px]
                mx-auto

                px-5
                sm:px-6
                xl:px-10
              "
            >
              <div
                className="
                  space-y-16
                  sm:space-y-20
                  lg:space-y-28
                "
              >
                {courses.map(
                  (
                    course,
                    index,
                  ) => {
                    const objectives =
                      Array.isArray(
                        course.objectives,
                      )
                        ? course.objectives
                        : [];

                    return (
                      <article
                        key={
                          course.id ||
                          `${course.title}-${index}`
                        }
                        className="
                          grid
                          grid-cols-1
                          lg:grid-cols-2

                          items-center

                          gap-9
                          lg:gap-16
                          xl:gap-24
                        "
                      >
                        {/* =================================
                            IMAGE — ALWAYS LEFT
                        ================================= */}

                        <div>
                          <div
                            className="
                              relative

                              overflow-hidden

                              bg-[#efedea]
                            "
                          >
                            {course.image ? (
                              <img
                                src={
                                  course.image
                                }
                                alt={
                                  course.imageAlt ||
                                  course.title ||
                                  ""
                                }
                                loading="lazy"
                                className="
                                  w-full

                                  h-[320px]
                                  sm:h-[420px]
                                  lg:h-[520px]

                                  object-cover

                                  transition-transform
                                  duration-700

                                  hover:scale-[1.03]
                                "
                              />
                            ) : (
                              <div
                                className="
                                  w-full

                                  h-[320px]
                                  sm:h-[420px]
                                  lg:h-[520px]

                                  bg-[#efedea]
                                "
                              />
                            )}

                            {/* NUMBER */}

                            <div
                              className="
                                absolute

                                left-0
                                bottom-0

                                min-w-[78px]
                                h-[65px]

                                sm:min-w-[90px]
                                sm:h-[76px]

                                flex
                                items-center
                                justify-center

                                bg-white
                              "
                            >
                              <span
                                className="
                                  text-[28px]
                                  sm:text-[34px]

                                  text-[#161412]
                                "
                                style={{
                                  fontFamily:
                                    "Georgia, 'Times New Roman', serif",
                                }}
                              >
                                {String(
                                  index +
                                  1,
                                ).padStart(
                                  2,
                                  "0",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* =================================
                            CONTENT — ALWAYS RIGHT
                        ================================= */}

                        <div>
                          {course.eyebrow && (
                            <Eyebrow>
                              {
                                course.eyebrow
                              }
                            </Eyebrow>
                          )}

                          {course.title && (
                            <h2
                              className="
                                mt-6
                                sm:mt-7

                                max-w-[620px]

                                text-[34px]
                                sm:text-[42px]
                                lg:text-[48px]

                                leading-[1.06]

                                tracking-[-0.03em]

                                text-[#161412]
                              "
                              style={{
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",
                              }}
                            >
                              {
                                course.title
                              }
                            </h2>
                          )}

                          {course.description && (
                            <p
                              className="
                                mt-6

                                max-w-[620px]

                                text-[12px]
                                sm:text-[14px]

                                leading-[1.8]

                                text-[#5e5955]
                              "
                              style={{
                                fontFamily:
                                  "Montserrat, sans-serif",
                              }}
                            >
                              {
                                course.description
                              }
                            </p>
                          )}

                          {/* ===============================
                              LEARNING OBJECTIVES
                          =============================== */}

                          {objectives.length >
                            0 && (
                              <div
                                className="
                                mt-8

                                pt-7

                                border-t
                                border-[#d8d4cf]
                              "
                              >
                                <h3
                                  className="
                                  text-[10px]
                                  sm:text-[11px]

                                  font-semibold

                                  uppercase
                                  tracking-[0.08em]

                                  text-[#262320]
                                "
                                  style={{
                                    fontFamily:
                                      "Montserrat, sans-serif",
                                  }}
                                >
                                  Learning
                                  Objectives
                                </h3>

                                <div
                                  className="
                                  mt-5

                                  space-y-3
                                "
                                >
                                  {objectives.map(
                                    (
                                      objective,
                                      objectiveIndex,
                                    ) => (
                                      <div
                                        key={
                                          `${objective}-${objectiveIndex}`
                                        }
                                        className="
                                        flex
                                        items-start

                                        gap-4
                                      "
                                      >
                                        <span
                                          className="
                                          mt-[2px]

                                          w-[20px]
                                          h-[20px]

                                          shrink-0

                                          flex
                                          items-center
                                          justify-center

                                          border
                                          border-[#c7c2bd]

                                          text-[9px]

                                          font-semibold

                                          text-[#c91f26]
                                        "
                                          style={{
                                            fontFamily:
                                              "Montserrat, sans-serif",
                                          }}
                                        >
                                          {String(
                                            objectiveIndex +
                                            1,
                                          ).padStart(
                                            2,
                                            "0",
                                          )}
                                        </span>

                                        <p
                                          className="
                                          text-[11px]
                                          sm:text-[13px]

                                          leading-[1.7]

                                          text-[#69645f]
                                        "
                                          style={{
                                            fontFamily:
                                              "Montserrat, sans-serif",
                                          }}
                                        >
                                          {
                                            objective
                                          }
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {/* ===============================
    BOTTOM DESCRIPTIONS
=============================== */}

{/* ===============================
    BOTTOM DESCRIPTIONS
=============================== */}

{Array.isArray(
  course.bottomDescriptions,
) &&
  course.bottomDescriptions.length >
    0 && (
    <div
      className="
        mt-7
        space-y-3
      "
    >
      {course.bottomDescriptions.map(
        (
          description,
          descriptionIndex,
        ) => (
          <p
            key={
              `${description}-${descriptionIndex}`
            }
            className="
              max-w-[620px]

              text-[12px]
              sm:text-[14px]

              leading-[1.8]

              text-[#5e5955]
            "
            style={{
              fontFamily:
                "Montserrat, sans-serif",
            }}
          >
            {description}
          </p>
        ),
      )}
    </div>
  )}

                          {/* ===============================
                              REQUEST BUTTON
                          =============================== */}

                          {course.buttonText && (
                            <div className="mt-8">
                              <OutlineButton
                                onClick={() =>
                                  setSelectedCourse(
                                    course,
                                  )
                                }
                              >
                                {
                                  course.buttonText
                                }
                              </OutlineButton>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </div>
          </section>
        )}

        <div
          className="
            h-12
            sm:h-16
          "
        />
      </div>

      {/* ===================================================
          REQUEST MODAL
      =================================================== */}

      {selectedCourse && (
        <RequestCourseModal
          course={
            selectedCourse
          }
          onClose={() =>
            setSelectedCourse(
              null,
            )
          }
        />
      )}

      {/* ===================================================
          FORM INPUT STYLE
      =================================================== */}

      <style>
        {`
          .ceu-input {
            width: 100%;
            height: 48px;

            padding-left: 14px;
            padding-right: 14px;

            border: 1px solid #d8d4cf;

            outline: none;

            border-radius: 0;

            font-family: Montserrat, sans-serif;
            font-size: 12px;

            color: #262320;

            transition:
              border-color 0.3s ease,
              box-shadow 0.3s ease;
          }

          .ceu-input::placeholder {
            color: #aaa6a1;
          }

          .ceu-input:focus {
            border-color: #161412;

            box-shadow:
              inset 0 -1px 0 #161412;
          }
        `}
      </style>
    </>
  );
};

export default Ceu;