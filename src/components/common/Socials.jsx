import { useEffect, useState } from "react";
import axios from "axios";

const socialIcons = {
  youtube: "/icons/socials/Youtube.svg",
  facebook: "/icons/socials/Facebook.svg",
  instagram: "/icons/socials/Instagram.svg",
  twitter: "/icons/socials/X.svg",
  pinterest: "/icons/socials/Pinterest.svg",
  houzz: "/icons/socials/Houz.svg",
};

export default function Social() {
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSocials = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/company/socialmedia`
      );

      if (response.data.success) {
        const activeSocials = (response.data.data || [])
          .filter((item) => item.is_active)
          .sort(
            (a, b) =>
              a.display_order -
              b.display_order
          );

        setSocials(activeSocials);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  if (loading) return null;

  return (
    <div className="flex items-center gap-4">
      {socials.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.platform}
          className="group"
        >
          <img
            src={
              socialIcons[
                item.platform
              ]
            }
            alt={item.platform}
            className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-110"
            style={{
              imageRendering:
                "crisp-edges",
            }}
          />
        </a>
      ))}
    </div>
  );
}