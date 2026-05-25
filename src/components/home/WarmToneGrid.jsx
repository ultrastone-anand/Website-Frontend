import { Link } from "react-router-dom"

const products = [
  {
    title: "BACCARA ROSE",
    slug: "baccara-rose",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
  },

  {
    title: "ARABESQUE GOLD",
    slug: "arabesque-gold",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },

  {
    title: "LUCCICOSO GOLD",
    slug: "luccicoso-gold",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858"
  },

  {
    title: "CREMA TAJ",
    slug: "crema-taj",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
  }
]

const WarmToneGrid = () => {
  return (
    <section
      id="collections"
      className="pb-32"
    >

      <div className="container-custom grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {products.map((product) => (

          <Link
            to={`/stone/${product.slug}`}
            key={product.slug}
            className="group"
          >

            <div className="overflow-hidden">

              <img
                src={product.image}
                alt=""
                className="h-[500px] w-full object-cover group-hover:scale-105 duration-700"
              />

            </div>

            <div className="pt-5">

              <h3 className="tracking-[4px] text-sm">
                {product.title}
              </h3>

            </div>

          </Link>

        ))}

      </div>

    </section>
  )
}

export default WarmToneGrid