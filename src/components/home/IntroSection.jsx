import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IntroSection = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stones`
        );

        const result = response.data;

        if (result.success) {
          const activeCategories = result.data
            .filter((item) => item.is_active === true && item.parent_id === null)
            .sort((a, b) => {
              const orderA = a.display_order ?? 999;
              const orderB = b.display_order ?? 999;

              if (orderA !== orderB) return orderA - orderB;

              return a.name.localeCompare(b.name, undefined, {
                sensitivity: "base",
              });
            });

          setMaterials(activeCategories);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const visibleMaterials = showAll ? materials : materials.slice(0, 4);

  return (
    <section className="bg-white py-[110px]">
      <div className="mx-auto max-w-[1850px] px-6 xl:px-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div>
            <p
              className="flex items-center gap-5 text-[18px] font-bold uppercase tracking-[0.02em] text-[#111]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              OUR COLLECTION
              <span className="text-[32px] font-normal text-[#D67A1C]">
                →
              </span>
            </p>

            <h2
              className="mt-4 text-[45px] leading-[1.05] text-[#111]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              curated by nature.
              <br />
              chosen for you.
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <p
              className="max-w-[390px] text-left text-[16px] leading-[1.45] text-[#555] lg:text-right"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Explore our exclusive range of natural and engineered stones, each
              piece a masterpiece.
            </p>

            {materials.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="mt-8 border border-[#777] px-10 py-3 text-[16px] font-medium tracking-[0.02em] text-[#222] transition-all duration-300 hover:bg-black hover:text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {showAll ? "SHOW LESS" : "DISCOVER SPACES"}
                <span className="ml-3 text-[#FF8000]">→</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-[40px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-200" />
                <div className="mx-auto mt-6 h-5 w-24 bg-gray-200" />
                <div className="mx-auto mt-3 h-4 w-36 bg-gray-100" />
              </div>
            ))
            : visibleMaterials.map((item) => (
              <div key={item.id} className="group text-center" onClick={() =>
                navigate(`/product-category/${item.slug}`)
              }>
                <div className="overflow-hidden bg-gray-100">
                  <img
                    src={item.thumbnail_url}
                    alt={item.name}
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <h3
                  className="mt-6 text-[20px] font-semibold uppercase tracking-[0.03em] text-[#111]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {item.name}
                </h3>

                <p
                  className="mt-2 text-[15px] text-[#666]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.description || `${item.name} collection`}
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;