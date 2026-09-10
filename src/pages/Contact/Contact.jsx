import axios from "axios";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

/* =========================================================
   MAP HELPERS
========================================================= */

const extractIframeSrc = (
  value,
) => {
  if (
    !value ||
    typeof value !==
      "string"
  ) {
    return "";
  }

  const trimmedValue =
    value.trim();

  if (
    !trimmedValue
  ) {
    return "";
  }

  const iframeSrcMatch =
    trimmedValue.match(
      /<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i,
    );

  if (
    iframeSrcMatch?.[1]
  ) {
    return iframeSrcMatch[
      1
    ].trim();
  }

  if (
    trimmedValue.startsWith(
      "https://",
    ) ||
    trimmedValue.startsWith(
      "http://",
    )
  ) {
    return trimmedValue;
  }

  return "";
};

const buildShowroomDestination =
  (showroom) =>
    [
      showroom?.name,
      showroom?.address,
      showroom?.city,
      showroom?.state,
      showroom?.zip_code,
      showroom?.country,
    ]
      .filter(Boolean)
      .join(", ");

const getDirectionsUrl = (
  showroom,
) => {
  const destination =
    buildShowroomDestination(
      showroom,
    );

  if (
    !destination
  ) {
    return "";
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination,
  )}`;
};

/* =========================================================
   DATE HELPERS
========================================================= */

const getLocalDateString =
  () => {
    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() +
          1,
      ).padStart(
        2,
        "0",
      );

    const day =
      String(
        now.getDate(),
      ).padStart(
        2,
        "0",
      );

    return `${year}-${month}-${day}`;
  };

const formatDate = (
  value,
) => {
  if (
    !value
  ) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] =
    value.split(
      "-",
    );

  return `${month}/${day}/${year}`;
};

const formatTime = (
  value,
) => {
  if (
    !value
  ) {
    return "";
  }

  const [
    hours,
    minutes,
  ] =
    value.split(
      ":",
    );

  const date =
    new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0,
  );

  return date.toLocaleTimeString(
    "en-US",
    {
      hour:
        "numeric",

      minute:
        "2-digit",
    },
  );
};

/* =========================================================
   CONTACT
========================================================= */

export default function Contact() {
  const navigate =
    useNavigate();

  /* =========================================================
     SHOWROOMS
  ========================================================= */

  const [
    showrooms,
    setShowrooms,
  ] = useState(
    [],
  );

  const [
    showroomsLoading,
    setShowroomsLoading,
  ] = useState(
    true,
  );

  /* =========================================================
     FORM MODE
  ========================================================= */

  const [
    requestType,
    setRequestType,
  ] = useState(
    "ENQUIRY",
  );

  const isAppointment =
    requestType ===
    "APPOINTMENT";

  /* =========================================================
     FORM DATA
  ========================================================= */

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    subject: "",
    email: "",
    phone: "",
    message: "",
    preferredDate:
      "",
    preferredTime:
      "",
  });

  const [
    loading,
    setLoading,
  ] = useState(
    false,
  );

  const today =
    useMemo(
      () =>
        getLocalDateString(),
      [],
    );

  /* =========================================================
     FETCH SHOWROOMS
  ========================================================= */

  useEffect(() => {
    let isMounted =
      true;

    const fetchShowrooms =
      async () => {
        try {
          setShowroomsLoading(
            true,
          );

          const response =
            await axios.get(
              `${
                import.meta.env
                  .VITE_API_URL
              }/company`,
            );

          if (
            !isMounted
          ) {
            return;
          }

          if (
            response.data
              ?.success &&
            Array.isArray(
              response.data
                ?.data,
            )
          ) {
            const activeShowrooms =
              response.data.data
                .filter(
                  (item) =>
                    item.is_active,
                )
                .sort(
                  (
                    a,
                    b,
                  ) =>
                    (a.display_order ||
                      0) -
                    (b.display_order ||
                      0),
                );

            setShowrooms(
              activeShowrooms,
            );
          } else {
            setShowrooms(
              [],
            );
          }
        } catch (
          error
        ) {
          if (
            !isMounted
          ) {
            return;
          }

          console.error(
            "Failed to fetch showrooms:",
            error,
          );

          setShowrooms(
            [],
          );
        } finally {
          if (
            isMounted
          ) {
            setShowroomsLoading(
              false,
            );
          }
        }
      };

    fetchShowrooms();

    return () => {
      isMounted =
        false;
    };
  }, []);

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } =
      event.target;

    setFormData(
      (
        previousData,
      ) => ({
        ...previousData,

        [name]:
          value,
      }),
    );
  };

  /* =========================================================
     SCROLL TO FORM
  ========================================================= */

  const scrollToForm =
    () => {
      const formElement =
        document.getElementById(
          "contact-form",
        );

      if (
        !formElement
      ) {
        return;
      }

      formElement.scrollIntoView({
        behavior:
          "smooth",

        block:
          "start",
      });
    };

  /* =========================================================
     MODE SWITCHING
  ========================================================= */

  const activateAppointment =
    () => {
      setRequestType(
        "APPOINTMENT",
      );

      setFormData(
        (
          previousData,
        ) => ({
          ...previousData,

          subject:
            previousData.subject.trim()
              ? previousData.subject
              : "Showroom Appointment Request",
        }),
      );

      requestAnimationFrame(
        scrollToForm,
      );
    };

  const activateEnquiry =
    () => {
      setRequestType(
        "ENQUIRY",
      );

      setFormData(
        (
          previousData,
        ) => ({
          ...previousData,

          preferredDate:
            "",

          preferredTime:
            "",
        }),
      );

      requestAnimationFrame(
        scrollToForm,
      );
    };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        loading
      ) {
        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const cleanedPhone =
        formData.phone.replace(
          /\D/g,
          "",
        );

      /* ============================
         STANDARD VALIDATION
      ============================ */

      if (
        !formData.name.trim()
      ) {
        alert(
          "Name is required",
        );

        return;
      }

      if (
        !formData.subject.trim()
      ) {
        alert(
          "Subject is required",
        );

        return;
      }

      if (
        !formData.email.trim()
      ) {
        alert(
          "Email is required",
        );

        return;
      }

      if (
        !emailRegex.test(
          formData.email.trim(),
        )
      ) {
        alert(
          "Please enter a valid email address",
        );

        return;
      }

      if (
        !formData.phone.trim()
      ) {
        alert(
          "Phone number is required",
        );

        return;
      }

      if (
        cleanedPhone.length <
          10 ||
        cleanedPhone.length >
          15
      ) {
        alert(
          "Please enter a valid phone number",
        );

        return;
      }

      /* ============================
         APPOINTMENT VALIDATION
      ============================ */

      if (
        isAppointment
      ) {
        if (
          !formData.preferredDate
        ) {
          alert(
            "Please select your preferred appointment date",
          );

          return;
        }

        if (
          formData.preferredDate <
          today
        ) {
          alert(
            "Please select today or a future date",
          );

          return;
        }

        if (
          !formData.preferredTime
        ) {
          alert(
            "Please select your preferred appointment time",
          );

          return;
        }
      }

      try {
        setLoading(
          true,
        );

        const API_URL =
          import.meta.env
            .VITE_API_URL;

        /* ============================
           BUILD MESSAGE
        ============================ */

        let finalMessage =
          formData.message.trim();

        if (
          isAppointment
        ) {
          const appointmentDetails =
            [
              "APPOINTMENT REQUEST",
              "",
              `Preferred Date: ${formatDate(
                formData.preferredDate,
              )}`,
              `Preferred Time: ${formatTime(
                formData.preferredTime,
              )}`,
            ].join(
              "\n",
            );

          finalMessage =
            formData.message.trim()
              ? `${appointmentDetails}\n\nMessage:\n${formData.message.trim()}`
              : appointmentDetails;
        }

        /* ============================
           PAYLOAD
        ============================ */

        const payload = {
          name:
            formData.name.trim(),

          subject:
            isAppointment
              ? `[Appointment Request] ${formData.subject.trim()}`
              : formData.subject.trim(),

          email:
            formData.email
              .trim()
              .toLowerCase(),

          phone:
            formData.phone.trim(),

          message:
            finalMessage,
        };

        console.log(
          "📩 CONTACT REQUEST TYPE:",
          requestType,
        );

        console.log(
          "📩 CONTACT REQUEST PAYLOAD:",
          payload,
        );

        console.log(
          "📡 CONTACT REQUEST URL:",
          `${API_URL}/contact-request`,
        );

        /* ============================
           API REQUEST
        ============================ */

        const response =
          await axios.post(
            `${API_URL}/contact-request`,
            payload,
            {
              headers: {
                "Content-Type":
                  "application/json",
              },
            },
          );

        console.log(
          "✅ CONTACT REQUEST RESPONSE:",
          response.data,
        );

        console.log(
          "✅ CONTACT REQUEST STATUS:",
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
              "Unable to submit enquiry.",
          );
        }

        /* ============================
           SUCCESS
        ============================ */

        setFormData({
          name: "",
          subject:
            "",
          email: "",
          phone: "",
          message:
            "",
          preferredDate:
            "",
          preferredTime:
            "",
        });

        setRequestType(
          "ENQUIRY",
        );

        navigate(
          "/thankyou",
          {
            replace:
              true,
          },
        );
      } catch (
        error
      ) {
        console.error(
          "❌ CONTACT REQUEST FAILED:",
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
            "Something went wrong while submitting the enquiry.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <>
      <main className="min-h-screen pt-[110px]">
        {/* =====================================================
            HEADING
        ===================================================== */}

        <section>
          <div className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <h1
              className="text-[34px] font-semibold leading-none text-[#161412] md:text-[42px]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Contact Us
            </h1>

            <div className="mb-4 mt-4 h-[4px] w-[70px] bg-[#c91f26]" />

            <p
              className="text-[13px] text-[#777]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              <Link
                to="/"
                className="transition-colors duration-300 hover:text-[#161412]"
              >
                Home
              </Link>

              {" / "}

              <span className="text-[#161412]">
                <strong>
                  Contact Us
                </strong>
              </span>
            </p>
          </div>
        </section>

        {/* =====================================================
            CONTACT SECTION
        ===================================================== */}

        <section className="mx-auto max-w-[1650px] px-6 pb-24 pt-16 xl:px-10">
          <div className="grid gap-16 lg:grid-cols-[520px_1fr] xl:gap-[120px]">
            {/* =================================================
                LEFT
            ================================================= */}

            <div>
              <h2 className="mb-8 text-[28px] font-light text-[#161412]">
                Get in touch
              </h2>

              <p className="mb-10 text-[13px] leading-[24px] text-[#666]">
                Thank you for your interest in our
                services. If you have any questions or
                would like to discuss a project, please
                do not hesitate to contact us. Our team
                is dedicated to providing you with the
                highest level of service and support.
              </p>

              <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
                {/* =================================================
                    VISIT US
                ================================================= */}

                <div>
                  <h3 className="mb-4 text-[13px] font-semibold text-[#c91f26]">
                    Visit Us
                  </h3>

                  <div className="space-y-8">
                    {showroomsLoading ? (
                      <p className="text-[12px] text-[#666]">
                        Loading showrooms...
                      </p>
                    ) : showrooms.length ===
                      0 ? (
                      <p className="text-[12px] text-[#666]">
                        No showrooms available.
                      </p>
                    ) : (
                      showrooms.map(
                        (
                          showroom,
                        ) => (
                          <div
                            key={
                              showroom.id
                            }
                          >
                            <Link
                              to={`/locations/${showroom.slug}`}
                              className="text-[13px] font-medium text-[#222] transition-colors hover:text-[#c91f26]"
                            >
                              {
                                showroom.name
                              }
                            </Link>

                            <p className="mt-1 text-[12px] leading-5 text-[#666]">
                              {showroom.address ||
                                "-"}

                              <br />

                              {[
                                showroom.city,
                                showroom.state,
                              ]
                                .filter(
                                  Boolean,
                                )
                                .join(
                                  ", ",
                                )}

                              {showroom.zip_code
                                ? ` ${showroom.zip_code}`
                                : ""}
                            </p>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>

                {/* =================================================
                    OFFICE HOURS
                ================================================= */}

                <div>
                  <h3 className="mb-4 text-[13px] font-semibold text-[#c91f26]">
                    Office Hours
                  </h3>

                  {showroomsLoading ? (
                    <p className="text-[12px] text-[#666]">
                      Loading office hours...
                    </p>
                  ) : showrooms.length >
                    0 ? (
                    <div className="text-[12px] leading-5 text-[#666]">
                      <p>
                        Monday -
                        Friday
                      </p>

                      <p className="mb-3">
                        {showrooms[0]
                          .business_hours_mon_fri ||
                          "-"}
                      </p>

                      <p>
                        Saturday
                      </p>

                      <p className="mb-3">
                        {showrooms[0]
                          .business_hours_saturday ||
                          "-"}
                      </p>

                      <p>
                        Sunday
                      </p>

                      <p>
                        {showrooms[0]
                          .business_hours_sunday ||
                          "-"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[12px] text-[#666]">
                      Office hours unavailable.
                    </p>
                  )}
                </div>
              </div>

              {/* =================================================
                  CONTACT CTA
              ================================================= */}

              <div className="mt-12 border border-[#e5e1dc] bg-[#f8f6f3] p-6 md:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c91f26]">
                  Need Assistance?
                </p>

                <h3 className="mt-2 text-[22px] font-light leading-[1.35] text-[#161412]">
                  Plan your visit or speak with our team.
                </h3>

                <p className="mt-3 max-w-[430px] text-[12px] leading-[21px] text-[#666]">
                  Schedule a showroom appointment to
                  explore materials in person, or send
                  us an enquiry and our team will be
                  happy to assist you.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={
                      activateAppointment
                    }
                    disabled={
                      loading
                    }
                    className="inline-flex min-h-[40px] items-center justify-center bg-[#c91f26] px-5 text-[10px] font-medium uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#ab171e] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Request
                    Appointment
                  </button>

                  <button
                    type="button"
                    onClick={
                      activateEnquiry
                    }
                    disabled={
                      loading
                    }
                    className="inline-flex min-h-[40px] items-center justify-center border border-[#161412] bg-transparent px-5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#161412] transition-all duration-300 hover:bg-[#161412] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Send an
                    Enquiry
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <div
              id="contact-form"
              className="scroll-mt-[135px]"
            >
              {/* =================================================
                  MODE HEADER
              ================================================= */}

              <div className="mb-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c91f26]">
                  {isAppointment
                    ? "Appointment Request"
                    : "General Enquiry"}
                </p>

                <h2 className="mt-2 text-[27px] font-light text-[#161412]">
                  {isAppointment
                    ? "Plan your showroom visit"
                    : "How can we help?"}
                </h2>

                {isAppointment && (
                  <p className="mt-3 max-w-[620px] text-[12px] leading-5 text-[#666]">
                    Choose your preferred date and
                    time. Our team will contact you
                    to confirm the appointment.
                  </p>
                )}
              </div>



              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={
                  handleSubmit
                }
              >
                <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-[12px] text-[#222]"
                    >
                      Your Name*
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="name"
                      disabled={
                        loading
                      }
                      className="h-[42px] w-full border border-[#e1ddd8] bg-[#ece9e5] px-4 text-[13px] outline-none transition-all focus:border-[#c91f26] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* SUBJECT */}

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="mb-2 block text-[12px] text-[#222]"
                    >
                      Subject*
                    </label>

                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={
                        formData.subject
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        loading
                      }
                      className="h-[42px] w-full border border-[#e1ddd8] bg-[#ece9e5] px-4 text-[13px] outline-none transition-all focus:border-[#c91f26] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-[12px] text-[#222]"
                    >
                      Your E-mail*
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="email"
                      disabled={
                        loading
                      }
                      className="h-[42px] w-full border border-[#e1ddd8] bg-[#ece9e5] px-4 text-[13px] outline-none transition-all focus:border-[#c91f26] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="mb-2 block text-[12px] text-[#222]"
                    >
                      Your Phone*
                    </label>

                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="tel"
                      inputMode="tel"
                      disabled={
                        loading
                      }
                      className="h-[42px] w-full border border-[#e1ddd8] bg-[#ece9e5] px-4 text-[13px] outline-none transition-all focus:border-[#c91f26] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* ===========================================
                      APPOINTMENT FIELDS
                  =========================================== */}

                  {isAppointment && (
                    <>
                      {/* DATE */}

                      <div>
                        <label
                          htmlFor="preferred-date"
                          className="mb-2 block text-[12px] text-[#222]"
                        >
                          Preferred Date*
                        </label>

                        <input
                          id="preferred-date"
                          type="date"
                          name="preferredDate"
                          min={
                            today
                          }
                          value={
                            formData.preferredDate
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            loading
                          }
                          className="h-[42px] w-full border border-[#cfc9c2] bg-[#f7f5f2] px-4 text-[13px] text-[#222] outline-none transition-all focus:border-[#c91f26] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </div>

                      {/* TIME */}

                      <div>
                        <label
                          htmlFor="preferred-time"
                          className="mb-2 block text-[12px] text-[#222]"
                        >
                          Preferred Time*
                        </label>

                        <input
                          id="preferred-time"
                          type="time"
                          name="preferredTime"
                          value={
                            formData.preferredTime
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            loading
                          }
                          className="h-[42px] w-full border border-[#cfc9c2] bg-[#f7f5f2] px-4 text-[13px] text-[#222] outline-none transition-all focus:border-[#c91f26] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <div className="mt-6">
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-[12px] text-[#222]"
                  >
                    {isAppointment
                      ? "Additional Notes (Optional)"
                      : "Message (Optional)"}
                  </label>

                  <textarea
                    id="contact-message"
                    rows={
                      isAppointment
                        ? 5
                        : 7
                    }
                    name="message"
                    value={
                      formData.message
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      loading
                    }
                    placeholder={
                      isAppointment
                        ? "Tell us what materials or products you would like to discuss during your visit."
                        : ""
                    }
                    className="w-full resize-none border border-[#e1ddd8] bg-[#ece9e5] p-4 text-[13px] leading-6 outline-none transition-all placeholder:text-[#aaa] focus:border-[#c91f26] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* =================================================
                    APPOINTMENT NOTICE
                ================================================= */}

                {isAppointment && (
                  <div className="mt-5 border-l-[3px] border-[#c91f26] bg-[#faf8f6] px-4 py-3">
                    <p className="text-[11px] leading-5 text-[#666]">
                      The selected date and time are
                      preferred options only. An Ultra
                      Stones representative will contact
                      you to confirm availability.
                    </p>
                  </div>
                )}

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={
                      loading
                    }
                    className="inline-flex min-h-[38px] items-center justify-center bg-[#0c5562] px-6 text-[11px] uppercase tracking-wider text-white transition-all hover:bg-[#08414b] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? isAppointment
                        ? "Requesting..."
                        : "Sending..."
                      : isAppointment
                        ? "Request Appointment"
                        : "Submit Enquiry"}
                  </button>

                  {!isAppointment && (
                    <button
                      type="button"
                      onClick={
                        activateAppointment
                      }
                      disabled={
                        loading
                      }
                      className="inline-flex min-h-[38px] items-center justify-center border border-[#c91f26] px-6 text-[11px] uppercase tracking-wider text-[#c91f26] transition-all hover:bg-[#c91f26] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Request Appointment
                    </button>
                  )}

                  {isAppointment && (
                    <button
                      type="button"
                      onClick={
                        activateEnquiry
                      }
                      disabled={
                        loading
                      }
                      className="inline-flex min-h-[38px] items-center justify-center border border-[#aaa] px-5 text-[11px] uppercase tracking-wider text-[#555] transition-all hover:border-[#161412] hover:text-[#161412] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Back to Enquiry
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* =====================================================
              SHOWROOMS
          ===================================================== */}

          <section className="mt-28">
            <h2 className="mb-10 text-[30px] font-light text-[#161412]">
              Our Showrooms
            </h2>

            {showroomsLoading ? (
              <div className="py-16 text-center text-[13px] text-[#666]">
                Loading showrooms...
              </div>
            ) : showrooms.length ===
              0 ? (
              <div className="py-16 text-center text-[13px] text-[#666]">
                No showrooms are currently available.
              </div>
            ) : (
              <div className="grid gap-14 lg:grid-cols-2">
                {showrooms.map(
                  (
                    showroom,
                  ) => {
                    const mapEmbedUrl =
                      extractIframeSrc(
                        showroom.google_maps_url,
                      );

                    const directionsUrl =
                      getDirectionsUrl(
                        showroom,
                      );

                    return (
                      <article
                        key={
                          showroom.id
                        }
                      >
                        {/* MAP */}

                        <div className="border border-[#ddd]">
                          {mapEmbedUrl ? (
                            <iframe
                              title={`${showroom.name} location`}
                              src={
                                mapEmbedUrl
                              }
                              className="h-[300px] w-full border-0"
                              loading="lazy"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          ) : (
                            <div className="flex h-[300px] w-full items-center justify-center text-[13px] text-[#777]">
                              Map is
                              currently
                              unavailable.
                            </div>
                          )}
                        </div>

                        {/* NAME */}

                        <Link
                          to={`/locations/${showroom.slug}`}
                          className="mt-5 inline-block text-[26px] font-light text-[#c91f26] transition-colors hover:text-[#161412] md:text-[32px]"
                        >
                          {
                            showroom.name
                          }
                        </Link>

                        {/* ADDRESS */}

                        <p className="mt-2 text-[13px] leading-6 text-[#555]">
                          {showroom.address ||
                            "-"}

                          <br />

                          {[
                            showroom.city,
                            showroom.state,
                          ]
                            .filter(
                              Boolean,
                            )
                            .join(
                              ", ",
                            )}

                          {showroom.zip_code
                            ? ` ${showroom.zip_code}`
                            : ""}

                          {showroom.country && (
                            <>
                              <br />

                              {
                                showroom.country
                              }
                            </>
                          )}
                        </p>

                        {/* HOURS */}

                        <p className="mt-3 text-[12px] leading-5 text-[#555]">
                          Monday -
                          Friday:{" "}
                          {showroom.business_hours_mon_fri ||
                            "-"}

                          <br />

                          Saturday:{" "}
                          {showroom.business_hours_saturday ||
                            "-"}

                          <br />

                          Sunday:{" "}
                          {showroom.business_hours_sunday ||
                            "-"}
                        </p>

                        {/* ACTIONS */}

                        <div className="mt-4 flex flex-wrap gap-3">
                          {directionsUrl && (
                            <a
                              href={
                                directionsUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[38px] items-center justify-center border border-[#c91f26] px-5 py-2 text-[11px] uppercase tracking-wider text-[#161412] transition-all hover:bg-[#c91f26] hover:text-white"
                            >
                              Get
                              Directions
                            </a>
                          )}

                          <Link
                            to={`/locations/${showroom.slug}`}
                            className="inline-flex min-h-[38px] items-center justify-center border border-[#161412] px-5 py-2 text-[11px] uppercase tracking-wider text-[#161412] transition-all hover:bg-[#161412] hover:text-white"
                          >
                            View
                            Location
                          </Link>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}