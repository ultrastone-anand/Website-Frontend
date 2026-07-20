import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";


// ----------------------------------------------------------------------

const DEFINITIONS = [
  {
    title: "Account",
    description:
      "A unique account created for You to access Our Service or parts of Our Service.",
  },
  {
    title: "Affiliate",
    description:
      "An entity that controls, is controlled by, or is under common control with a party, where control means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for election of directors or another managing authority.",
  },
  {
    title: "Company",
    description:
      "Referred to as either “the Company”, “We”, “Us” or “Our” in this Privacy Policy, means Ultra Stones LLC, 55 Central Drive, Farmingdale, NY 11735.",
  },
  {
    title: "Cookies",
    description:
      "Small files placed on Your computer, mobile device, or another device by a website, containing details of Your browsing history and other information.",
  },
  {
    title: "Country",
    description: "New York, United States.",
  },
  {
    title: "Device",
    description:
      "Any device that can access the Service, including a computer, cellphone, or digital tablet.",
  },
  {
    title: "Personal Data",
    description:
      "Any information that relates to an identified or identifiable individual.",
  },
  {
    title: "Service",
    description:
      "The provision of natural and engineered stone surfaces through online or offline mediums.",
  },
  {
    title: "Service Provider",
    description:
      "Any natural or legal person or organization that processes data on behalf of the Company. This includes third-party companies or individuals engaged to facilitate, provide, support, or analyze the Service.",
  },
  {
    title: "Usage Data",
    description:
      "Data collected automatically, either generated through the use of the Service or from the Service infrastructure itself, such as the duration of a page visit.",
  },
  {
    title: "Website",
    description: "https://www.ultrastones.com/",
  },
  {
    title: "You",
    description:
      "The individual accessing or using the Service, or the company or other legal entity on behalf of which that individual is accessing or using the Service.",
  },
];

const PERSONAL_DATA_ITEMS = [
  "Email address",
  "First name and last name",
  "Phone number",
  "Address, State, Province, ZIP or Postal code, and City",
  "Usage Data",
];

const PERSONAL_DATA_USES = [
  {
    title: "To provide and maintain Our Service",
    description:
      "Including monitoring and analyzing how Our Service is used.",
  },
  {
    title: "To manage Your Account",
    description:
      "To manage Your registration as a user and provide access to functions available to registered users.",
  },
  {
    title: "For the performance of a contract",
    description:
      "To develop, perform, and complete purchase contracts for products, items, services, or other agreements entered into through the Service.",
  },
  {
    title: "To contact You",
    description:
      "To contact You by email, telephone, SMS, push notification, or another electronic communication regarding products, services, transactions, updates, or security notices.",
  },
  {
    title: "To provide news and offers",
    description:
      "To provide information about goods, services, promotions, and events similar to those You have purchased or requested, unless You have opted out.",
  },
  {
    title: "To manage Your requests",
    description:
      "To attend to, process, and manage requests submitted to Us.",
  },
  {
    title: "For business transfers",
    description:
      "To evaluate or conduct a merger, sale, financing, restructuring, reorganization, liquidation, or transfer of some or all of Our assets.",
  },
  {
    title: "For other purposes",
    description:
      "Including data analysis, identifying usage trends, evaluating promotional campaigns, and improving Our Service, products, marketing, and customer experience.",
  },
];

const DATA_SHARING_ITEMS = [
  {
    title: "With Service Providers",
    description:
      "We may share Personal Data with service providers who help Us process purchases, operate the Service, analyze usage, and improve the customer experience.",
  },
  {
    title: "For business transfers",
    description:
      "We may share or transfer Personal Data during negotiations or completion of a merger, financing, asset sale, or acquisition.",
  },
  {
    title: "With Affiliates",
    description:
      "We may share information with Our affiliates and require those affiliates to honor this Privacy Policy.",
  },
  {
    title: "With business partners",
    description:
      "We may share information with business partners to provide products, services, or promotions.",
  },
  {
    title: "With other users",
    description:
      "Information shared in public areas of the Service may be viewed by other users and distributed publicly.",
  },
  {
    title: "With Your consent",
    description:
      "We may disclose Personal Data for another purpose when You provide consent.",
  },
];

const LEGAL_DISCLOSURE_ITEMS = [
  "Comply with a legal obligation.",
  "Protect and defend the rights or property of the Company.",
  "Prevent or investigate possible wrongdoing connected with the Service.",
  "Protect the personal safety of users of the Service or the public.",
  "Protect against legal liability.",
];

// ----------------------------------------------------------------------

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-[110px]">
        {/* Header */}
        <section>
          <div className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <h1
              className="text-[34px] font-semibold text-[#161412] md:text-[42px]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Privacy Policy
            </h1>

            <div className="mb-5 mt-3 h-[4px] w-[70px] bg-[#c91f26]" />

            <p className="text-[13px] text-[#777]">
              <Link
                to="/"
                className="duration-300 hover:text-[#161412]"
              >
                Home
              </Link>

              {" / "}

              <span className="font-semibold text-[#161412]">
                Privacy Policy
              </span>
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[250px_minmax(0,950px)] lg:justify-center lg:gap-16">
              <PrivacyNavigation />

              <article className="min-w-0">
                <p className="mb-10 text-[14px] font-medium text-[#777]">
                  Last updated: March 14, 2024
                </p>

                <PrivacySection id="introduction">
                  <PrivacyParagraph>
                    This Privacy Policy describes Our policies and procedures
                    on the collection, use, and disclosure of Your information
                    when You use Our Service. It also tells You about Your
                    privacy rights and how the law protects You.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    We use Your Personal Data to provide and improve the
                    Service. By using the Service, You agree to the collection
                    and use of information in accordance with this Privacy
                    Policy.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="interpretation-definitions"
                  title="Interpretation and Definitions"
                >
                  <Subheading>Interpretation</Subheading>

                  <PrivacyParagraph>
                    Words whose initial letter is capitalized have meanings
                    defined under the following conditions. These definitions
                    have the same meaning whether they appear in singular or
                    plural form.
                  </PrivacyParagraph>

                  <Subheading>Definitions</Subheading>

                  <PrivacyParagraph>
                    For the purposes of this Privacy Policy:
                  </PrivacyParagraph>

                  <div className="space-y-5">
                    {DEFINITIONS.map((item) => (
                      <DefinitionItem
                        key={item.title}
                        title={item.title}
                        description={item.description}
                      />
                    ))}
                  </div>
                </PrivacySection>

                <PrivacySection
                  id="data-collection"
                  title="Collecting and Using Your Personal Data"
                >
                  <Subheading>Types of Data Collected</Subheading>

                  <MinorHeading>Personal Data</MinorHeading>

                  <PrivacyParagraph>
                    While using Our Service, We may ask You to provide certain
                    personally identifiable information that can be used to
                    contact or identify You. This information may include, but
                    is not limited to:
                  </PrivacyParagraph>

                  <BulletList items={PERSONAL_DATA_ITEMS} />

                  <MinorHeading>Usage Data</MinorHeading>

                  <PrivacyParagraph>
                    Usage Data is collected automatically when using the
                    Service.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    Usage Data may include information such as Your
                    Device&apos;s Internet Protocol address, browser type,
                    browser version, pages visited, the date and time of Your
                    visit, time spent on pages, unique device identifiers, and
                    other diagnostic information.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    When You access the Service through a mobile device, We may
                    automatically collect information including the type of
                    mobile device You use, Your mobile device ID, mobile IP
                    address, mobile operating system, mobile browser type,
                    unique device identifiers, and other diagnostic data.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    We may also collect information that Your browser sends
                    whenever You visit Our Service or access it through a mobile
                    device.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="cookies"
                  title="Tracking Technologies and Cookies"
                >
                  <PrivacyParagraph>
                    We use Cookies and similar tracking technologies to track
                    activity on Our Service, store certain information, improve
                    the Service, and analyze how it is used. The technologies We
                    use may include:
                  </PrivacyParagraph>

                  <div className="space-y-5">
                    <DefinitionItem
                      title="Cookies or Browser Cookies"
                      description="A Cookie is a small file placed on Your Device. You may instruct Your browser to refuse all Cookies or indicate when a Cookie is being sent. If You do not accept Cookies, some parts of the Service may not function correctly."
                    />

                    <DefinitionItem
                      title="Web Beacons"
                      description="Certain sections of Our Service and emails may contain small electronic files, including clear gifs, pixel tags, and single-pixel gifs. These allow Us to count visitors, measure email engagement, understand page popularity, and verify system integrity."
                    />
                  </div>

                  <PrivacyParagraph className="mt-6">
                    Cookies may be Persistent or Session Cookies. Persistent
                    Cookies remain on Your Device after You go offline, while
                    Session Cookies are deleted when You close Your browser.
                  </PrivacyParagraph>

                  <Subheading>Cookies We Use</Subheading>

                  <CookieCard
                    title="Necessary or Essential Cookies"
                    type="Session Cookies"
                    administeredBy="Us"
                  >
                    These Cookies are essential to provide services available
                    through the Website and enable You to use certain features.
                    They help authenticate users and prevent fraudulent use of
                    user accounts.
                  </CookieCard>

                  <CookieCard
                    title="Cookies Policy or Notice Acceptance Cookies"
                    type="Persistent Cookies"
                    administeredBy="Us"
                  >
                    These Cookies identify whether users have accepted the use
                    of Cookies on the Website.
                  </CookieCard>

                  <CookieCard
                    title="Functionality Cookies"
                    type="Persistent Cookies"
                    administeredBy="Us"
                  >
                    These Cookies allow Us to remember choices You make when
                    using the Website, such as login details or language
                    preferences, to provide a more personalized experience.
                  </CookieCard>

                  <PrivacyParagraph>
                    For more information about the Cookies We use and Your
                    choices regarding Cookies, please review the Cookies section
                    of this Privacy Policy.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="use-of-data"
                  title="Use of Your Personal Data"
                >
                  <PrivacyParagraph>
                    The Company may use Personal Data for the following
                    purposes:
                  </PrivacyParagraph>

                  <div className="space-y-5">
                    {PERSONAL_DATA_USES.map((item) => (
                      <DefinitionItem
                        key={item.title}
                        title={item.title}
                        description={item.description}
                      />
                    ))}
                  </div>

                  <Subheading>
                    We may share Your personal information in the following
                    situations
                  </Subheading>

                  <div className="space-y-5">
                    {DATA_SHARING_ITEMS.map((item) => (
                      <DefinitionItem
                        key={item.title}
                        title={item.title}
                        description={item.description}
                      />
                    ))}
                  </div>
                </PrivacySection>

                <PrivacySection
                  id="retention"
                  title="Retention of Your Personal Data"
                >
                  <PrivacyParagraph>
                    The Company will retain Your Personal Data only for as long
                    as necessary for the purposes described in this Privacy
                    Policy. We will retain and use Personal Data as needed to
                    comply with legal obligations, resolve disputes, and
                    enforce Our agreements and policies.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    Usage Data is generally retained for a shorter period,
                    except where it is used to strengthen security, improve the
                    functionality of the Service, or meet legal requirements.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="data-transfer"
                  title="Transfer of Your Personal Data"
                >
                  <PrivacyParagraph>
                    Your information, including Personal Data, may be processed
                    at the Company&apos;s offices and other locations where the
                    parties involved in processing are located. This means Your
                    information may be transferred to and maintained on
                    computers located outside Your state, province, country, or
                    other governmental jurisdiction.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    Your consent to this Privacy Policy followed by Your
                    submission of information represents Your agreement to that
                    transfer.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    The Company will take reasonable steps to ensure Your data
                    is handled securely and in accordance with this Privacy
                    Policy. No transfer will take place unless appropriate
                    controls are in place to protect Your information.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="delete-data"
                  title="Delete Your Personal Data"
                >
                  <PrivacyParagraph>
                    You have the right to delete or request that We assist in
                    deleting Personal Data that We have collected about You.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    The Service may provide the ability to delete certain
                    information through Your Account.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    You may update, amend, or delete Your information by signing
                    into Your Account and visiting the account settings
                    section, where available. You may also contact Us to request
                    access to, correction of, or deletion of Personal Data You
                    have provided.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    We may need to retain certain information when required by
                    law or another lawful basis.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="disclosure"
                  title="Disclosure of Your Personal Data"
                >
                  <Subheading>Business Transactions</Subheading>

                  <PrivacyParagraph>
                    If the Company is involved in a merger, acquisition, or
                    asset sale, Your Personal Data may be transferred. We will
                    provide notice before Your Personal Data becomes subject to
                    a different Privacy Policy.
                  </PrivacyParagraph>

                  <Subheading>Law Enforcement</Subheading>

                  <PrivacyParagraph>
                    Under certain circumstances, the Company may be required to
                    disclose Personal Data by law or in response to valid
                    requests from public authorities, including courts or
                    government agencies.
                  </PrivacyParagraph>

                  <Subheading>Other Legal Requirements</Subheading>

                  <PrivacyParagraph>
                    The Company may disclose Personal Data in the good-faith
                    belief that such action is necessary to:
                  </PrivacyParagraph>

                  <BulletList items={LEGAL_DISCLOSURE_ITEMS} />
                </PrivacySection>

                <PrivacySection
                  id="security"
                  title="Security of Your Personal Data"
                >
                  <Subheading>
                    Protection of Contact Information and SMS Privacy
                  </Subheading>

                  <div className="my-7 border-l-4 border-[#c91f26] bg-[#f7f5f2] px-6 py-5 md:px-8">
                    <p className="text-[15px] leading-7 text-[#4f4b46]">
                      We value Your privacy and are committed to safeguarding
                      Your Personal Information. Contact information, including
                      phone numbers and SMS-related data, will not be shared
                      with third-party companies or individuals for their
                      independent marketing purposes.
                    </p>
                  </div>

                  <PrivacyParagraph>
                    The security of Your Personal Data is important to Us.
                    However, no method of transmission over the Internet or
                    method of electronic storage is completely secure. While We
                    use commercially acceptable measures to protect Personal
                    Data, We cannot guarantee absolute security.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="children"
                  title="Children’s Privacy"
                >
                  <PrivacyParagraph>
                    Our Service is not directed to anyone under the age of 13.
                    We do not knowingly collect personally identifiable
                    information from anyone under 13.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    If You are a parent or guardian and believe Your child has
                    provided Personal Data, please contact Us. If We discover
                    that Personal Data has been collected from a child without
                    appropriate consent, We will take steps to remove it from
                    Our systems.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    Where parental consent is legally required, We may request
                    consent from a parent or guardian before collecting or
                    using such information.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="external-links"
                  title="Links to Other Websites"
                >
                  <PrivacyParagraph>
                    Our Service may contain links to websites that are not
                    operated by Us. Clicking a third-party link will direct You
                    to that third-party website.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    We strongly recommend reviewing the Privacy Policy of every
                    website You visit. We have no control over and accept no
                    responsibility for the content, privacy policies, or
                    practices of third-party websites or services.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="policy-changes"
                  title="Changes to this Privacy Policy"
                >
                  <PrivacyParagraph>
                    We may update this Privacy Policy from time to time. Changes
                    will be posted on this page.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    Where appropriate, We may notify You by email or through a
                    prominent notice on the Service before changes take effect.
                    The Last updated date at the top of this page will also be
                    revised.
                  </PrivacyParagraph>

                  <PrivacyParagraph>
                    You are encouraged to review this Privacy Policy
                    periodically. Changes become effective when posted on this
                    page.
                  </PrivacyParagraph>
                </PrivacySection>

                <PrivacySection
                  id="contact-us"
                  title="Contact Us"
                  showBorder={false}
                >
                  <PrivacyParagraph>
                    If You have any questions about this Privacy Policy, You can
                    contact Us using the details below:
                  </PrivacyParagraph>

                  <div className="mt-7 border border-[#e5e1db] bg-[#faf9f7] p-6 md:p-8">
                    <ContactItem label="Email">
                      <a
                        href="mailto:info@ultrastones.com"
                        className="text-[#c91f26] duration-300 hover:text-black"
                      >
                        info@ultrastones.com
                      </a>
                    </ContactItem>

                    <ContactItem label="Website">
                      <a
                        href="https://www.ultrastones.com/contact/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-[#c91f26] duration-300 hover:text-black"
                      >
                        https://www.ultrastones.com/contact/
                      </a>
                    </ContactItem>

                    <ContactItem label="Phone">
                      <a
                        href="tel:+16318734747"
                        className="text-[#c91f26] duration-300 hover:text-black"
                      >
                        +1 631-873-4747
                      </a>
                    </ContactItem>

                    <ContactItem label="Mail">
                      55 Central Drive, Farmingdale, NY 11735
                    </ContactItem>
                  </div>
                </PrivacySection>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// ----------------------------------------------------------------------

function PrivacyNavigation() {
  const navigationItems = [
    {
      id: "introduction",
      label: "Introduction",
    },
    {
      id: "interpretation-definitions",
      label: "Definitions",
    },
    {
      id: "data-collection",
      label: "Data Collected",
    },
    {
      id: "cookies",
      label: "Cookies",
    },
    {
      id: "use-of-data",
      label: "Use of Data",
    },
    {
      id: "retention",
      label: "Data Retention",
    },
    {
      id: "data-transfer",
      label: "Data Transfer",
    },
    {
      id: "delete-data",
      label: "Delete Your Data",
    },
    {
      id: "disclosure",
      label: "Disclosure",
    },
    {
      id: "security",
      label: "Security",
    },
    {
      id: "children",
      label: "Children’s Privacy",
    },
    {
      id: "external-links",
      label: "External Links",
    },
    {
      id: "policy-changes",
      label: "Policy Changes",
    },
    {
      id: "contact-us",
      label: "Contact Us",
    },
  ];

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[130px] border-l border-[#ded9d2] pl-6">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1d1b19]">
          On this page
        </p>

        <nav aria-label="Privacy policy sections">
          <ul className="space-y-3">
            {navigationItems.map((item) => (
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

// ----------------------------------------------------------------------

function PrivacyParagraph({
  children,
  className = "",
}) {
  return (
    <p
      className={`mb-5 text-[15px] leading-[1.85] text-[#5d5954] ${className}`}
    >
      {children}
    </p>
  );
}

// ----------------------------------------------------------------------

function Subheading({ children }) {
  return (
    <h3 className="mb-4 mt-9 text-[20px] font-semibold leading-snug text-[#211f1c] first:mt-0 md:text-[23px]">
      {children}
    </h3>
  );
}

// ----------------------------------------------------------------------

function MinorHeading({ children }) {
  return (
    <h4 className="mb-3 mt-7 text-[16px] font-semibold text-[#292622]">
      {children}
    </h4>
  );
}

// ----------------------------------------------------------------------

function DefinitionItem({
  title,
  description,
}) {
  return (
    <p className="text-[15px] leading-7 text-[#5d5954]">
      <strong className="font-semibold text-[#211f1c]">
        {title}:
      </strong>{" "}
      {description}
    </p>
  );
}

// ----------------------------------------------------------------------

function BulletList({ items }) {
  return (
    <ul className="mb-7 space-y-3 pl-5">
      {items.map((item) => (
        <li
          key={item}
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
          {item}
        </li>
      ))}
    </ul>
  );
}

// ----------------------------------------------------------------------

function CookieCard({
  title,
  type,
  administeredBy,
  children,
}) {
  return (
    <div className="mb-5 border border-[#e6e1da] bg-white p-5 shadow-[0_12px_30px_rgba(30,25,20,0.04)] md:p-6">
      <h4 className="text-[17px] font-semibold text-[#1e1c19]">
        {title}
      </h4>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.08em] text-[#8a847d]">
        <span>Type: {type}</span>
        <span>
          Administered by: {administeredBy}
        </span>
      </div>

      <p className="mt-4 text-[14px] leading-7 text-[#5d5954]">
        {children}
      </p>
    </div>
  );
}

// ----------------------------------------------------------------------

function ContactItem({
  label,
  children,
}) {
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