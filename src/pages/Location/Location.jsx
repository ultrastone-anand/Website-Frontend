import axios from "axios";
import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const Location = () => {
const [showrooms, setShowrooms] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchShowrooms();
}, []);

const fetchShowrooms = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/company`
    );

    if (response.data.success) {
      setShowrooms(response.data.data || []);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
<>
  <Navbar />

  <div
    className="
      bg-[#f3f3f3]
      min-h-screen
      pt-[110px]
    "
  >
    {/* HEADING */}

    <section>
      <div
        className="
          max-w-[1650px]
          mx-auto
          px-6
          xl:px-10
        "
      >
        <h1
          className="
            text-[34px]
            md:text-[42px]
            font-semibold
            text-[#161412]
            leading-none
          "
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Location
        </h1>

        <div
          className="
            w-[70px]
            h-[4px]
            bg-[#c91f26]
            mt-4
            mb-4
          "
        />

        <p
          className="
            text-[13px]
            text-[#777]
          "
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Home /{" "}
          <span className="text-[#161412]">
            <b>Location</b>
          </span>
        </p>
      </div>
    </section>

<section
  className="
    max-w-[1650px]
    mx-auto
    px-6
    xl:px-10
    pt-16
    pb-24
  "
>
  {loading ? (
    <div className="text-center py-20">
      Loading Showrooms...
    </div>
  ) : (
    showrooms.map((showroom, index) => (
      <div
        key={showroom.id}
        className={
          index !== showrooms.length - 1
            ? "mb-24"
            : ""
        }
      >
        <h2
          className="
            text-[38px]
            font-bold
            uppercase
            text-[#161412]
            mb-5
          "
        >
          {showroom.name}
        </h2>

        <p
          className="
            text-[13px]
            text-[#777]
            leading-7
            mb-8
            max-w-[1500px]
          "
        >
          {showroom.short_description}
        </p>

        <iframe
          title={showroom.name}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            `${showroom.address}, ${showroom.city}, ${showroom.state}`
          )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          className="
            w-full
            h-[420px]
            border
            border-[#ddd]
          "
        />

        <div
          className="
            grid
            md:grid-cols-4
            gap-8
            mt-8
          "
        >
          <div>
            <h4
              className="
                text-[11px]
                font-bold
                uppercase
                mb-3
              "
            >
              Address
            </h4>

            <p
              className="
                text-[13px]
                text-[#666]
                leading-6
              "
            >
              {showroom.address}
              <br />
              {showroom.city},{" "}
              {showroom.state}{" "}
              {showroom.zip_code}
            </p>
          </div>

          <div>
            <h4
              className="
                text-[11px]
                font-bold
                uppercase
                mb-3
              "
            >
              Contact Information
            </h4>

            <p
              className="
                text-[13px]
                text-[#666]
                leading-6
              "
            >
              Phone:{" "}
              {showroom.primary_phone} , {showroom.secondary_phone}
              <br />
              Company Phone:{" "}
              {showroom.company_phone ||
                showroom.secondary_phone ||
                "-"}
              <br />
              Email: {showroom.email}
            </p>
          </div>

          <div>
            <h4
              className="
                text-[11px]
                font-bold
                uppercase
                mb-3
              "
            >
              Office Hours
            </h4>

            <p
              className="
                text-[13px]
                text-[#666]
                leading-6
              "
            >
              Monday - Friday
              <br />
              {
                showroom.business_hours_mon_fri
              }
              <br />
              Saturday
              <br />
              {
                showroom.business_hours_saturday
              }
              <br />
              Sunday
              <br />
              {
                showroom.business_hours_sunday
              }
            </p>
          </div>

          <div className="flex items-center justify-end">
            <a
              href={
                showroom.google_maps_url ||
                "#"
              }
              target="_blank"
              rel="noreferrer"
              className="
                border
                border-[#c91f26]
                text-[#161412]
                px-6
                py-2
                text-[11px]
                uppercase
                tracking-wider
                hover:bg-[#c91f26]
                hover:text-white
                transition-all
              "
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    ))
  )}
</section>
  </div>

  <Footer />
</>
  );
};

export default Location;