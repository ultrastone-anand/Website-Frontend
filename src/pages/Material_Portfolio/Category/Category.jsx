import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import Loading from '../../../components/common/Loading';

export default function Category() {
    const navigate = useNavigate();

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/stones`
                );

                const result = response.data;

                if (result.success) {
                    const activeCategories =
                        result.data
                            .filter(
                                (item) =>
                                    item.is_active === true &&
                                    item.parent_id === null
                            )
                            .sort(
                                (a, b) =>
                                    (a.display_order || 999) -
                                    (b.display_order || 999)
                            );

                    setMaterials(activeCategories);
                }
            } catch (error) {
                console.error(
                    'Error fetching materials:',
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    if (loading) {
        return (
            <div
                className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#f3f3f3]
        "
            >
                <Loading />
            </div>
        );
    }

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
                                fontFamily:
                                    'Montserrat, sans-serif',
                            }}
                        >
                            Material Portfolio
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
                                fontFamily:
                                    'Montserrat, sans-serif',
                            }}
                        >
                            Home /{' '}
                            <span className="text-[#161412]">
                                <b>Material Portfolio</b>
                            </span>
                        </p>

                        <p
                            className="
                text-[13px]
                text-[#777]
                mt-3
              "
                            style={{
                                fontFamily:
                                    'Montserrat, sans-serif',
                            }}
                        >
                            Showing all{' '}
                            {materials.length} categories
                        </p>
                    </div>
                </section>

                {/* CATEGORIES */}

                <section
                    className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
            pt-12
            pb-24
          "
                >
                    <div
                        className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
                    >
                        {materials.map((item) => (
<div
  key={item.id}
  onClick={() => navigate(`/product-category/${item.slug}`)}
  className="group cursor-pointer"
>
  <div
    className="
      relative
      overflow-hidden
      rounded-2xl
      aspect-[3/4]
      bg-neutral-200
    "
  >
    <img
      src={
        item.thumbnail_url ||
        item.banner_url ||
        '/placeholder.jpg'
      }
      alt={item.name}
      className="
        w-full
        h-full
        object-cover
        transition-all
        duration-700
        group-hover:scale-110
      "
    />

    <div
      className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black/75
        via-black/10
        to-transparent
      "
    />

    <div className="absolute bottom-3 left-3 right-3">
      <h2
        className="
          text-white
          text-[11px]
          md:text-[12px]
          font-medium
          uppercase
          tracking-[2px]
        "
      >
        {item.name}
      </h2>
    </div>
  </div>
</div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}