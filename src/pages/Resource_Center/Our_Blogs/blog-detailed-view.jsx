import PropTypes from "prop-types";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";


const API_URL =
  import.meta.env.VITE_API_URL;

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

const getBlogById = async (
  blogId
) => {
  const response = await fetch(
    `${API_URL}/blog/${blogId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to load blog post"
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

    title:
      blog.title ||
      "Untitled Blog",

    slug:
      blog.slug || "",

    description:
      blog.description || "",

    content:
      blog.content || "",

    cover:
      coverUrl,

    coverAlt:
      cover?.alt_text ||
      cover?.altText ||
      blog.title ||
      "Blog cover image",

    tags,

    status:
      blog.status || "DRAFT",

    publishedAt:
      blog.published_at ||
      blog.publishedAt ||
      blog.created_at ||
      blog.createdAt ||
      null,

    metaTitle:
      blog.meta_title ||
      blog.metaTitle ||
      blog.title ||
      "",

    metaDescription:
      blog.meta_description ||
      blog.metaDescription ||
      blog.description ||
      "",
  };
};

// ----------------------------------------------------------------------

const formatBlogDate = (
  dateValue
) => {
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

export default function BlogDetailedView() {
  const { blogId } = useParams();

  const [blog, setBlog] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const loadBlog =
    useCallback(async () => {
      if (!blogId) {
        setErrorMessage(
          "Blog ID is missing."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        const response =
          await getBlogById(blogId);

        setBlog(
          normalizeBlog(response.data)
        );
      } catch (error) {
        console.error(
          "Failed to load blog:",
          error
        );

        setBlog(null);

        setErrorMessage(
          error.message ||
            "Unable to load this blog post."
        );
      } finally {
        setLoading(false);
      }
    }, [blogId]);

  useEffect(() => {
    loadBlog();
  }, [loadBlog]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [blogId]);

  useEffect(() => {
    if (!blog) {
      return undefined;
    }

    const previousTitle =
      document.title;

    document.title =
      blog.metaTitle ||
      blog.title;

    let metaDescription =
      document.querySelector(
        'meta[name="description"]'
      );

    const previousDescription =
      metaDescription?.getAttribute(
        "content"
      );

    let createdMetaDescription =
      false;

    if (!metaDescription) {
      metaDescription =
        document.createElement("meta");

      metaDescription.setAttribute(
        "name",
        "description"
      );

      document.head.appendChild(
        metaDescription
      );

      createdMetaDescription = true;
    }

    metaDescription.setAttribute(
      "content",
      blog.metaDescription ||
        blog.description ||
        ""
    );

    return () => {
      document.title = previousTitle;

      if (
        createdMetaDescription &&
        metaDescription
      ) {
        metaDescription.remove();

        return;
      }

      if (
        metaDescription &&
        previousDescription !== null
      ) {
        metaDescription.setAttribute(
          "content",
          previousDescription || ""
        );
      }
    };
  }, [blog]);

  return (
    <>

      <main className="min-h-screen bg-white pt-[90px]">
        {loading && (
          <BlogDetailsLoading />
        )}

        {!loading &&
          errorMessage && (
            <BlogErrorState
              message={errorMessage}
              onRetry={loadBlog}
            />
          )}

        {!loading &&
          !errorMessage &&
          blog && (
            <BlogArticle blog={blog} />
          )}
      </main>

    </>
  );
}

// ----------------------------------------------------------------------

function BlogArticle({ blog }) {
  const formattedDate =
    formatBlogDate(
      blog.publishedAt
    );


  return (
    <article className="bg-white">
      {/* Hero */}
      <section
        className="
          relative
          min-h-[360px]
          md:min-h-[430px]
          lg:min-h-[500px]
          overflow-hidden
          bg-[#161412]
        "
      >
        {blog.cover ? (
          <img
            src={blog.cover}
            alt={blog.coverAlt}
            loading="eager"
            decoding="async"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#2f2b27]
              via-[#171513]
              to-black
            "
          />
        )}

        <div
          className="
            absolute
            inset-0
            bg-black/55
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[360px]
            max-w-[1180px]
            items-center
            px-6
            py-16
            md:min-h-[430px]
            md:px-10
            lg:min-h-[500px]
          "
        >
          <div
            className="
              w-full
              max-w-[520px]
              lg:ml-[8%]
            "
          >
            {blog.tags.length > 0 && (
              <div
                className="
                  mb-4
                  flex
                  flex-wrap
                  gap-x-3
                  gap-y-1
                "
              >
                {blog.tags.map(
                  (tag) => (
                    <span
                      key={tag}
                      className="
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-white/75
                      "
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            )}

            <h1
              className="
                max-w-[500px]
                text-[26px]
                font-semibold
                leading-[1.35]
                text-white
                md:text-[34px]
                lg:text-[40px]
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              {blog.title}
            </h1>

            {formattedDate && (
              <time
                dateTime={
                  blog.publishedAt
                }
                className="
                  mt-5
                  block
                  text-[12px]
                  text-white/70
                "
              >
                {formattedDate}
              </time>
            )}
          </div>
        </div>

      </section>

      {/* Main content */}
      <section
        className="
          px-6
          py-12
          md:py-16
          lg:py-20
        "
      >
        <div
          className="
            mx-auto
            max-w-[620px]
          "
        >
          {blog.description && (
            <p
              className="
                mb-9
                text-[14px]
                font-normal
                leading-[1.75]
                text-[#55514d]
                md:text-[15px]
              "
            >
              {blog.description}
            </p>
          )}

<hr className="mb-10"/>

          <div
            className="
              blog-content

              text-[14px]
              leading-[1.8]
              text-[#3f3d3a]

              [&_p]:mb-5
              [&_p]:text-[14px]
              [&_p]:leading-[1.8]
              [&_p]:text-[#3f3d3a]

              [&_h1]:mb-5
              [&_h1]:mt-10
              [&_h1]:text-[38px]
              [&_h1]:font-bold
              [&_h1]:leading-[1.15]
              [&_h1]:text-[#202831]

              [&_h2]:mb-5
              [&_h2]:mt-9
              [&_h2]:text-[30px]
              [&_h2]:font-bold
              [&_h2]:leading-[1.2]
              [&_h2]:text-[#202831]

              [&_h3]:mb-4
              [&_h3]:mt-8
              [&_h3]:text-[23px]
              [&_h3]:font-bold
              [&_h3]:leading-[1.3]
              [&_h3]:text-[#202831]

              [&_h4]:mb-3
              [&_h4]:mt-7
              [&_h4]:text-[18px]
              [&_h4]:font-bold
              [&_h4]:text-[#202831]

              [&_h5]:mb-3
              [&_h5]:mt-6
              [&_h5]:text-[15px]
              [&_h5]:font-bold
              [&_h5]:text-[#202831]

              [&_h6]:mb-3
              [&_h6]:mt-6
              [&_h6]:text-[13px]
              [&_h6]:font-bold
              [&_h6]:text-[#202831]

              [&_strong]:font-bold
              [&_strong]:text-[#202831]

              [&_em]:italic

              [&_a]:text-[#00a878]
              [&_a]:underline
              [&_a]:underline-offset-2
              hover:[&_a]:text-[#c91f26]

              [&_ul]:mb-6
              [&_ul]:list-disc
              [&_ul]:pl-6

              [&_ol]:mb-6
              [&_ol]:list-decimal
              [&_ol]:pl-6

              [&_li]:mb-2
              [&_li]:pl-1
              [&_li]:leading-[1.75]

              [&_blockquote]:my-8
              [&_blockquote]:border-l-4
              [&_blockquote]:border-[#00a878]
              [&_blockquote]:bg-[#f5f7f6]
              [&_blockquote]:px-6
              [&_blockquote]:py-5
              [&_blockquote]:text-[18px]
              [&_blockquote]:italic
              [&_blockquote]:leading-[1.65]
              [&_blockquote]:text-[#4b4b4b]

              [&_hr]:my-8
              [&_hr]:border-0
              [&_hr]:border-t
              [&_hr]:border-[#dedede]

              [&_img]:my-8
              [&_img]:h-auto
              [&_img]:max-h-[700px]
              [&_img]:w-full
              [&_img]:object-contain

              [&_pre]:my-7
              [&_pre]:overflow-x-auto
              [&_pre]:rounded-sm
              [&_pre]:bg-[#202831]
              [&_pre]:p-5
              [&_pre]:text-[13px]
              [&_pre]:leading-6
              [&_pre]:text-white

              [&_code]:rounded-sm
              [&_code]:bg-[#f1f1f1]
              [&_code]:px-1.5
              [&_code]:py-0.5
              [&_code]:text-[13px]

              [&_pre_code]:bg-transparent
              [&_pre_code]:p-0
              [&_pre_code]:text-white

              md:[&_h1]:text-[42px]
              md:[&_h2]:text-[32px]
              md:[&_h3]:text-[24px]
            "
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          />

          <div
            className="
              mt-14
              border-t
              border-[#e5e5e5]
              pt-8
            "
          >
            <Link
              to="/blogs"
              className="
                inline-flex
                items-center
                gap-3
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-[#202831]
                transition-colors
                duration-300
                hover:text-[#c91f26]
              "
            >
              <span
                aria-hidden="true"
                className="text-[18px]"
              >
                ←
              </span>

              Back to all blogs
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

// ----------------------------------------------------------------------

function BlogDetailsLoading() {
  return (
    <div className="animate-pulse">
      <div
        className="
          min-h-[360px]
          bg-[#dedede]
          md:min-h-[430px]
          lg:min-h-[500px]
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[360px]
            max-w-[1180px]
            items-center
            px-6
            md:min-h-[430px]
            md:px-10
            lg:min-h-[500px]
          "
        >
          <div
            className="
              w-full
              max-w-[500px]
              lg:ml-[8%]
            "
          >
            <div className="h-3 w-32 rounded bg-white/30" />

            <div className="mt-5 h-8 w-full rounded bg-white/35" />

            <div className="mt-3 h-8 w-4/5 rounded bg-white/35" />

            <div className="mt-6 h-3 w-28 rounded bg-white/30" />
          </div>
        </div>
      </div>

      <div
        className="
          mx-auto
          max-w-[620px]
          px-6
          py-16
        "
      >
        <div className="h-3 w-full rounded bg-[#ececec]" />

        <div className="mt-3 h-3 w-5/6 rounded bg-[#ececec]" />

        <div className="mt-10 h-10 w-3/5 rounded bg-[#ececec]" />

        {Array.from({
          length: 10,
        }).map((_, index) => (
          <div
            key={index}
            className="
              mt-4
              h-3
              w-full
              rounded
              bg-[#ececec]
            "
          />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

function BlogErrorState({
  message,
  onRetry,
}) {
  return (
    <section
      className="
        flex
        min-h-[650px]
        items-center
        justify-center
        px-6
      "
    >
      <div
        className="
          max-w-[600px]
          text-center
        "
      >
        <p
          className="
            text-[36px]
            font-semibold
            text-[#202831]
          "
        >
          Blog not available
        </p>

        <p
          className="
            mt-4
            text-[14px]
            leading-6
            text-[#777]
          "
        >
          {message}
        </p>

        <div
          className="
            mt-8
            flex
            flex-wrap
            justify-center
            gap-3
          "
        >
          <button
            type="button"
            onClick={onRetry}
            className="
              bg-[#202831]
              px-6
              py-3
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-white
              transition-colors
              duration-300
              hover:bg-[#c91f26]
            "
          >
            Try Again
          </button>

          <Link
            to="/blogs"
            className="
              border
              border-[#202831]
              px-6
              py-3
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#202831]
              transition-colors
              duration-300
              hover:bg-[#202831]
              hover:text-white
            "
          >
            All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------

BlogArticle.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    title: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.string,
    cover: PropTypes.string,
    coverAlt: PropTypes.string,
    publishedAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    tags: PropTypes.arrayOf(
      PropTypes.string
    ),
  }).isRequired,
};

BlogErrorState.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
};

BlogErrorState.defaultProps = {
  message:
    "Unable to load this blog post.",
};