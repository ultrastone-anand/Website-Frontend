import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

const Aboutus = () => {
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
          About Us
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
          Home /Ultra Experience/{" "}
          <span className="text-[#161412]">
            <b>About Us</b>
          </span>
        </p>
      </div>
    </section>

    {/* ABOUT US CONTENT */}


  </div>

  <Footer />
</>
  );
};

export default Aboutus;