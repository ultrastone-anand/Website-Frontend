import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const BLOGS_PER_PAGE = 6;

// ----------------------------------------------------------------------

const getHeaders = () => {
  const token =
    sessionStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};

// ----------------------------------------------------------------------

const getPublishedBlogs = async ({
  page = 1,
  limit = BLOGS_PER_PAGE,
}) => {
  const params = new URLSearchParams({
    status: "PUBLISHED",
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${API_URL}/blog?${params.toString()}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to fetch blog posts"
    );
  }

  return data;
};

// ----------------------------------------------------------------------

const normalizeBlog = (blog) => {
  const cover =
    blog.cover &&
      typeof blog.cover === "object"
      ? blog.cover
      : null;

  const coverUrl =
    cover?.url ||
    blog.cover_url ||
    blog.coverUrl ||
    "";

  const tags = Array.isArray(blog.tags)
    ? blog.tags
      .map((tag) => {
        if (typeof tag === "string") {
          return tag;
        }

        return tag?.name || "";
      })
      .filter(Boolean)
    : [];

  return {
    id: blog.id,
    slug: blog.slug || String(blog.id),
    title: blog.title || "Untitled Blog",
    description: blog.description || "",
    image: coverUrl,
    imageAlt:
      cover?.alt_text ||
      cover?.altText ||
      blog.title ||
      "Blog cover",
    date:
      blog.published_at ||
      blog.publishedAt ||
      blog.created_at ||
      blog.createdAt ||
      null,
    categories: tags,
  };
};

// ----------------------------------------------------------------------

const formatBlogDate = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
};

// ----------------------------------------------------------------------

export const Ourblogs = () => {
  const [blogs, setBlogs] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalBlogs, setTotalBlogs] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadBlogs = useCallback(
    async (page) => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response =
          await getPublishedBlogs({
            page,
            limit: BLOGS_PER_PAGE,
          });

        const blogData =
          Array.isArray(response.data)
            ? response.data.map(
              normalizeBlog
            )
            : [];

        const pagination =
          response.pagination || {};

        setBlogs(blogData);

        setTotalPages(
          Number(
            pagination.totalPages
          ) || 1
        );

        setTotalBlogs(
          Number(pagination.total) ||
          blogData.length
        );
      } catch (error) {
        console.error(
          "Failed to load blogs:",
          error
        );

        setBlogs([]);
        setTotalPages(1);
        setTotalBlogs(0);

        setErrorMessage(
          error.message ||
          "Unable to load blogs."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadBlogs(currentPage);
  }, [currentPage, loadBlogs]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((previousPage) =>
      Math.max(previousPage - 1, 1)
    );
  };

  const handleNextPage = () => {
    setCurrentPage((previousPage) =>
      Math.min(
        previousPage + 1,
        totalPages
      )
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const retryLoading = () => {
    loadBlogs(currentPage);
  };

  return (
    <>

      <main className="min-h-screen pt-[110px]">
        {/* Header */}
        <section>
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Our Blogs
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-3 mb-5" />

            <p className="text-[13px] text-[#777]">
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
                Resource Center
              </Link>

              {" / "}

              <span className="text-[#161412] font-semibold">
                Our Blogs
              </span>
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-14">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            {loading && (
              <BlogLoadingGrid />
            )}

            {!loading && errorMessage && (
              <div className="min-h-[380px] flex flex-col items-center justify-center text-center">
                <p className="text-[18px] font-medium text-[#161412]">
                  Unable to load blogs
                </p>

                <p className="mt-2 text-[14px] text-[#777]">
                  {errorMessage}
                </p>

                <button
                  type="button"
                  onClick={retryLoading}
                  className="mt-6 px-6 py-3 bg-[#161412] text-white text-[13px] uppercase tracking-[0.08em] hover:bg-[#c91f26] duration-300"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading &&
              !errorMessage &&
              blogs.length === 0 && (
                <div className="min-h-[380px] flex flex-col items-center justify-center text-center">
                  <p className="text-[20px] font-medium text-[#161412]">
                    No blogs available
                  </p>

                  <p className="mt-2 text-[14px] text-[#777]">
                    Published articles will
                    appear here.
                  </p>
                </div>
              )}

            {!loading &&
              !errorMessage &&
              blogs.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                    {blogs.map((blog) => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                      />
                    ))}
                  </div>

                  {totalBlogs > 0 &&
                    totalPages > 1 && (
                      <BlogPagination
                        currentPage={
                          currentPage
                        }
                        totalPages={
                          totalPages
                        }
                        onPrevious={
                          handlePreviousPage
                        }
                        onNext={
                          handleNextPage
                        }
                        onPageChange={
                          handlePageChange
                        }
                      />
                    )}
                </>
              )}
          </div>
        </section>
      </main>

    </>
  );
};

// ----------------------------------------------------------------------

function BlogCard({ blog }) {
  const categoryText =
    blog.categories.length > 0
      ? blog.categories.join(", ")
      : "Blog";

  return (
    <Link
  to={`/blog/${blog.slug || blog.id}`}
  className="group block"
>
      <div className="overflow-hidden rounded-sm bg-[#f2f2f2]">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.imageAlt}
            loading="lazy"
            decoding="async"
            className="
              w-full
              aspect-square
              object-cover
              duration-500
              group-hover:scale-105
            "
            onError={(event) => {
              event.currentTarget.src =
                "/assets/images/blog-placeholder.jpg";
            }}
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center bg-[#f2f2f2] text-[#999]">
            <span className="text-[14px]">
              No cover image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-6 text-[13px] text-[#666]">
        {blog.date && (
          <time dateTime={blog.date}>
            {formatBlogDate(blog.date)}
          </time>
        )}

        <span>{categoryText}</span>
      </div>

      <h2
        className="
          mt-3
          text-[22px]
          leading-[1.35]
          text-[#161412]
          group-hover:text-[#c91f26]
          duration-300
        "
        style={{
          fontFamily:
            '"Cormorant Garamond", serif',
        }}
      >
        {blog.title}
      </h2>

      {blog.description && (
        <p className="mt-3 text-[14px] leading-6 text-[#777] line-clamp-2">
          {blog.description}
        </p>
      )}
    </Link>
  );
}

// ----------------------------------------------------------------------

function BlogPagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onPageChange,
}) {
  const visiblePages =
    getVisiblePages(
      currentPage,
      totalPages
    );

  return (
    <nav
      aria-label="Blog pagination"
      className="flex flex-wrap items-center justify-center gap-2 mt-20"
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="
          px-4 py-2
          text-sm
          disabled:opacity-40
          disabled:cursor-not-allowed
          hover:text-[#c91f26]
          duration-300
        "
      >
        Previous
      </button>

      {visiblePages.map(
        (page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-sm text-[#777]"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              type="button"
              onClick={() =>
                onPageChange(page)
              }
              aria-current={
                currentPage === page
                  ? "page"
                  : undefined
              }
              className={`
                w-9 h-9
                flex items-center justify-center
                rounded-sm
                text-sm
                duration-300
                ${currentPage === page
                  ? "bg-[#161412] text-white"
                  : "text-[#161412] hover:text-[#c91f26]"
                }
              `}
            >
              {page}
            </button>
          );
        }
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={
          currentPage === totalPages
        }
        className="
          px-4 py-2
          text-sm
          disabled:opacity-40
          disabled:cursor-not-allowed
          hover:text-[#c91f26]
          duration-300
        "
      >
        Next Page
      </button>
    </nav>
  );
}

// ----------------------------------------------------------------------

function BlogLoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
      {Array.from({
        length: BLOGS_PER_PAGE,
      }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse"
        >
          <div className="w-full aspect-square bg-[#ececec] rounded-sm" />

          <div className="flex gap-4 mt-6">
            <div className="w-28 h-3 bg-[#ececec] rounded" />
            <div className="w-20 h-3 bg-[#ececec] rounded" />
          </div>

          <div className="w-full h-5 bg-[#ececec] rounded mt-4" />
          <div className="w-4/5 h-5 bg-[#ececec] rounded mt-2" />
          <div className="w-full h-3 bg-[#ececec] rounded mt-4" />
          <div className="w-3/4 h-3 bg-[#ececec] rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------

function getVisiblePages(
  currentPage,
  totalPages
) {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "...",
      totalPages,
    ];
  }

  if (
    currentPage >=
    totalPages - 3
  ) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export default Ourblogs;