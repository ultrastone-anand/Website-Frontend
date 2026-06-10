import {
  Diamond,
  Headset,
  Wrench,
  Grid3X3,
  Leaf,
  Users,
} from "lucide-react";

const commitments = [
  {
    icon: Diamond,
    title: "Premium Quality Stone Selection",
    desc: "Our stones come from the most reputable quarries and manufacturers worldwide."
  },
  {
    icon: Headset,
    title: "Expert Guidance & Personalized Service",
    desc: "Knowledgeable teams help customers from stone selection to final purchase."
  },
  {
    icon: Wrench,
    title: "Customization and Tailored Solutions",
    desc: "Custom thicknesses, polished finishes and tailored stone solutions."
  },
  {
    icon: Grid3X3,
    title: "Extensive Real-Time Inventory",
    desc: "Over 600 colors across quartz, marble, quartzite and porcelain."
  },
  {
    icon: Leaf,
    title: "Commitment to Sustainability",
    desc: "Responsible sourcing and environmentally conscious practices."
  },
  {
    icon: Users,
    title: "Unparalleled Customer Experience",
    desc: "Dedicated support before, during and after every project."
  }
];

export default function CommitmentSection() {
  return (
    <section
      className="relative py-24"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=2000')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative max-w-7xl mx-auto px-6">
        <h2 className="text-white text-5xl font-bold mb-16 inline-block relative">
          Ultra Commitment

          <span className="absolute left-0 -bottom-3 h-1.5 w-44 bg-red-600" />
        </h2>

        <div className="grid lg:grid-cols-2 gap-x-20 gap-y-12">
          {commitments.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex gap-6"
              >
                <Icon
                  size={48}
                  className="text-white shrink-0"
                />

                <div>
                  <h3 className="text-white text-3xl font-semibold mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}