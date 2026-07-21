import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const normalizeExternalUrl = (value) => {
  if (!value || typeof value !== "string") return "";

  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://")
  ) {
    return trimmedValue;
  }

  return `https://${trimmedValue.replace(/^\/+/, "")}`;
};

const extractIframeSrc = (value) => {
  if (!value || typeof value !== "string") return "";

  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  /*
    Supports:
    <iframe src="https://..."></iframe>
    <iframe src='https://...'></iframe>
  */
  const iframeSrcMatch = trimmedValue.match(
    /<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i
  );

  if (iframeSrcMatch?.[1]) {
    return iframeSrcMatch[1].trim();
  }

  /*
    If the database contains only the URL,
    return the normalized URL.
  */
  return normalizeExternalUrl(trimmedValue);
};

const buildShowroomSearchQuery = (showroom) =>
  [
    "Ultra Stones",
    showroom?.address,
    showroom?.city,
    showroom?.state,
    showroom?.zip_code,
    showroom?.country,
  ]
    .filter(Boolean)
    .join(", ");

const getTelephoneUrl = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== "string") return "";

  return phoneNumber.replace(/[^\d+]/g, "");
};

const Location = () => {
  const { slug } = useParams();

  const [showroom, setShowroom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchShowroom = async () => {
      try {
        setLoading(true);
        setShowroom(null);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/company/slug/${slug}`
        );

        if (!isMounted) return;

        if (response.data?.success && response.data?.data) {
          setShowroom(response.data.data);
        } else {
          setShowroom(null);
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to fetch showroom:", error);
        setShowroom(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchShowroom();
    } else {
      setLoading(false);
      setShowroom(null);
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const mapEmbedUrl = useMemo(() => {
    if (!showroom) return "";

    /*
      Priority:
      1. Extract src from google_maps_embed_url iframe HTML.
      2. Extract src from google_maps_url iframe HTML.
      3. Use a plain embed URL if one was saved.
      4. Fall back to a Google Maps business search.
    */

    const savedMapValue =
      showroom.google_maps_embed_url || showroom.google_maps_url;

    if (savedMapValue) {
      const extractedUrl = extractIframeSrc(savedMapValue);

      if (extractedUrl) {
        return extractedUrl;
      }
    }

    const mapSearchQuery = buildShowroomSearchQuery(showroom);

    if (!mapSearchQuery) return "";

    return `https://maps.google.com/maps?q=${encodeURIComponent(
      mapSearchQuery
    )}&z=16&hl=en&gl=US&output=embed`;
  }, [showroom]);

  const directionsUrl = useMemo(() => {
    if (!showroom) return "";

    const destination = buildShowroomSearchQuery(showroom);

    if (!destination) return "";

    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination
    )}`;
  }, [showroom]);

  const formattedCityState = useMemo(() => {
    if (!showroom) return "";

    return [showroom.city, showroom.state].filter(Boolean).join(", ");
  }, [showroom]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-[110px]">
        <section>
          <div className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <h1
              className="text-[34px] font-semibold leading-none text-[#161412] md:text-[42px]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Locations
            </h1>

            <div className="mb-4 mt-4 h-[4px] w-[70px] bg-[#c91f26]" />

            <p
              className="text-[13px] text-[#777]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <Link
                to="/"
                className="transition-colors duration-300 hover:text-[#161412]"
              >
                Home
              </Link>

              {" / "}

              <Link
                to="/locations"
                className="transition-colors duration-300 hover:text-[#161412]"
              >
                Locations
              </Link>

              {" / "}

              <span className="text-[#161412]">
                <strong>{showroom?.name || "Location"}</strong>
              </span>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1650px] px-6 pb-24 pt-16 xl:px-10">
          {loading ? (
            <div className="py-20 text-center text-[14px] text-[#666]">
              Loading showroom...
            </div>
          ) : !showroom ? (
            <div className="py-20 text-center text-[14px] text-[#666]">
              Location not found.
            </div>
          ) : (
            <>
              <h2 className="mb-5 text-[30px] font-bold uppercase leading-tight text-[#161412] md:text-[38px]">
                {showroom.name}
              </h2>

              {showroom.short_description && (
                <p className="mb-8 max-w-[1500px] text-[13px] leading-7 text-[#777]">
                  {showroom.short_description}
                </p>
              )}

              {mapEmbedUrl ? (
                <iframe
                  title={`${showroom.name} location`}
                  src={mapEmbedUrl}
                  className="h-[420px] w-full border border-[#ddd]"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-[420px] w-full items-center justify-center border border-[#ddd] text-[13px] text-[#777]">
                  Map is currently unavailable.
                </div>
              )}

              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[#161412]">
                    Address
                  </h3>

                  <address className="not-italic text-[13px] leading-6 text-[#666]">
                    {showroom.address || "-"}

                    {(formattedCityState || showroom.zip_code) && <br />}

                    {formattedCityState}

                    {showroom.zip_code ? ` ${showroom.zip_code}` : ""}

                    {showroom.country && (
                      <>
                        <br />
                        {showroom.country}
                      </>
                    )}
                  </address>
                </div>

                <div>
                  <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[#161412]">
                    Contact Information
                  </h3>

                  <div className="text-[13px] leading-6 text-[#666]">
                    <p>
                      Primary:{" "}
                      {showroom.primary_phone ? (
                        <a
                          href={`tel:${getTelephoneUrl(
                            showroom.primary_phone
                          )}`}
                          className="transition-colors hover:text-[#c91f26]"
                        >
                          {showroom.primary_phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>

                    <p>
                      Secondary:{" "}
                      {showroom.secondary_phone ? (
                        <a
                          href={`tel:${getTelephoneUrl(
                            showroom.secondary_phone
                          )}`}
                          className="transition-colors hover:text-[#c91f26]"
                        >
                          {showroom.secondary_phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>

                    <p>
                      Company:{" "}
                      {showroom.company_phone ? (
                        <a
                          href={`tel:${getTelephoneUrl(
                            showroom.company_phone
                          )}`}
                          className="transition-colors hover:text-[#c91f26]"
                        >
                          {showroom.company_phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>

                    <p>
                      Email:{" "}
                      {showroom.email ? (
                        <a
                          href={`mailto:${showroom.email}`}
                          className="break-all transition-colors hover:text-[#c91f26]"
                        >
                          {showroom.email}
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[#161412]">
                    Office Hours
                  </h3>

                  <div className="text-[13px] leading-6 text-[#666]">
                    <p>Monday - Friday</p>
                    <p>{showroom.business_hours_mon_fri || "-"}</p>

                    <div className="h-4" />

                    <p>Saturday</p>
                    <p>{showroom.business_hours_saturday || "-"}</p>

                    <div className="h-4" />

                    <p>Sunday</p>
                    <p>{showroom.business_hours_sunday || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start lg:items-center lg:justify-end">
                  {directionsUrl && (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center justify-center border border-[#c91f26] px-6 py-2 text-center text-[11px] uppercase tracking-wider text-[#161412] transition-all hover:bg-[#c91f26] hover:text-white"
                    >
                      Get Directions
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Location;