import axios from "axios";

import { useEffect, useMemo, useState } from "react";

import { Link, useParams, useNavigate, } from "react-router-dom";

import Loading from "../../../components/common/Loading";
import { getOptimizedImageUrl } from "../../../utils/Mediahelper";

const ProductCategory = () => {

  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");

  useEffect(() => {

    fetchCategory();

  }, [slug]);

  const fetchCategory = async () => {

    try {

      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/stones/${slug}`
        );

      const result = response.data;

      if (result.success) {

        setCategory(result.category);

        setProducts(result.products);

      }

    } catch (error) {

      console.error(error);

    }

  };

  const patternOptions = useMemo(() => {

    return [
      ...new Set(
        products
          .map((item) => item.pattern)
          .filter(Boolean)
      ),
    ];

  }, [products]);

  const groupOptions = useMemo(() => {

    return [
      ...new Set(
        products
          .map((item) => item.stone_group)
          .filter(Boolean)
      ),
    ];

  }, [products]);

  const filteredProducts = products
    .filter((item) => {
      const patternMatch =
        !selectedPattern ||
        item.pattern === selectedPattern;

      const groupMatch =
        !selectedGroup ||
        item.stone_group === selectedGroup;

      const searchMatch =
        !searchQuery ||
        item.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return (
        patternMatch &&
        groupMatch &&
        searchMatch &&
        item.is_active &&
        item.is_published
      );
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name)
    );

  if (!category) {

    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        
        "
      >
        <Loading />
      </div>
    );

  }


  return (
    <>
      <div
        className="
        
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

            {/* MATERIAL TITLE */}

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
                  "Montserrat, sans-serif",
              }}
            >
              {category.name}
            </h1>

            {/* RED LINE */}

            <div
              className="
              w-[70px]
              h-[4px]
              bg-[#c91f26]
              mt-4
              mb-4
              "
            />

            {/* BREADCRUMB */}

            <p
              className="
                        text-[13px]
                        text-[#777]
                        "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              <Link
                to="/"
                className="
                          hover:text-[#161412]
                          duration-300
                          "
              >
                Home
              </Link>

              {" / "}

              <Link
                to="/categories"
                className="
                          hover:text-[#161412]
                          duration-300
                          "
              >
                Material Portfolio
              </Link>

              {" / "}

              <span className="text-[#161412]">
                <b>{category.name}</b>
              </span>
            </p>

            {/* RESULT */}

            <p
              className="
              text-[13px]
              text-[#777]
              mt-3
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Showing all{" "}

              {filteredProducts.length} results
            </p>

          </div>

        </section>

        {/* FILTERS */}

        <section
          className="
          max-w-[1650px]
          mx-auto
          px-6
          xl:px-10
          mt-12
          "
        >

          <div
            className="
                      flex
                      flex-wrap
                      items-center
                      justify-center
                      gap-4
                      "
          >

            {/* SEARCH */}

            <div
              className="
    relative
    "
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder={`Search ${category.name}...`}
                className="
      h-[50px]
      w-[230px]
      border
      border-[#d9d9d9]
      px-5
      uppercase
      tracking-[2px]
      text-[11px]
      outline-none
      duration-300
      bg-white
      text-[#777]
      placeholder:text-[#777]
      "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              />
            </div>


            {/* COLOR BUTTON */}

            <button
              className={`
    h-[50px]
    w-[230px]
    border
    px-5
    uppercase
    tracking-[2px]
    text-[11px]
    flex
    items-center
    justify-between
    duration-300

    ${selectedColor
                  ? `
          bg-black
          text-white
          border-black
          `
                  : `
          bg-white
          text-[#777]
          border-[#d9d9d9]
          `
                }
    `}
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >

              <span>
                Filter By Color (0)
              </span>

              <span className="text-[9px] mt-[1px]">
                ▼
              </span>

            </button>

            {/* SORT / PATTERN */}

            <div className="relative">

              <select
                value={selectedPattern}
                onChange={(e) =>
                  setSelectedPattern(
                    e.target.value
                  )
                }
                className={`
      h-[50px]
      w-[230px]
      border
      px-5
      pr-10
      uppercase
      tracking-[2px]
      text-[11px]
      appearance-none
      outline-none
      cursor-pointer
      duration-300

      ${selectedPattern
                    ? `
            bg-black
            text-white
            border-black
            `
                    : `
            bg-white
            text-[#777]
            border-[#d9d9d9]
            `
                  }
      `}
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >

                <option value="">
                  Sort By
                </option>

                {patternOptions.map(
                  (pattern) => (
                    <option
                      key={pattern}
                      value={pattern}
                    >
                      {pattern}
                    </option>
                  )
                )}

              </select>

              <span
                className={`
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-[9px]
      pointer-events-none

      ${selectedPattern
                    ? "text-white"
                    : "text-[#777]"
                  }
      `}
              >
                ▼
              </span>

            </div>

            {/* GROUP */}

            <div className="relative">

              <select
                value={selectedGroup}
                onChange={(e) =>
                  setSelectedGroup(
                    e.target.value
                  )
                }
                className={`
      h-[50px]
      w-[230px]
      border
      px-5
      pr-10
      uppercase
      tracking-[2px]
      text-[11px]
      appearance-none
      outline-none
      cursor-pointer
      duration-300

      ${selectedGroup
                    ? `
            bg-black
            text-white
            border-black
            `
                    : `
            bg-white
            text-[#777]
            border-[#d9d9d9]
            `
                  }
      `}
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >

                <option value="">
                  Filter By Group
                </option>

                {groupOptions.map(
                  (group) => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group}
                    </option>
                  )
                )}

              </select>

              <span
                className={`
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-[9px]
      pointer-events-none

      ${selectedGroup
                    ? "text-white"
                    : "text-[#777]"
                  }
      `}
              >
                ▼
              </span>

            </div>


          </div>

          {/* ACTIVE FILTERS */}

          {(selectedPattern ||
            selectedGroup) && (

              <div
                className="
              flex
              items-center
              justify-between
              mt-8
              "
              >

                <div className="flex gap-3">

                  {selectedPattern && (
                    <div
                      className="
                    h-[30px]
                    px-3
                    border
                    border-[#ddd]
                    bg-white
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    uppercase
                    tracking-[1px]
                    text-[#777]
                    "
                    >
                      {selectedPattern}

                      <button
                        onClick={() =>
                          setSelectedPattern("")
                        }
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {selectedGroup && (
                    <div
                      className="
                    h-[30px]
                    px-3
                    border
                    border-[#ddd]
                    bg-white
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    uppercase
                    tracking-[1px]
                    text-[#777]
                    "
                    >
                      {selectedGroup}

                      <button
                        onClick={() =>
                          setSelectedGroup("")
                        }
                      >
                        ×
                      </button>
                    </div>
                  )}

                </div>

                {/* CLEAR */}

                <button
                  onClick={() => {

                    setSelectedPattern("");

                    setSelectedGroup("");

                  }}
                  className="
                text-[11px]
                uppercase
                tracking-[1px]
                text-[#9a9a9a]
                underline
                "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  Clear Filters
                </button>

              </div>

            )}

        </section>

        {/* PRODUCTS */}

        <section
          className="
          max-w-[1650px]
          mx-auto
          px-6
          xl:px-10
          pt-10
          pb-24
          "
        >

          <div
            className="
            grid
            grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-x-6
            gap-y-10
            "
          >

            {filteredProducts.map(
              (item) => (

                <div
                  key={item.id}
                  onClick={() =>
                    navigate(
                      `/product/${category.slug}/${item.slug}`
                    )
                  }
                  className="
                  group
                  cursor-pointer
                  "
                >

                  {/* IMAGE */}

                  <Link
                    to={`/product/${category.slug}/${item.slug}`}
                    className="group block">
                    <div
                      className="
                    overflow-hidden
                    bg-[#eaeaea]
                    aspect-square
                    "
                    >

                    <img
                      src={
                        item.closeup_image
                          ? getOptimizedImageUrl(item.closeup_image, 700, 85)
                          : "https://placehold.co/700x700"
                      }
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="
                        w-full
                        h-full
                        object-cover
                        duration-700
                        group-hover:scale-[1.02]
                      "
                    />

                    </div>

                    {/* TITLE */}

                    <h2
                      className="
                    mt-4
                    text-[15px]
                    font-semibold
                    text-[#161412]
                    border-b
                    border-[#1f1f1f]
                    pb-1
                    inline-block
                    "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {item.name}
                    </h2>

                    {/* DESCRIPTION */}

                    <p
                      className="
                    mt-3
                    text-[11px]
                    leading-[1.65]
                    text-[#8a8a8a]
                    line-clamp-4
                    "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {item.small_description}
                    </p>

                  </Link>

                </div>

              )
            )}

          </div>

        </section>

      </div>

    </>
  );
};

export default ProductCategory;