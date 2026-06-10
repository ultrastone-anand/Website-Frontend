export function NewsletterSection() {
  return (
    <section className="bg-[#f3f3f3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <h2 className="text-5xl font-bold tracking-[8px] uppercase mb-6">
              Get Inspired With
              <br />
              Our Newsletter
            </h2>

            <p className="text-gray-700 text-lg">
              Discover innovative projects, unique colours and the latest
              news and trends
            </p>
          </div>

          {/* Right */}
          <form className="space-y-5">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full h-14 px-5 rounded bg-white border border-gray-200"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <label className="bg-white rounded h-14 px-5 flex items-center gap-3 border">
                <input type="radio" name="type" />
                I am a homeowner
              </label>

              <label className="bg-white rounded h-14 px-5 flex items-center gap-3 border">
                <input type="radio" name="type" />
                I am a professional
              </label>
            </div>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
              />

              <span>
                I agree to receive valuable content from Ultra Stones.
              </span>
            </label>

            <button
              type="submit"
              className="
                w-full
                h-14
                bg-red-600
                text-white
                uppercase
                tracking-wide
                font-medium
                hover:bg-red-700
                transition
              "
            >
              I Want To Subscribe →
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}