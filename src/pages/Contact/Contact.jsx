import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const extractIframeSrc = (value) => {
  if (!value || typeof value !== "string") return "";

  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  const iframeSrcMatch = trimmedValue.match(
    /<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i
  );

  if (iframeSrcMatch?.[1]) {
    return iframeSrcMatch[1].trim();
  }

  if (
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("http://")
  ) {
    return trimmedValue;
  }

  return "";
};

const buildShowroomDestination = (showroom) =>
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

const getDirectionsUrl = (showroom) => {
  const destination = buildShowroomDestination(showroom);

  if (!destination) return "";

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination
  )}`;
};

export default function Contact() {
  const [showrooms, setShowrooms] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [showroomsLoading, setShowroomsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchShowrooms = async () => {
      try {
        setShowroomsLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/company`
        );

        if (!isMounted) return;

        if (response.data?.success && Array.isArray(response.data?.data)) {
          const activeShowrooms = response.data.data
            .filter((item) => item.is_active)
            .sort(
              (a, b) =>
                (a.display_order || 0) - (b.display_order || 0)
            );

          setShowrooms(activeShowrooms);
        } else {
          setShowrooms([]);
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to fetch showrooms:", error);
        setShowrooms([]);
      } finally {
        if (isMounted) {
          setShowroomsLoading(false);
        }
      }
    };

    fetchShowrooms();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanedPhone = formData.phone.replace(/\D/g, "");

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!formData.subject.trim()) {
      alert("Subject is required");
      return;
    }

    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }

    if (!emailRegex.test(formData.email.trim())) {
      alert("Please enter a valid email address");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Phone number is required");
      return;
    }

    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      alert("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/contact`,
        {
          name: formData.name.trim(),
          subject: formData.subject.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }
      );

      if (response.data?.success) {
        alert("Enquiry submitted successfully");

        setFormData({
          name: "",
          subject: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        alert(response.data?.message || "Unable to submit enquiry");
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while submitting the enquiry"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-[110px]">
        {/* HEADING */}

        <section>
          <div className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <h1
              className="text-[34px] font-semibold leading-none text-[#161412] md:text-[42px]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Contact Us
            </h1>

            <div className="mb-4 mt-4 h-[4px] w-[70px] bg-[#c91f26]" />

            <p
              className="text-[13px] text-[#777]"
              style={{
                fontFamily: "Montserrat, sans-serif",
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
                <strong>Contact Us</strong>
              </span>
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}

        <section className="mx-auto max-w-[1650px] px-6 pb-24 pt-16 xl:px-10">
          <div className="grid gap-16 lg:grid-cols-[520px_1fr] xl:gap-[120px]">
            {/* LEFT SIDE */}

            <div>
              <h2 className="mb-8 text-[28px] font-light text-[#161412]">
                Get in touch
              </h2>

              <p className="mb-10 text-[13px] leading-[24px] text-[#666]">
                Thank you for your interest in our services. If you have any
                questions or would like to discuss a project, please do not
                hesitate to contact us. Our team is dedicated to providing you
                with the highest level of service and support.
              </p>

              <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
                <div>
                  <h3 className="mb-4 text-[13px] font-semibold text-[#c91f26]">
                    Visit Us
                  </h3>

                  <div className="space-y-8">
                    {showroomsLoading ? (
                      <p className="text-[12px] text-[#666]">
                        Loading showrooms...
                      </p>
                    ) : showrooms.length === 0 ? (
                      <p className="text-[12px] text-[#666]">
                        No showrooms available.
                      </p>
                    ) : (
                      showrooms.map((showroom) => (
                        <div key={showroom.id}>
                          <Link
                            to={`/locations/${showroom.slug}`}
                            className="text-[13px] font-medium text-[#222] transition-colors hover:text-[#c91f26]"
                          >
                            {showroom.name}
                          </Link>

                          <p className="mt-1 text-[12px] leading-5 text-[#666]">
                            {showroom.address || "-"}
                            <br />

                            {[showroom.city, showroom.state]
                              .filter(Boolean)
                              .join(", ")}

                            {showroom.zip_code
                              ? ` ${showroom.zip_code}`
                              : ""}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-[13px] font-semibold text-[#c91f26]">
                    Office Hours
                  </h3>

                  {showroomsLoading ? (
                    <p className="text-[12px] text-[#666]">
                      Loading office hours...
                    </p>
                  ) : showrooms.length > 0 ? (
                    <div className="text-[12px] leading-5 text-[#666]">
                      <p>Monday - Friday</p>
                      <p className="mb-3">
                        {showrooms[0].business_hours_mon_fri || "-"}
                      </p>

                      <p>Saturday</p>
                      <p className="mb-3">
                        {showrooms[0].business_hours_saturday || "-"}
                      </p>

                      <p>Sunday</p>
                      <p>
                        {showrooms[0].business_hours_sunday || "-"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[12px] text-[#666]">
                      Office hours unavailable.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* FORM */}

            <div>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
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
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      className="h-[42px] w-full border border-[#e1ddd8] bg-[#ece9e5] px-4 text-[13px] outline-none transition-colors focus:border-[#c91f26]"
                    />
                  </div>

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
                      value={formData.subject}
                      onChange={handleChange}
                      className="h-[42px] w-full border border-[#e1ddd8] bg-[#ece9e5] px-4 text-[13px] outline-none transition-colors focus:border-[#c91f26]"
                    />
                  </div>

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
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className="h-[42px] w-full border border-[#e1ddd8] bg-[#ece9e5] px-4 text-[13px] outline-none transition-colors focus:border-[#c91f26]"
                    />
                  </div>

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
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      inputMode="tel"
                      className="h-[42px] w-full border border-[#e1ddd8] bg-[#ece9e5] px-4 text-[13px] outline-none transition-colors focus:border-[#c91f26]"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-[12px] text-[#222]"
                  >
                    Message (Optional)
                  </label>

                  <textarea
                    id="contact-message"
                    rows={7}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full resize-none border border-[#e1ddd8] bg-[#ece9e5] p-4 text-[13px] outline-none transition-colors focus:border-[#c91f26]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 h-[32px] min-w-[90px] bg-[#0c5562] px-4 text-[11px] uppercase tracking-wider text-white transition-all hover:bg-[#08414b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </form>
            </div>
          </div>

          {/* SHOWROOMS */}

          <section className="mt-28">
            <h2 className="mb-10 text-[30px] font-light text-[#161412]">
              Our Showrooms
            </h2>

            {showroomsLoading ? (
              <div className="py-16 text-center text-[13px] text-[#666]">
                Loading showrooms...
              </div>
            ) : showrooms.length === 0 ? (
              <div className="py-16 text-center text-[13px] text-[#666]">
                No showrooms are currently available.
              </div>
            ) : (
              <div className="grid gap-14 lg:grid-cols-2">
                {showrooms.map((showroom) => {
                  const mapEmbedUrl = extractIframeSrc(
                    showroom.google_maps_url
                  );

                  const directionsUrl = getDirectionsUrl(showroom);

                  return (
                    <article key={showroom.id}>
                      <div className="border border-[#ddd]">
                        {mapEmbedUrl ? (
                          <iframe
                            title={`${showroom.name} location`}
                            src={mapEmbedUrl}
                            className="h-[300px] w-full border-0"
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        ) : (
                          <div className="flex h-[300px] w-full items-center justify-center text-[13px] text-[#777]">
                            Map is currently unavailable.
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/locations/${showroom.slug}`}
                        className="mt-5 inline-block text-[26px] font-light text-[#c91f26] transition-colors hover:text-[#161412] md:text-[32px]"
                      >
                        {showroom.name}
                      </Link>

                      <p className="mt-2 text-[13px] leading-6 text-[#555]">
                        {showroom.address || "-"}
                        <br />

                        {[showroom.city, showroom.state]
                          .filter(Boolean)
                          .join(", ")}

                        {showroom.zip_code
                          ? ` ${showroom.zip_code}`
                          : ""}

                        {showroom.country && (
                          <>
                            <br />
                            {showroom.country}
                          </>
                        )}
                      </p>

                      <p className="mt-3 text-[12px] leading-5 text-[#555]">
                        Monday - Friday:{" "}
                        {showroom.business_hours_mon_fri || "-"}
                        <br />

                        Saturday:{" "}
                        {showroom.business_hours_saturday || "-"}
                        <br />

                        Sunday:{" "}
                        {showroom.business_hours_sunday || "-"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {directionsUrl && (
                          <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[38px] items-center justify-center border border-[#c91f26] px-5 py-2 text-[11px] uppercase tracking-wider text-[#161412] transition-all hover:bg-[#c91f26] hover:text-white"
                          >
                            Get Directions
                          </a>
                        )}

                        <Link
                          to={`/locations/${showroom.slug}`}
                          className="inline-flex min-h-[38px] items-center justify-center border border-[#161412] px-5 py-2 text-[11px] uppercase tracking-wider text-[#161412] transition-all hover:bg-[#161412] hover:text-white"
                        >
                          View Location
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}