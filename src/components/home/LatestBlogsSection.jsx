import { Link } from "react-router-dom";

const blogs = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
    date: "March 1st, 2025",
    category: "Installation",
    title:
      "Why Settle for Less? Explore the Hottest Quartz Worktop Trends with Ultra Stones",
  },

  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    date: "March 1st, 2025",
    category: "Remodeling",
    title:
      "Exotic Granite Colors Making a Comeback in Luxury Interiors",
  },

  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80",
    date: "March 1st, 2025",
    category: "3D Design, Remodeling",
    title:
      "Countertop Edges 101: The Key to Style and Functionality in Kitchens & Baths",
  },
];

const LatestBlogsSection = () => {
  return (
    <section className="py-24 bg-[#f5f5f5]">
      <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
        <div className="text-center mb-16">
          <p className="text-[#777] text-[15px] mb-2">
            Recent Updates
          </p>

          <h2 className="text-[38px] md:text-[52px] font-semibold text-[#161412]">
            Our Latest Blogs
          </h2>

          <div className="w-[90px] h-[4px] bg-[#c91f26] mx-auto mt-3" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to="/blogs"
              className="group"
            >
              <div className="overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="
                    w-full
                    h-[420px]
                    object-cover
                    duration-700
                    group-hover:scale-105
                  "
                />
              </div>

              <div className="pt-6">
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <span>{blog.date}</span>

                  <span className="text-[#777]">
                    {blog.category}
                  </span>
                </div>

                <h3
                  className="
                    text-[28px]
                    leading-tight
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
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;