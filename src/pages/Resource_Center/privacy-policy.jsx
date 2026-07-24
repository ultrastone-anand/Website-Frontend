import React, {
  useState,
  useEffect,
} from "react";

import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";

import Loading from "../../components/common/Loading";

// ----------------------------------------------------------------------

const PrivacyPolicy = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/pages/privacy-policy`
        );

        const result = response.data;

        if (result.success) {
          setPage(result.data);
        }
      } catch (error) {
        console.error(
          "Error fetching Privacy Policy page:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

if (loading) {
  return (
      <Loading />
  );
}

  if (!page) {
    return (
      <>

        <div className="min-h-screen pt-[110px] flex items-center justify-center">
          Page not found
        </div>

      </>
    );
  }

  const content = page.content || {};

  const sections = Array.isArray(content.sections)
    ? content.sections
    : [];

  const navigationItems = sections
    .filter(
      (section) =>
        section.showInNavigation !== false &&
        section.anchor &&
        (section.navigationLabel || section.title)
    )
    .map((section) => ({
      id: section.anchor,
      label:
        section.navigationLabel ||
        section.title,
    }));

  const formattedUpdatedDate = page.updated_at
    ? new Date(page.updated_at).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )
    : null;

  return (
    <>
      <main className="min-h-screen bg-white pt-[110px]">
        {/* HEADER */}
        <section>
          <div className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <h1
              className="text-[34px] font-semibold text-[#161412] md:text-[42px]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              {content.pageHeader?.heading ||
                page.title ||
                "Privacy Policy"}
            </h1>

            <div className="mb-5 mt-3 h-[4px] w-[70px] bg-[#c91f26]" />

            <p
              className="text-[13px] text-[#777]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              <Link
                to="/"
                className="duration-300 hover:text-[#161412]"
              >
                Home
              </Link>

              {" / "}

              <span className="font-semibold text-[#161412]">
                {content.pageHeader
                  ?.breadcrumbLabel ||
                  content.pageHeader?.heading ||
                  page.title ||
                  "Privacy Policy"}
              </span>
            </p>
          </div>
        </section>

        {/* PRIVACY POLICY CONTENT */}
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[250px_minmax(0,950px)] lg:justify-center lg:gap-16">
              <PrivacyNavigation
                items={navigationItems}
              />

              <article className="min-w-0">
                {formattedUpdatedDate && (
                  <p className="mb-10 text-[14px] font-medium text-[#777]">
                    Last updated:{" "}
                    {formattedUpdatedDate}
                  </p>
                )}

                {sections.length > 0 ? (
                  sections.map(
                    (section, sectionIndex) => (
                      <PrivacySection
                        key={
                          section.id ||
                          `${section.anchor}-${sectionIndex}`
                        }
                        id={
                          section.anchor ||
                          `section-${sectionIndex}`
                        }
                        title={section.title}
                        showBorder={
                          section.showDivider !== false
                        }
                      >
                        {(section.blocks || []).map(
                          (block, blockIndex) => (
                            <ContentBlock
                              key={
                                block.id ||
                                `${sectionIndex}-${blockIndex}`
                              }
                              block={block}
                            />
                          )
                        )}
                      </PrivacySection>
                    )
                  )
                ) : (
                  <p className="text-[15px] text-[#777]">
                    Privacy Policy content is not
                    available.
                  </p>
                )}
              </article>
            </div>
          </div>
        </section>
      </main>

    </>
  );
};

export default PrivacyPolicy;

// ----------------------------------------------------------------------

function PrivacyNavigation({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[130px] border-l border-[#ded9d2] pl-6">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1d1b19]">
          On this page
        </p>

        <nav aria-label="Privacy policy sections">
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[13px] leading-5 text-[#716d67] duration-300 hover:text-[#c91f26]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

PrivacyNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// ----------------------------------------------------------------------

function ContentBlock({ block }) {
  if (!block?.type) {
    return null;
  }

  switch (block.type) {
    case "paragraph":
      return (
        <PrivacyParagraph>
          {block.text}
        </PrivacyParagraph>
      );

    case "subheading":
      return (
        <Subheading>{block.text}</Subheading>
      );

    case "minorHeading":
      return (
        <MinorHeading>{block.text}</MinorHeading>
      );

    case "bulletList":
      return (
        <BulletList items={block.items || []} />
      );

    case "definitions":
      return (
        <div className="space-y-5">
          {(block.items || []).map(
            (item, index) => (
              <DefinitionItem
                key={
                  item.id ||
                  `${item.title}-${index}`
                }
                title={item.title}
                description={item.description}
              />
            )
          )}
        </div>
      );

    case "cookieCards":
      return (
        <div>
          {(block.items || []).map(
            (item, index) => (
              <CookieCard
                key={
                  item.id ||
                  `${item.title}-${index}`
                }
                title={item.title}
                type={
                  item.cookieType ||
                  item.type
                }
                administeredBy={
                  item.administeredBy
                }
              >
                {item.description}
              </CookieCard>
            )
          )}
        </div>
      );

    case "notice":
      return (
        <div className="my-7 border-l-4 border-[#c91f26] bg-[#f7f5f2] px-6 py-5 md:px-8">
          <p className="text-[15px] leading-7 text-[#4f4b46]">
            {block.text}
          </p>
        </div>
      );

    case "contactList":
      return (
        <ContactList
          items={block.items || []}
        />
      );

    default:
      return null;
  }
}

ContentBlock.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    text: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        text: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        cookieType: PropTypes.string,
        administeredBy: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string,
        type: PropTypes.string,
      })
    ),
  }).isRequired,
};

// ----------------------------------------------------------------------

function PrivacySection({
  id,
  title,
  children,
  showBorder = true,
}) {
  const borderClass = showBorder
    ? "border-b border-[#ebe7e1]"
    : "";

  return (
    <section
      id={id}
      className={`scroll-mt-[130px] pb-12 pt-2 first:pt-0 md:pb-16 ${borderClass}`}
    >
      {title && (
        <h2
          className="mb-7 text-[28px] font-semibold leading-tight text-[#1b1917] md:text-[34px]"
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}

PrivacySection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  showBorder: PropTypes.bool,
};

// ----------------------------------------------------------------------

function PrivacyParagraph({
  children,
  className = "",
}) {
  if (!children) {
    return null;
  }

  return (
    <p
      className={`mb-5 text-[15px] leading-[1.85] text-[#5d5954] ${className}`}
    >
      {children}
    </p>
  );
}

PrivacyParagraph.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

// ----------------------------------------------------------------------

function Subheading({ children }) {
  if (!children) {
    return null;
  }

  return (
    <h3 className="mb-4 mt-9 text-[20px] font-semibold leading-snug text-[#211f1c] first:mt-0 md:text-[23px]">
      {children}
    </h3>
  );
}

Subheading.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

function MinorHeading({ children }) {
  if (!children) {
    return null;
  }

  return (
    <h4 className="mb-3 mt-7 text-[16px] font-semibold text-[#292622]">
      {children}
    </h4>
  );
}

MinorHeading.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

function DefinitionItem({
  title,
  description,
}) {
  if (!title && !description) {
    return null;
  }

  return (
    <p className="text-[15px] leading-7 text-[#5d5954]">
      {title && (
        <>
          <strong className="font-semibold text-[#211f1c]">
            {title}:
          </strong>{" "}
        </>
      )}

      {description}
    </p>
  );
}

DefinitionItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

// ----------------------------------------------------------------------

function BulletList({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <ul className="mb-7 space-y-3 pl-5">
      {items.map((item, index) => {
        const itemText =
          typeof item === "string"
            ? item
            : item.text;

        if (!itemText) {
          return null;
        }

        return (
          <li
            key={
              typeof item === "string"
                ? `${item}-${index}`
                : item.id ||
                  `${itemText}-${index}`
            }
            className="
              relative
              pl-4
              text-[15px]
              leading-7
              text-[#5d5954]
              before:absolute
              before:left-0
              before:top-[11px]
              before:h-[5px]
              before:w-[5px]
              before:rounded-full
              before:bg-[#c91f26]
            "
          >
            {itemText}
          </li>
        );
      })}
    </ul>
  );
}

BulletList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        text: PropTypes.string,
      }),
    ])
  ).isRequired,
};

// ----------------------------------------------------------------------

function CookieCard({
  title,
  type,
  administeredBy,
  children,
}) {
  if (
    !title &&
    !type &&
    !administeredBy &&
    !children
  ) {
    return null;
  }

  return (
    <div className="mb-5 border border-[#e6e1da] bg-white p-5 shadow-[0_12px_30px_rgba(30,25,20,0.04)] md:p-6">
      {title && (
        <h4 className="text-[17px] font-semibold text-[#1e1c19]">
          {title}
        </h4>
      )}

      {(type || administeredBy) && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.08em] text-[#8a847d]">
          {type && <span>Type: {type}</span>}

          {administeredBy && (
            <span>
              Administered by:{" "}
              {administeredBy}
            </span>
          )}
        </div>
      )}

      {children && (
        <p className="mt-4 text-[14px] leading-7 text-[#5d5954]">
          {children}
        </p>
      )}
    </div>
  );
}

CookieCard.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  administeredBy: PropTypes.string,
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

function ContactList({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-7 border border-[#e5e1db] bg-[#faf9f7] p-6 md:p-8">
      {items.map((item, index) => (
        <ContactItem
          key={
            item.id ||
            `${item.label}-${index}`
          }
          label={item.label}
        >
          <ContactValue item={item} />
        </ContactItem>
      ))}
    </div>
  );
}

ContactList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.string,
      type: PropTypes.string,
    })
  ).isRequired,
};

// ----------------------------------------------------------------------

function ContactValue({ item }) {
  if (!item.value) {
    return null;
  }

  const commonClass =
    "text-[#c91f26] duration-300 hover:text-black";

  switch (item.type) {
    case "email":
      return (
        <a
          href={`mailto:${item.value}`}
          className={commonClass}
        >
          {item.value}
        </a>
      );

    case "phone":
      return (
        <a
          href={`tel:${item.value.replace(
            /[^\d+]/g,
            ""
          )}`}
          className={commonClass}
        >
          {item.value}
        </a>
      );

    case "url":
      return (
        <a
          href={item.value}
          target="_blank"
          rel="noopener noreferrer"
          className={`break-all ${commonClass}`}
        >
          {item.value}
        </a>
      );

    default:
      return item.value;
  }
}

ContactValue.propTypes = {
  item: PropTypes.shape({
    value: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

// ----------------------------------------------------------------------

function ContactItem({
  label,
  children,
}) {
  if (!label && !children) {
    return null;
  }

  return (
    <div className="grid gap-1 border-b border-[#e5e1db] py-4 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[110px_1fr]">
      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#817b74]">
        {label}
      </span>

      <div className="text-[14px] leading-6 text-[#403d39]">
        {children}
      </div>
    </div>
  );
}

ContactItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
};