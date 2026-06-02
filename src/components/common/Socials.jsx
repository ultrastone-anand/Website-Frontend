const socials = [
  {
    name: "YouTube",
    icon: "/icons/socials/Youtube.svg",
    link: "https://www.youtube.com/@ultra-stones",
  },
  {
    name: "Facebook",
    icon: "/icons/socials/Facebook.svg",
    link: "https://www.facebook.com/Ultrastone1/",
  },
  {
    name: "Instagram",
    icon: "/icons/socials/Instagram.svg",
    link: "https://www.instagram.com/ultrastones/",
  },
  {
    name: "X",
    icon: "/icons/socials/X.svg",
    link: "https://x.com/ultrastones_usa",
  },
  {
    name: "Pintrest",
    icon: "/icons/socials/Pinterest.svg",
    link: "https://x.com",
  },
  {
    name: "Houzz",
    icon: "/icons/socials/Houz.svg",
    link: "https://www.houzz.in/hznb/professionals/tile-stone-and-countertops/ultra-stones-pfvwus-pf~760046721",
  },
];

export default function Social() {
  return (
    <div className="flex items-center gap-4">
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          className="group"
        >
          <img
  src={item.icon}
  alt={item.name}
  className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-110"
  style={{
    imageRendering: "crisp-edges",
  }}
/>
        </a>
      ))}
    </div>
  );
}