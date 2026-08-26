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
  ArrowDownToLine,
  Handshake,
  Layers3,
  Minimize2,
  ShieldCheck,
} from "lucide-react";

import Loading from "../../../components/common/Loading";

/* =========================================================
   EYEBROW
========================================================= */

const Eyebrow = ({
  children,
  light = false,
}) => {
  return (
    <div
      className={`
        flex
        items-center
        gap-3

        text-[10px]
        sm:text-[11px]
        lg:text-[12px]

        font-semibold
        uppercase
        tracking-[0.06em]

        ${
          light
            ? "text-white/95"
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
          text-[#e67e22]

          text-[17px]
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

        gap-8

        min-w-[165px]
        h-[42px]

        px-5

        border

        text-[9px]
        sm:text-[10px]

        font-semibold
        uppercase
        tracking-[0.04em]

        transition-all
        duration-300

        ${
          light
            ? `
                border-white/45
                text-white

                hover:bg-white
                hover:border-white
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

      <span className="text-[#e67e22]">
        →
      </span>
    </button>
  );
};

/* =========================================================
   BENEFIT ITEM
========================================================= */

const BenefitItem = ({
  icon: Icon,
  line1,
  line2,
}) => {
  return (
    <div
      className="
        flex
        flex-col
        items-center

        text-center
      "
    >
      <div
        className="
          h-[48px]

          flex
          items-center
          justify-center
        "
      >
        <Icon
          size={33}
          strokeWidth={1.1}
          className="text-[#161412]"
        />
      </div>

      <p
        className="
          mt-3

          text-[8px]
          sm:text-[9px]

          leading-[1.45]

          uppercase

          text-[#393532]
        "
        style={{
          fontFamily:
            "Montserrat, sans-serif",
        }}
      >
        {line1}

        <br />

        {line2}
      </p>
    </div>
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
   REQUEST DISPLAY MODAL
========================================================= */

const RequestDisplayModal = ({
  displays,
  selectedDisplay,
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

    display:
      selectedDisplay?.name ||
      "",

    concernedPersonName: "",
    concernedPersonPhone: "",

    streetAddress: "",
    suiteNumber: "",
    city: "",
    county: "",
    state: "",
    zipCode: "",

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
    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
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
          "Escape" &&
        !submitting
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
  }, [
    onClose,
    submitting,
  ]);

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

    setForm(
      (
        previousForm,
      ) => ({
        ...previousForm,

        [name]:
          value,
      }),
    );
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

      /* ===================================================
         REQUIRED FIELD VALIDATION
      =================================================== */

      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.company.trim() ||
        !form.display.trim() ||
        !form.streetAddress.trim() ||
        !form.city.trim() ||
        !form.state.trim() ||
        !form.zipCode.trim()
      ) {
        alert(
          "Please fill all required fields.",
        );

        return;
      }

      /* ===================================================
         EMAIL VALIDATION
      =================================================== */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          form.email.trim(),
        )
      ) {
        alert(
          "Please enter a valid email address.",
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

        /* =================================================
           PAYLOAD
        ================================================= */

        const payload = {
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

          display:
            form.display.trim(),

          concerned_person_name:
            form.concernedPersonName.trim(),

          concerned_person_phone:
            form.concernedPersonPhone.trim(),

          street_address:
            form.streetAddress.trim(),

          suite_number:
            form.suiteNumber.trim(),

          city:
            form.city.trim(),

          county:
            form.county.trim(),

          state:
            form.state.trim(),

          zip_code:
            form.zipCode.trim(),

          message:
            form.message.trim(),
        };

        console.log(
          "DISPLAY REQUEST PAYLOAD:",
          payload,
        );

        /* =================================================
           API REQUEST
        ================================================= */

        const response =
          await axios.post(
            `${API_URL}/display-request`,
            payload,
            {
              headers: {
                "Content-Type":
                  "application/json",
              },
            },
          );

        console.log(
          "DISPLAY REQUEST RESPONSE:",
          response.data,
        );

        if (
          response.data
            ?.success ===
          false
        ) {
          throw new Error(
            response.data
              ?.message ||
              "Failed to submit display request.",
          );
        }

        alert(
          response.data
            ?.message ||
            "Display request submitted successfully.",
        );

        onClose();
      } catch (error) {
        console.error(
          "DISPLAY REQUEST FAILED:",
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
            "Unable to submit display request. Please try again.",
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
        aria-label="Close display request form"
        onClick={
          submitting
            ? undefined
            : onClose
        }
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
          max-w-[820px]

          max-h-[92vh]

          overflow-y-auto

          bg-white

          shadow-[0_30px_90px_rgba(0,0,0,0.28)]
        "
      >
        {/* TOP LINE */}

        <div
          className="
            h-[4px]
            w-full

            bg-[#e67e22]
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
                Merchandising
                Display Request
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
                Request a Display
              </h2>

              <p
                className="
                  mt-4

                  max-w-[590px]

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
                will contact you
                regarding display
                availability,
                specifications and
                next steps.
              </p>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                submitting
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

                disabled:opacity-50
                disabled:cursor-not-allowed
              "
              aria-label="Close"
            >
              <X
                size={17}
              />
            </button>
          </div>

          {/* SELECTED REQUEST */}

          {form.display && (
            <div
              className="
                mt-7

                bg-[#faf4eb]

                px-5
                py-4

                border-l-[3px]
                border-[#e67e22]
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
                Selected Request
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
                  form.display
                }
              </h3>
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-7"
          >
            {/* =============================================
                CUSTOMER INFORMATION
            ============================================= */}

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
                  disabled={
                    submitting
                  }
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Your name"
                  autoComplete="name"
                  className="display-request-input"
                />
              </FormField>

              <FormField
                label="Email"
                required
              >
                <input
                  required
                  disabled={
                    submitting
                  }
                  type="email"
                  name="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="display-request-input"
                />
              </FormField>

              <FormField
                label="Phone"
                required
              >
                <input
                  required
                  disabled={
                    submitting
                  }
                  type="tel"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Phone number"
                  autoComplete="tel"
                  className="display-request-input"
                />
              </FormField>

              <FormField
                label="Company / Firm"
                required
              >
                <input
                  required
                  disabled={
                    submitting
                  }
                  type="text"
                  name="company"
                  value={
                    form.company
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Company or firm"
                  autoComplete="organization"
                  className="display-request-input"
                />
              </FormField>
            </div>

            {/* =============================================
                REQUEST TYPE
            ============================================= */}

            <div className="mt-5">
              <FormField
                label="Display / Request Type"
                required
              >
                <select
                  required
                  disabled={
                    submitting
                  }
                  name="display"
                  value={
                    form.display
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    display-request-input
                    bg-white
                  "
                >
                  <option value="">
                    Select display or request type
                  </option>

                  {displays.map(
                    (
                      item,
                      index,
                    ) => (
                      <option
                        key={
                          item.id ||
                          `${item.name}-${index}`
                        }
                        value={
                          item.name ||
                          ""
                        }
                      >
                        {item.name ||
                          `Display ${
                            index +
                            1
                          }`}
                      </option>
                    ),
                  )}

                  <option value="Update Tower">
                    Update Tower
                  </option>

                  <option value="Update Sample">
                    Update Sample
                  </option>
                </select>
              </FormField>
            </div>

            {/* =============================================
                CONCERNED PERSON
            ============================================= */}

            <div
              className="
                mt-5

                grid
                grid-cols-1
                sm:grid-cols-2

                gap-x-5
                gap-y-5
              "
            >
              <FormField
                label="Concerned Person Name (Optional)"
              >
                <input
                  disabled={
                    submitting
                  }
                  type="text"
                  name="concernedPersonName"
                  value={
                    form.concernedPersonName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Contact person name"
                  className="display-request-input"
                />
              </FormField>

              <FormField
                label="Concerned Person Phone (Optional)"
              >
                <input
                  disabled={
                    submitting
                  }
                  type="tel"
                  name="concernedPersonPhone"
                  value={
                    form.concernedPersonPhone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Contact person phone"
                  className="display-request-input"
                />
              </FormField>
            </div>

            {/* =============================================
                ADDRESS SECTION HEADER
            ============================================= */}

            <div
              className="
                mt-8
                mb-5

                pt-6

                border-t
                border-[#e2ded9]
              "
            >
              <h3
                className="
                  text-[11px]
                  sm:text-[12px]

                  font-semibold
                  uppercase
                  tracking-[0.08em]

                  text-[#161412]
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                Address
              </h3>
            </div>

            {/* =============================================
                ADDRESS
            ============================================= */}

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
                label="Street Address"
                required
              >
                <input
                  required
                  disabled={
                    submitting
                  }
                  type="text"
                  name="streetAddress"
                  value={
                    form.streetAddress
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Street address"
                  autoComplete="address-line1"
                  className="display-request-input"
                />
              </FormField>

              <FormField
                label="Suite Number (Optional)"
              >
                <input
                  disabled={
                    submitting
                  }
                  type="text"
                  name="suiteNumber"
                  value={
                    form.suiteNumber
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Suite, unit, apt, etc."
                  autoComplete="address-line2"
                  className="display-request-input"
                />
              </FormField>

              <FormField
                label="City"
                required
              >
                <input
                  required
                  disabled={
                    submitting
                  }
                  type="text"
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="City"
                  autoComplete="address-level2"
                  className="display-request-input"
                />
              </FormField>

              <FormField
                label="County (Optional)"
              >
                <input
                  disabled={
                    submitting
                  }
                  type="text"
                  name="county"
                  value={
                    form.county
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="County"
                  className="display-request-input"
                />
              </FormField>

              <FormField
                label="State"
                required
              >
                <input
                  required
                  disabled={
                    submitting
                  }
                  type="text"
                  name="state"
                  value={
                    form.state
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="State"
                  autoComplete="address-level1"
                  className="display-request-input"
                />
              </FormField>

              <FormField
                label="ZIP Code"
                required
              >
                <input
                  required
                  disabled={
                    submitting
                  }
                  type="text"
                  name="zipCode"
                  value={
                    form.zipCode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="ZIP code"
                  autoComplete="postal-code"
                  className="display-request-input"
                />
              </FormField>
            </div>

            {/* =============================================
                ADDITIONAL NOTES
            ============================================= */}

            <div className="mt-7">
              <FormField label="Additional Notes">
                <textarea
                  disabled={
                    submitting
                  }
                  name="message"
                  value={
                    form.message
                  }
                  onChange={
                    handleChange
                  }
                  rows={4}
                  placeholder="Tell us about your display, tower or sample requirements..."
                  className="
                    display-request-input

                    h-auto
                    min-h-[110px]

                    py-3

                    resize-none
                  "
                />

                <p
                  className="
                    mt-2

                    text-[9px]
                    sm:text-[10px]

                    leading-[1.6]

                    text-[#8b8681]
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  If there is a
                  convenient time for
                  our team to contact
                  or visit you, please
                  mention it above.
                </p>
              </FormField>
            </div>

            {/* =============================================
                FOOTER
            ============================================= */}

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
                  max-w-[400px]

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
                up regarding
                availability,
                specifications and
                next steps.
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

                  hover:bg-[#e67e22]
                  hover:border-[#e67e22]

                  transition-all
                  duration-300

                  disabled:opacity-50
                  disabled:cursor-not-allowed
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
   MERCHANDISE
========================================================= */

const Merchandise = () => {
  const [
    page,
    setPage,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    requestModal,
    setRequestModal,
  ] = useState(null);

  /* =======================================================
     FETCH PAGE
  ======================================================= */

  useEffect(() => {
    const controller =
      new AbortController();

    const fetchPage =
      async () => {
        try {
          const response =
            await axios.get(
              `${
                import.meta.env
                  .VITE_API_URL
              }/pages/merchandising-displays`,
              {
                signal:
                  controller.signal,
              },
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
          if (
            error.name !==
              "CanceledError" &&
            error.code !==
              "ERR_CANCELED"
          ) {
            console.error(
              "Error fetching Merchandising Displays page:",
              error,
            );
          }
        } finally {
          setLoading(
            false,
          );
        }
      };

    fetchPage();

    return () => {
      controller.abort();
    };
  }, []);

  /* =======================================================
     DOWNLOAD PDF
  ======================================================= */

  const handlePdfDownload = (
    pdfUrl,
  ) => {
    if (
      !pdfUrl ||
      pdfUrl === "#"
    ) {
      return;
    }

    window.open(
      pdfUrl,
      "_blank",
      "noopener,noreferrer",
    );
  };

  /* =======================================================
     OPEN REQUEST MODAL
  ======================================================= */

  const openRequestModal = (
    display = null,
  ) => {
    setRequestModal({
      display,
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <Loading />;
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

  const displaySection =
    content.displaySection ||
    {};

  const displays =
    Array.isArray(
      displaySection.items,
    )
      ? displaySection.items
      : [];

  const cta =
    content.cta || {};

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
              lg:h-[620px]
              xl:h-[650px]

              overflow-hidden

              bg-[#161412]
            "
          >
            {hero.image && (
              <img
                src={
                  hero.image
                }
                alt={
                  hero.imageAlt ||
                  hero.headingLine1 ||
                  "Merchandising Displays"
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

            <div
              className="
                absolute
                inset-0

                bg-black/35
              "
            />

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-r

                from-black/75
                via-black/35
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-0

                flex
                items-center

                px-6
                sm:px-10
                md:px-12
                lg:px-16
                xl:px-[5vw]
              "
            >
              <div
                className="
                  w-full
                  max-w-[620px]

                  text-white
                "
              >
                <Eyebrow light>
                  {hero.eyebrow ||
                    "Merchandising Display"}
                </Eyebrow>

                <h1
                  className="
                    mt-7

                    text-[40px]
                    sm:text-[50px]
                    md:text-[56px]
                    lg:text-[60px]
                    xl:text-[64px]

                    leading-[0.99]

                    tracking-[-0.035em]

                    font-normal
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {hero.headingLine1 ||
                    "Designed to display,"}

                  <br />

                  {hero.headingLine2 ||
                    "built to inspire"}
                </h1>

                <p
                  className="
                    mt-6

                    max-w-[480px]

                    text-[11px]
                    sm:text-[12px]
                    lg:text-[13px]

                    leading-[1.7]

                    text-white/85
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {hero.description ||
                    "Purpose-built merchandising solutions that bring our surface collections into your showroom."}
                </p>

                <div className="mt-7">
                  <OutlineButton
                    light
                    onClick={() =>
                      openRequestModal()
                    }
                  >
                    {hero.buttonText ||
                      "Request a Display"}
                  </OutlineButton>
                </div>
              </div>
            </div>

            <div
              className="
                absolute

                left-6
                right-6
                bottom-5

                sm:left-10
                sm:right-10

                lg:left-16
                lg:right-16
              "
            >
              <p
                className="
                  text-[9px]
                  sm:text-[10px]
                  lg:text-[11px]

                  font-medium
                  uppercase

                  tracking-[0.02em]

                  text-white/90
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                For Dealers
                {" • "}
                Fabricators
                {" • "}
                Design Studios
                {" • "}
                Showrooms
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            DISPLAY PROGRAM
        ================================================= */}

        <section
          className="
            bg-[#faf4eb]

            py-14
            sm:py-16
            lg:py-20
          "
        >
          <div
            className="
              max-w-[1650px]
              mx-auto

              px-6
              sm:px-8
              lg:px-12
              xl:px-16
            "
          >
            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-[1fr_0.82fr]

                items-center

                gap-12
                lg:gap-16
                xl:gap-20
              "
            >
              <div>
                <Eyebrow>
                  {displaySection.eyebrow ||
                    "The Display Program"}
                </Eyebrow>

                <h2
                  className="
                    mt-6

                    max-w-[700px]

                    text-[34px]
                    sm:text-[40px]
                    lg:text-[46px]
                    xl:text-[50px]

                    leading-[1.08]

                    tracking-[-0.03em]

                    text-[#161412]
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {displaySection.heading ||
                    "Bring the Ultra Stones experience to your showroom."}
                </h2>

                <p
                  className="
                    mt-6

                    max-w-[650px]

                    text-[11px]
                    sm:text-[12px]
                    lg:text-[13px]

                    leading-[1.8]

                    text-[#504b47]
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {displaySection.description ||
                    "Our merchandising displays are designed to present stone samples clearly, beautifully, and efficiently—helping customers explore colors, patterns, and collections with confidence."}
                </p>

                <div
                  className="
                    mt-8
                    sm:mt-10

                    grid
                    grid-cols-2
                    sm:grid-cols-4

                    gap-y-8
                    gap-x-4

                    max-w-[650px]
                  "
                >
                  <BenefitItem
                    icon={
                      Layers3
                    }
                    line1="Premium"
                    line2="Presentation"
                  />

                  <BenefitItem
                    icon={
                      Minimize2
                    }
                    line1="Space"
                    line2="Efficient"
                  />

                  <BenefitItem
                    icon={
                      ShieldCheck
                    }
                    line1="Built To"
                    line2="Last"
                  />

                  <BenefitItem
                    icon={
                      Handshake
                    }
                    line1="Support That"
                    line2="Sells"
                  />
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-center

                  lg:justify-end
                "
              >
                <div
                  className="
                    relative

                    w-[310px]
                    sm:w-[370px]
                    lg:w-[430px]
                    xl:w-[470px]

                    aspect-square

                    rounded-full

                    bg-white

                    flex
                    items-center
                    justify-center
                  "
                >
                  {(
                    displaySection.image ||
                    displays[1]
                      ?.image ||
                    displays[0]
                      ?.image
                  ) && (
                    <img
                      src={
                        displaySection.image ||
                        displays[1]
                          ?.image ||
                        displays[0]
                          ?.image
                      }
                      alt={
                        displaySection.imageAlt ||
                        "Ultra Stones merchandising display"
                      }
                      className="
                        w-[62%]
                        h-[82%]

                        object-contain
                      "
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            DISPLAY PRODUCTS
        ================================================= */}

        {displays.length >
          0 && (
          <section className="bg-[#f4f4f4]">
            <div
              className="
                max-w-[1650px]
                mx-auto

                px-6
                sm:px-8
                lg:px-12
                xl:px-16
              "
            >
              {displays.map(
                (
                  item,
                  index,
                ) => {
                  const imageOnLeft =
                    index %
                      2 ===
                    1;

                  const number =
                    String(
                      index +
                        1,
                    ).padStart(
                      2,
                      "0",
                    );

                  return (
                    <article
                      key={
                        item.id ||
                        `${item.name}-${index}`
                      }
                      className={`
                        grid
                        grid-cols-1
                        lg:grid-cols-2

                        items-center

                        gap-10
                        lg:gap-14
                        xl:gap-20

                        py-12
                        sm:py-14
                        lg:py-16
                        xl:py-[70px]

                        ${
                          index !==
                          displays.length -
                            1
                            ? `
                                border-b
                                border-[#d8d8d8]
                              `
                            : ""
                        }
                      `}
                    >
                      <div
                        className={
                          imageOnLeft
                            ? "lg:order-1"
                            : "lg:order-2"
                        }
                      >
                        <div
                          className="
                            relative

                            mx-auto

                            w-[280px]
                            sm:w-[350px]
                            md:w-[390px]
                            lg:w-[430px]
                            xl:w-[470px]

                            aspect-square

                            rounded-full

                            bg-white

                            flex
                            items-center
                            justify-center

                            overflow-hidden
                          "
                        >
                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.imageAlt ||
                                item.name ||
                                "Display"
                              }
                              loading="lazy"
                              className="
                                w-[75%]
                                h-[75%]

                                object-contain

                                transition-transform
                                duration-700

                                hover:scale-[1.035]
                              "
                            />
                          ) : (
                            <div
                              className="
                                w-[70%]
                                h-[70%]

                                bg-[#f1f1f1]
                              "
                            />
                          )}
                        </div>
                      </div>

                      <div
                        className={
                          imageOnLeft
                            ? "lg:order-2"
                            : "lg:order-1"
                        }
                      >
                        <span
                          className="
                            text-[18px]
                            sm:text-[20px]
                            lg:text-[21px]

                            font-semibold

                            text-[#e67e22]
                          "
                          style={{
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",
                          }}
                        >
                          {
                            number
                          }
                        </span>

                        {item.name && (
                          <h2
                            className="
                              mt-4

                              max-w-[720px]

                              text-[32px]
                              sm:text-[38px]
                              lg:text-[43px]
                              xl:text-[47px]

                              leading-[1.08]

                              uppercase

                              tracking-[-0.025em]

                              text-[#161412]
                            "
                            style={{
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",
                            }}
                          >
                            {
                              item.name
                            }
                          </h2>
                        )}

                        {item.description && (
                          <p
                            className="
                              mt-4

                              max-w-[620px]

                              text-[13px]
                              sm:text-[14px]
                              lg:text-[15px]
                              xl:text-[16px]

                              leading-[1.7]

                              text-[#363230]
                            "
                            style={{
                              fontFamily:
                                "Montserrat, sans-serif",
                            }}
                          >
                            {
                              item.description
                            }
                          </p>
                        )}

                        {item.size && (
                          <p
                            className="
                              mt-3

                              text-[12px]
                              sm:text-[13px]
                              lg:text-[14px]
                              xl:text-[15px]

                              font-medium

                              leading-[1.6]

                              text-[#363230]
                            "
                            style={{
                              fontFamily:
                                "Montserrat, sans-serif",
                            }}
                          >
                            {
                              item.size
                            }
                          </p>
                        )}

                        <div
                          className="
                            mt-6

                            flex
                            flex-wrap
                            items-center

                            gap-x-7
                            gap-y-4
                          "
                        >
                          {item.detailLink &&
                            item.detailLink !==
                              "#" && (
                              <a
                                href={
                                  item.detailLink
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-4

                                  text-[10px]
                                  sm:text-[11px]
                                  lg:text-[12px]

                                  font-semibold
                                  uppercase
                                  tracking-[0.03em]

                                  text-[#e67e22]

                                  hover:text-[#161412]

                                  transition-colors
                                  duration-300
                                "
                                style={{
                                  fontFamily:
                                    "Montserrat, sans-serif",
                                }}
                              >
                                <span>
                                  View Details
                                </span>

                                <span
                                  className="
                                    text-[18px]
                                    leading-none
                                  "
                                >
                                  →
                                </span>
                              </a>
                            )}

                          {item.detailLink &&
                            item.detailLink !==
                              "#" &&
                            item.pdfUrl &&
                            item.pdfUrl !==
                              "#" && (
                              <span
                                className="
                                  hidden
                                  sm:block

                                  w-px
                                  h-[34px]

                                  bg-[#bfbfbf]
                                "
                              />
                            )}

                          {item.pdfUrl &&
                            item.pdfUrl !==
                              "#" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handlePdfDownload(
                                    item.pdfUrl,
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-4

                                  text-[10px]
                                  sm:text-[11px]
                                  lg:text-[12px]

                                  font-semibold
                                  uppercase
                                  tracking-[0.03em]

                                  text-[#161412]

                                  hover:text-[#e67e22]

                                  transition-colors
                                  duration-300
                                "
                                style={{
                                  fontFamily:
                                    "Montserrat, sans-serif",
                                }}
                              >
                                <span>
                                  {item.buttonText ||
                                    "Download Spec Sheet"}
                                </span>

                                <ArrowDownToLine
                                  size={
                                    15
                                  }
                                  strokeWidth={
                                    1.6
                                  }
                                  className="text-[#c91f26]"
                                />
                              </button>
                            )}

                          <button
                            type="button"
                            onClick={() =>
                              openRequestModal(
                                item,
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-4

                              text-[10px]
                              sm:text-[11px]
                              lg:text-[12px]

                              font-semibold
                              uppercase
                              tracking-[0.03em]

                              text-[#161412]

                              hover:text-[#e67e22]

                              transition-colors
                              duration-300
                            "
                            style={{
                              fontFamily:
                                "Montserrat, sans-serif",
                            }}
                          >
                            <span>
                              Request Display
                            </span>

                            <span
                              className="
                                text-[18px]
                                leading-none

                                text-[#e67e22]
                              "
                            >
                              →
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </section>
        )}

        {/* =================================================
            SHOWROOM FEATURE
        ================================================= */}

        <section
          id="request-display"
          className="
            bg-[#f9b877]

            py-10
            sm:py-12
            lg:py-14
          "
        >
          <div
            className="
              max-w-[1550px]
              mx-auto

              px-6
              sm:px-8
              lg:px-12
              xl:px-14
            "
          >
            <div
              className="
                grid
                grid-cols-1

                lg:grid-cols-[0.95fr_1fr]

                items-center

                gap-10
                lg:gap-12
                xl:gap-16
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    grid

                    grid-cols-[95px_260px_105px]
                    sm:grid-cols-[115px_300px_125px]
                    lg:grid-cols-[125px_330px_135px]

                    items-center

                    w-fit
                    max-w-full
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      justify-between

                      h-[205px]
                      sm:h-[230px]
                      lg:h-[255px]

                      py-6
                    "
                  >
                    <div
                      className="
                        flex
                        items-center

                        text-right
                      "
                    >
                      <span
                        className="
                          flex-1

                          pr-3

                          text-[8px]
                          sm:text-[9px]
                          lg:text-[10px]

                          font-medium
                          uppercase

                          leading-[1.4]

                          text-[#161412]
                        "
                        style={{
                          fontFamily:
                            "Montserrat, sans-serif",
                        }}
                      >
                        Easy Sample
                        <br />
                        Access
                      </span>

                      <span
                        className="
                          w-[6px]
                          h-[6px]

                          shrink-0

                          rounded-full

                          bg-[#161412]
                        "
                      />

                      <span
                        className="
                          w-[28px]
                          sm:w-[34px]

                          h-px

                          shrink-0

                          bg-[#161412]
                        "
                      />
                    </div>

                    <div
                      className="
                        flex
                        items-center

                        text-right
                      "
                    >
                      <span
                        className="
                          flex-1

                          pr-3

                          text-[8px]
                          sm:text-[9px]
                          lg:text-[10px]

                          font-medium
                          uppercase

                          leading-[1.4]

                          text-[#161412]
                        "
                        style={{
                          fontFamily:
                            "Montserrat, sans-serif",
                        }}
                      >
                        High-Capacity
                        <br />
                        Display
                      </span>

                      <span
                        className="
                          w-[6px]
                          h-[6px]

                          shrink-0

                          rounded-full

                          bg-[#161412]
                        "
                      />

                      <span
                        className="
                          w-[28px]
                          sm:w-[34px]

                          h-px

                          shrink-0

                          bg-[#161412]
                        "
                      />
                    </div>
                  </div>

                  <div
                    className="
                      relative

                      w-[260px]
                      sm:w-[300px]
                      lg:w-[330px]

                      aspect-square

                      rounded-full

                      bg-white

                      flex
                      items-center
                      justify-center

                      shrink-0

                      overflow-visible
                    "
                  >
                    {(
                      cta.image ||
                      displays[1]
                        ?.image ||
                      displays[0]
                        ?.image
                    ) && (
                      <img
                        src={
                          cta.image ||
                          displays[1]
                            ?.image ||
                          displays[0]
                            ?.image
                        }
                        alt={
                          cta.imageAlt ||
                          "Merchandising display"
                        }
                        className="
                          absolute

                          left-1/2
                          top-1/2

                          -translate-x-1/2
                          -translate-y-1/2

                          w-auto

                          h-[112%]
                          sm:h-[116%]
                          lg:h-[120%]

                          max-w-none

                          object-contain

                          z-10
                        "
                      />
                    )}
                  </div>

                  <div
                    className="
                      flex
                      flex-col
                      justify-between

                      h-[205px]
                      sm:h-[230px]
                      lg:h-[255px]

                      py-6
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                      "
                    >
                      <span
                        className="
                          w-[28px]
                          sm:w-[34px]

                          h-px

                          shrink-0

                          bg-[#161412]
                        "
                      />

                      <span
                        className="
                          w-[6px]
                          h-[6px]

                          shrink-0

                          rounded-full

                          bg-[#161412]
                        "
                      />

                      <span
                        className="
                          pl-3

                          text-[8px]
                          sm:text-[9px]
                          lg:text-[10px]

                          font-medium
                          uppercase

                          leading-[1.4]

                          text-[#161412]
                        "
                        style={{
                          fontFamily:
                            "Montserrat, sans-serif",
                        }}
                      >
                        Compact
                        <br />
                        Footprint
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                      "
                    >
                      <span
                        className="
                          w-[28px]
                          sm:w-[34px]

                          h-px

                          shrink-0

                          bg-[#161412]
                        "
                      />

                      <span
                        className="
                          w-[6px]
                          h-[6px]

                          shrink-0

                          rounded-full

                          bg-[#161412]
                        "
                      />

                      <span
                        className="
                          pl-3

                          text-[8px]
                          sm:text-[9px]
                          lg:text-[10px]

                          font-medium
                          uppercase

                          leading-[1.4]

                          text-[#161412]
                        "
                        style={{
                          fontFamily:
                            "Montserrat, sans-serif",
                        }}
                      >
                        Organized
                        <br />
                        Presentation
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="
                  max-w-[600px]

                  lg:pl-1
                "
              >
                <Eyebrow>
                  {cta.eyebrow ||
                    "Designed For The Showroom"}
                </Eyebrow>

                <h2
                  className="
                    mt-4

                    text-[34px]
                    sm:text-[39px]
                    lg:text-[43px]
                    xl:text-[46px]

                    leading-[1.02]

                    tracking-[-0.035em]

                    text-[#161412]
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {cta.titleLine1 ||
                    "More surface."}

                  <br />

                  {cta.titleLine2 ||
                    "Less footprint."}
                </h2>

                <p
                  className="
                    mt-5

                    max-w-[590px]

                    text-[11px]
                    sm:text-[12px]
                    lg:text-[13px]

                    leading-[1.7]

                    text-[#292522]
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {cta.description ||
                    "Our displays are engineered to maximize sample capacity while maintaining a clean, modern look that elevates your showroom space."}
                </p>

                <div className="mt-5">
                  <OutlineButton
                    onClick={() =>
                      openRequestModal()
                    }
                  >
                    {cta.buttonText ||
                      "Request a Display"}
                  </OutlineButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div
          className="
            h-6
            sm:h-8

            bg-white
          "
        />
      </div>

      {/* ===================================================
          REQUEST DISPLAY MODAL
      =================================================== */}

      {requestModal && (
        <RequestDisplayModal
          displays={
            displays
          }
          selectedDisplay={
            requestModal.display
          }
          onClose={() =>
            setRequestModal(
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
          .display-request-input {
            width: 100%;
            height: 48px;

            padding-left: 14px;
            padding-right: 14px;

            border: 1px solid #d8d4cf;

            outline: none;

            border-radius: 0;

            background: #ffffff;

            font-family: Montserrat, sans-serif;
            font-size: 12px;

            color: #262320;

            transition:
              border-color 0.3s ease,
              box-shadow 0.3s ease;
          }

          .display-request-input::placeholder {
            color: #aaa6a1;
          }

          .display-request-input:focus {
            border-color: #161412;

            box-shadow:
              inset 0 -1px 0 #161412;
          }

          .display-request-input:disabled {
            cursor: not-allowed;

            opacity: 0.6;

            background: #f5f5f5;
          }

          textarea.display-request-input {
            height: auto;
          }
        `}
      </style>
    </>
  );
};

export default Merchandise;