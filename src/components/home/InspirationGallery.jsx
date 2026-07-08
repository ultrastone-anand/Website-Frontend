// import { useState } from "react";
// import { Columns2, Grid2x2, Square } from "lucide-react";

// const filters = [
//   "All",
//   "Kitchens",
//   "Bathrooms",
//   "Other Interiors",
//   "Outdoor",
//   "Facades",
//   "Commercial",
// ];

// const galleryImages = [
//   "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
// ];

// const shouldScroll = galleryImages.length > 4;


// const InspirationGallery = () => {
//   const [layout, setLayout] = useState("grid"); // grid | two | one

//   const iconClass = (type) =>
//     `cursor-pointer transition-colors duration-200 ${
//       layout === type ? "text-black" : "text-[#666] hover:text-black"
//     }`;

//   return (
//     <section className="bg-white py-[42px]">
//       <div className="mx-auto max-w-[1850px] px-6 xl:px-[52px]">
//         <div className="mb-11 flex items-center justify-between">
//           <h2
//             className="flex items-center gap-7 text-[18px] font-bold uppercase text-[#111] md:text-[22px]"
//             style={{ fontFamily: "Montserrat, sans-serif" }}
//           >
//             INSPIRATION GALLERIES
//             <span className="cursor-pointer text-[24px] font-normal text-[#FF8000] transition-colors duration-300 hover:text-[#8D8D8D]">
//               &rarr;
//             </span>
//           </h2>
//         </div>

//         <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
//           <div className="flex flex-wrap gap-x-12 gap-y-4">
//             {filters.map((item) => (
//               <button
//                 key={item}
//                 className="text-[14px] text-[#555] transition hover:text-black"
//                 style={{ fontFamily: "Inter, sans-serif" }}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>

//           <div className="flex items-center gap-3">
//             <Grid2x2
//               size={18}
//               onClick={() => setLayout("grid")}
//               className={iconClass("grid")}
//             />

//             <Columns2
//               size={18}
//               onClick={() => setLayout("two")}
//               className={iconClass("two")}
//             />

//             <Square
//               size={18}
//               onClick={() => setLayout("one")}
//               className={iconClass("one")}
//             />
//           </div>
//         </div>

//        {/* 4x4 Masonry Grid */}
// {/* Masonry Grid like reference */}
// {layout === "grid" && (
//   <div className="overflow-x-auto overflow-y-hidden">
//     <div
//       className="grid grid-flow-col grid-rows-3 gap-5 w-max"
//       style={{
//         gridAutoColumns: "320px", // Width of each image
//       }}
//     >
//       {galleryImages.map((image, index) => (
//         <div
//           key={index}
//           className="h-[240px] w-[320px] overflow-hidden"
//         >
//           <img
//             src={image}
//             alt=""
//             className="h-full w-full object-cover transition duration-500 hover:scale-105"
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// )}

// {/* 2 Column & Single View (Horizontal Scroll) */}
// {layout !== "grid" && (
//   <div className="overflow-x-auto">
//     <div className="flex flex-nowrap gap-5 pb-2">
//       {galleryImages.map((image, index) => (
//         <div
//           key={index}
//           className={`flex-shrink-0 ${
//             layout === "two"
//               ? "w-[calc(50vw-60px)] h-[520px]"
//               : "w-[calc(100vw-120px)] h-[650px]"
//           }`}
//         >
//           <img
//             src={image}
//             alt=""
//             className="h-full w-full object-cover"
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// )}
//       </div>
//     </section>
//   );
// };

// export default InspirationGallery;



import { useEffect, useMemo, useState } from "react";
import { Columns2, Grid2x2, Square } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const InspirationGallery = () => {
  const [layout, setLayout] = useState("grid");
  const [activeFilter, setActiveFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const [categoryRes, imageRes] = await Promise.all([
          fetch(`${API_URL}/inspiration-gallery/categories`),
          fetch(`${API_URL}/inspiration-gallery/images`),
        ]);

        const categoryData = await categoryRes.json();
        const imageData = await imageRes.json();

        setCategories(categoryData.data || []);
        setGalleryImages(imageData.data || []);
      } catch (error) {
        console.error("Failed to fetch inspiration gallery:", error);
      }
    };

    fetchGalleryData();
  }, []);

  const filters = useMemo(
    () => ["All", ...categories.map((category) => category.name)],
    [categories]
  );

  const filteredImages = useMemo(() => {
    if (activeFilter === "All") {
      return galleryImages;
    }

    return galleryImages.filter(
      (image) => image.inspiration_gallery_categories?.name === activeFilter
    );
  }, [activeFilter, galleryImages]);

  const iconClass = (type) =>
    `cursor-pointer transition-colors duration-200 ${
      layout === type ? "text-black" : "text-[#666] hover:text-black"
    }`;

  const getImageCardClass = () => {
    if (layout === "two") {
      return "w-[calc(50vw-60px)] h-[520px]";
    }

    if (layout === "one") {
      return "w-[calc(100vw-120px)] h-[650px]";
    }

    return "";
  };

  return (
    <section className="bg-white py-[42px]">
      <div className="mx-auto max-w-[1850px] px-6 xl:px-[52px]">
        <div className="mb-11 flex items-center justify-between">
          <h2
            className="flex items-center gap-7 text-[18px] font-bold uppercase text-[#111] md:text-[22px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            INSPIRATION GALLERIES
            <span className="cursor-pointer text-[24px] font-normal text-[#FF8000] transition-colors duration-300 hover:text-[#8D8D8D]">
              &rarr;
            </span>
          </h2>
        </div>

        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
{filters.map((item) => (
  <button
    key={item}
    type="button"
    onClick={() => setActiveFilter(item)}
    className="group relative pb-2 text-[14px]"
    style={{ fontFamily: "Inter, sans-serif" }}
  >
    <span
      className={`transition-colors duration-300 ${
        activeFilter === item
          ? "text-black"
          : "text-[#555] group-hover:text-black"
      }`}
    >
      {item}
    </span>

    <span
      className={`absolute bottom-0 left-0 h-[1.5px] bg-black transition-all duration-300 ${
        activeFilter === item ? "w-full" : "w-0 group-hover:w-full"
      }`}
    />
  </button>
))}
          </div>

          <div className="flex items-center gap-3">
            <Grid2x2
              size={18}
              onClick={() => setLayout("grid")}
              className={iconClass("grid")}
            />

            <Columns2
              size={18}
              onClick={() => setLayout("two")}
              className={iconClass("two")}
            />

            <Square
              size={18}
              onClick={() => setLayout("one")}
              className={iconClass("one")}
            />
          </div>
        </div>

        {layout === "grid" && (
          <div className="min-h-[760px]">
            {filteredImages.length > 0 && (
              <div className="overflow-x-auto overflow-y-hidden">
                <div
                  className="grid w-max grid-flow-col grid-rows-3 gap-5"
                  style={{
                    gridAutoColumns: "320px",
                  }}
                >
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className="h-[240px] w-[320px] cursor-pointer overflow-hidden"
                    >
                      <img
                        src={image.image_url}
                        alt={image.image_alt || image.title || ""}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredImages.length === 0 && (
              <div className="flex h-[760px] items-center justify-center rounded border border-[#ECECEC] bg-[#FAFAFA]">
                <div className="text-center">
                  <p className="text-[18px] font-medium text-[#222]">
                    No inspiration images found
                  </p>
                  <p className="mt-2 text-[14px] text-[#888]">
                    Images for this category will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {layout !== "grid" && (
          <div className="min-h-[700px]">
            {filteredImages.length > 0 && (
              <div className="overflow-x-auto">
                <div className="flex flex-nowrap gap-5 pb-2">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`flex-shrink-0 cursor-pointer ${getImageCardClass()}`}
                    >
                      <img
                        src={image.image_url}
                        alt={image.image_alt || image.title || ""}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredImages.length === 0 && (
              <div className="flex h-[700px] items-center justify-center rounded border border-[#ECECEC] bg-[#FAFAFA]">
                <div className="text-center">
                  <p className="text-[18px] font-medium text-[#222]">
                    No inspiration images found
                  </p>
                  <p className="mt-2 text-[14px] text-[#888]">
                    Images for this category will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-5"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-5 text-4xl font-light text-white transition hover:text-[#FF8000]"
          >
            ×
          </button>

          <img
            src={selectedImage.image_url}
            alt={selectedImage.image_alt || selectedImage.title || ""}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default InspirationGallery;