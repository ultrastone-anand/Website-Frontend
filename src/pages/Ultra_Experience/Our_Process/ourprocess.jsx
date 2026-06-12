import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

import uslogo from '../../../assets/uslogo.png';


const OurProcess = () => {
    const processSteps = [
  {
    id: 1,
    title: "Browse Your Slab",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    description:
      "Take a stroll through our state-of-the-art slab gallery, where premium surfaces sourced from around the world await your consideration.",
  },
  {
    id: 2,
    title: "Selection",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    description:
      "Create a wishlist of your favorite slabs and get final pricing from your fabricator. We’ll provide a complimentary hold on your selections. Once the design and pricing are approved, you can come again to tag the exact slabs you wish to get for your project.",
  },
  {
    id: 3,
    title: "Coordinate",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
    description:
      "After finalizing your purchase, you’ll receive prompt confirmation from our dedicated logistics team, ensuring your order has been successfully processed.",
  },
  {
    id: 4,
    title: "Delivery",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
    description:
      "Once your slabs are selected and confirmed, our logistics team will coordinate the delivery to your slab, ensuring your materials arrive safely and on time, ready for the next step in your project.",
  },
  {
    id: 5,
    title: "Installation",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
    description:
      "Experience the triumph of your newly installed countertops as they complete your space, combining beauty and functionality in your new kitchen.",
  },
];
  return (
    
    <>
      <Navbar />

      <div className="bg-[#f3f3f3] min-h-screen pt-[110px]">
        {/* HEADING */}
        <section>
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Our Process
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4" />

            <p
              className="text-[13px] text-[#777]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Home / Ultra Experience /{" "}
              <span className="text-[#161412] font-semibold">
                Our Process
              </span>
            </p>
          </div>
        </section>

<section className="py-5">
  <div className="max-w-[1650px] mx-auto px-3 xl:px-5">

<div className="space-y-12 mt-16">
  {processSteps.map((step) => (
    <div
      key={step.id}
      className="
        flex
        flex-col
        lg:flex-row
        items-start
        gap-0
      "
    >
      {/* IMAGE */}
      <div
        className="
          w-full
          lg:w-[500px]
xl:w-[600px]
          shrink-0
        "
      >
        <img
          src={step.image}
          alt={step.title}
          className="
            w-full
h-[320px]
xl:h-[380px]
            object-cover
          "
        />
      </div>

      {/* CONTENT */}
      <div
        className="
          flex-1
          bg-transparent
          relative
          lg:pl-0
        "
      >
        {/* RED STRIP */}
        <div
          className="
            h-[42px]
            w-[340px]
            bg-gradient-to-r
            from-[#d71920]
            to-[#f5e4e4]
            flex
            items-center
            px-5
            text-white
            text-[24px]
            font-semibold
          "
        >
          {step.title}
        </div>

        <div className="pt-12 px-12 flex-1">
          <p
            className="
              text-[20px]
              leading-[26px]
              text-[#555]
              mb-8
            "
          >
            {step.description}
          </p>

          <button
            className="
              border
              border-[#d71920]
              text-[#d71920]
              text-[14px]
              uppercase
              tracking-[1px]
              px-4
              py-2
              hover:bg-[#d71920]
              hover:text-white
              transition
            "
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
  </div>
</section>

      </div>

      <Footer />
    </>
  );
};

export default OurProcess;