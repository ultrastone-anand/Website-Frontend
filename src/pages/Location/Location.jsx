import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const Location = () => {
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
  {/* NEW YORK */}

  <div className="mb-24">
    <h2
      className="
        text-[38px]
        font-bold
        uppercase
        text-[#161412]
        mb-5
      "
    >
      New York Showroom
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
      Find the perfect slab at Ultra Stones' New York showroom in
      Farmingdale. Our curated inventory features a vast selection of
      natural and engineered stones, including marble, quartzite,
      quartz, and more.
    </p>

    <iframe
      title="New York"
      src="https://maps.google.com/maps?q=55%20Central%20Drive%20Farmingdale&t=&z=14&ie=UTF8&iwloc=&output=embed"
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
        <h4 className="text-[11px] font-bold uppercase mb-3">
          Address
        </h4>

        <p className="text-[13px] text-[#666] leading-6">
          55 Central Drive
          <br />
          Farmingdale NY 11735
        </p>
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase mb-3">
          Contact Information
        </h4>

        <p className="text-[13px] text-[#666] leading-6">
          Phone: (631) 617-7470
          <br />
          Fax: (631) 617-4780
        </p>
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase mb-3">
          Office Hours
        </h4>

        <p className="text-[13px] text-[#666] leading-6">
          Monday - Friday
          <br />
          8:00 AM to 5:00 PM
          <br />
          Saturday
          <br />
          9:00 AM to 1:00 PM
        </p>
      </div>

      <div className="flex items-center justify-end">
        <a
          href="https://maps.google.com"
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

  {/* PHILADELPHIA */}

  <div>
    <h2
      className="
        text-[38px]
        font-bold
        uppercase
        text-[#161412]
        mb-5
      "
    >
      Philadelphia Showroom
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
      Ultra Stones Philadelphia showroom welcomes you to a world of
      breathtaking natural and engineered stone surfaces including
      marble, quartzite, quartz and porcelain slabs.
    </p>

    <iframe
      title="Philadelphia"
      src="https://maps.google.com/maps?q=2301%20Hornig%20Road%20Philadelphia&t=&z=14&ie=UTF8&iwloc=&output=embed"
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
        <h4 className="text-[11px] font-bold uppercase mb-3">
          Address
        </h4>

        <p className="text-[13px] text-[#666] leading-6">
          2301 Hornig Rd
          <br />
          Philadelphia, PA 19116
        </p>
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase mb-3">
          Contact Information
        </h4>

        <p className="text-[13px] text-[#666] leading-6">
          Phone: 215 437 9077
          <br />
          Fax: 215 437 9077
        </p>
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase mb-3">
          Office Hours
        </h4>

        <p className="text-[13px] text-[#666] leading-6">
          Monday - Friday
          <br />
          8:00 AM to 5:00 PM
          <br />
          Saturday
          <br />
          9:00 AM to 1:00 PM
        </p>
      </div>

      <div className="flex items-center justify-end">
        <a
          href="https://maps.google.com"
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
</section>
  </div>

  <Footer />
</>
  );
};

export default Location;