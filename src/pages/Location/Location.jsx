import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const Location = () => {
  const { slug } = useParams();

  const [showroom, setShowroom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowroom();
  }, [slug]);

  const fetchShowroom = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/company/slug/${slug}`
      );

      if (response.data.success) {
        setShowroom(response.data.data);
      } else {
        setShowroom(null);
      }
    } catch (error) {
      console.error(error);
      setShowroom(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-[#f3f3f3] min-h-screen pt-[110px]">
        {/* Heading */}
        <section>
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412] leading-none"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Locations
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4" />

            <p
              className="text-[13px] text-[#777]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <Link
                to="/"
                className="hover:text-[#161412] duration-300"
              >
                Home
              </Link>

              {" / "}

                            <Link
                to="/"
                className="hover:text-[#161412] duration-300"
              >
                Locations
              </Link>

              {" / "}

              <span className="text-[#161412]">
                <b>{showroom?.name || "Location"}</b>
              </span>
            </p>
          </div>
        </section>

        <section className="max-w-[1650px] mx-auto px-6 xl:px-10 pt-16 pb-24">
          {loading ? (
            <div className="text-center py-20">
              Loading showroom...
            </div>
          ) : !showroom ? (
            <div className="text-center py-20 text-gray-600">
              Location not found.
            </div>
          ) : (
            <>
              <h2 className="text-[38px] font-bold uppercase text-[#161412] mb-5">
                {showroom.name}
              </h2>

              <p className="text-[13px] text-[#777] leading-7 mb-8 max-w-[1500px]">
                {showroom.short_description}
              </p>

              <iframe
                title={showroom.name}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  `${showroom.address}, ${showroom.city}, ${showroom.state}`
                )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-[420px] border border-[#ddd]"
              />

              <div className="grid md:grid-cols-4 gap-8 mt-8">
                <div>
                  <h4 className="text-[11px] font-bold uppercase mb-3">
                    Address
                  </h4>

                  <p className="text-[13px] text-[#666] leading-6">
                    {showroom.address}
                    <br />
                    {showroom.city}, {showroom.state}{" "}
                    {showroom.zip_code}
                    <br />
                    {showroom.country}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase mb-3">
                    Contact Information
                  </h4>

                  <p className="text-[13px] text-[#666] leading-6">
                    Primary: {showroom.primary_phone}
                    <br />
                    Secondary: {showroom.secondary_phone || "-"}
                    <br />
                    Company: {showroom.company_phone || "-"}
                    <br />
                    Email: {showroom.email}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase mb-3">
                    Office Hours
                  </h4>

                  <p className="text-[13px] text-[#666] leading-6">
                    Monday - Friday
                    <br />
                    {showroom.business_hours_mon_fri}
                    <br />
                    <br />
                    Saturday
                    <br />
                    {showroom.business_hours_saturday}
                    <br />
                    <br />
                    Sunday
                    <br />
                    {showroom.business_hours_sunday}
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <a
                    href={showroom.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#c91f26] text-[#161412] px-6 py-2 text-[11px] uppercase tracking-wider hover:bg-[#c91f26] hover:text-white transition-all"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Location;