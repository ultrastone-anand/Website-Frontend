const filters = [
  "All",
  "Kitchens",
  "Bathrooms",
  "Other Interiors",
  "Outdoor",
  "Facades",
  "Commercial",
];

const galleryImages = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
];

const InspirationGallery = () => {
  return (
    <section className="bg-white py-[92px]">
      <div className="mx-auto max-w-[1650px] px-6 xl:px-[52px]">
        <div className="mb-11 flex items-center justify-between">
          <h2
            className="flex items-center gap-7 text-[18px] font-bold uppercase text-[#111] md:text-[22px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            INSPIRATION GALLERIES
            <span className="text-[24px] font-normal text-[#D67A1C]">→</span>
          </h2>
        </div>

        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            {filters.map((item) => (
              <button
                key={item}
                className="text-[14px] text-[#555] transition hover:text-black"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex gap-2 text-[18px] text-[#555]">
            <span>▦</span>
            <span>□</span>
            <span>□</span>
          </div>
        </div>

        <div className="grid auto-rows-[220px] grid-cols-1 gap-5 md:grid-cols-6">
          <div className="md:col-span-2">
            <img src={galleryImages[0]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-2">
            <img src={galleryImages[1]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-2">
            <img src={galleryImages[2]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-2">
            <img src={galleryImages[3]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-2">
            <img src={galleryImages[4]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-1">
            <img src={galleryImages[5]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-1">
            <img src={galleryImages[6]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-1">
            <img src={galleryImages[7]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-2">
            <img src={galleryImages[8]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-1">
            <img src={galleryImages[0]} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="md:col-span-2">
            <img src={galleryImages[1]} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InspirationGallery;