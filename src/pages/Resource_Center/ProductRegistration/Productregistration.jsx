import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  ImagePlus,
  Loader2,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";

/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

const REGISTRATION_API =
  `${API_URL}/product-registrations`;

const STONES_API =
  `${API_URL}/stones`;

const MAX_INVOICE_SIZE =
  15 * 1024 * 1024;

const MAX_PHOTO_SIZE =
  10 * 1024 * 1024;

const MAX_PHOTOS = 10;

/* =========================================================
   OPTIONS
========================================================= */

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
];

const INSTALLATION_TYPES = [
  "Kitchen Countertop",
  "Bathroom Vanity",
  "Wall Cladding",
  "Flooring",
  "Other",
];

/* =========================================================
   INITIAL FORM STATE
========================================================= */

const INITIAL_FORM = {
  full_name: "",
  email: "",
  phone: "",

  product_category: "",
  product_name: "",
  invoice_order_number: "",
  purchase_date: "",

  project_type: "",
  installation_type: "",
  installation_type_other: "",

  is_installed: "",

  installation_date: "",
  installation_address: "",

  fabricator_installer_name: "",
  fabricator_installer_contact: "",

  tentative_installation_date: "",

  declaration_accepted: false,
};

/* =========================================================
   HELPERS
========================================================= */

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ECONNABORTED") {
    return "The request timed out. Please check whether your registration was received before submitting again.";
  }

  if (error.code === "ERR_NETWORK") {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  if (error.message) {
    return error.message;
  }

  return "Unable to submit your registration. Please try again.";
};

/* =========================================================
   SHARED FIELD COMPONENTS
========================================================= */

const FieldLabel = ({
  children,
  required = false,
}) => (
  <label
    className="
      block
      mb-2.5
      text-[12px]
      font-semibold
      text-[#333]
      uppercase
      tracking-[1px]
    "
  >
    {children}

    {required && (
      <span className="text-[#c91f26] ml-1">
        *
      </span>
    )}
  </label>
);

const FieldError = ({ message }) =>
  message ? (
    <p
      role="alert"
      className="
        text-[12px]
        text-[#c91f26]
        mt-2
      "
    >
      {message}
    </p>
  ) : null;

const SectionHeading = ({
  number,
  title,
  description,
}) => (
  <div
    className="
      flex
      items-start
      gap-4
      pb-6
      mb-8
      border-b
      border-[#e9e9e9]
    "
  >
    <div
      className="
        w-[42px]
        h-[42px]
        shrink-0
        flex
        items-center
        justify-center
        bg-[#161412]
        text-white
        text-[13px]
        font-semibold
      "
    >
      {number}
    </div>

    <div>
      <h2
        className="
          text-[20px]
          md:text-[23px]
          font-semibold
          text-[#161412]
          leading-tight
        "
      >
        {title}
      </h2>

      {description && (
        <p
          className="
            text-[13px]
            text-[#888]
            mt-2
            leading-relaxed
          "
        >
          {description}
        </p>
      )}
    </div>
  </div>
);

/* =========================================================
   PRODUCT REGISTRATION PAGE
========================================================= */

export default function Productregistration() {
  /* =======================================================
     FORM STATES
  ======================================================= */

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [invoiceFile, setInvoiceFile] =
    useState(null);

  const [
    installationPhotos,
    setInstallationPhotos,
  ] = useState([]);

  const [
    photoPreviews,
    setPhotoPreviews,
  ] = useState([]);

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [successData, setSuccessData] =
    useState(null);

  /* =======================================================
     CATEGORY + PRODUCT STATES
  ======================================================= */

  const [categories, setCategories] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [
    productsLoading,
    setProductsLoading,
  ] = useState(false);

  const [
    categoriesError,
    setCategoriesError,
  ] = useState("");

  const [
    productsError,
    setProductsError,
  ] = useState("");

  const navigate = useNavigate();

const [redirectCountdown, setRedirectCountdown] = useState(5);

  /* =======================================================
     REFS
  ======================================================= */

  const invoiceInputRef =
    useRef(null);

  const photosInputRef =
    useRef(null);

  const formTopRef =
    useRef(null);

  const today = getToday();

  /* =======================================================
     SELECTED CATEGORY
  ======================================================= */

  const selectedCategory = useMemo(() => {
    return categories.find(
      (category) =>
        category.name ===
        form.product_category
    );
  }, [
    categories,
    form.product_category,
  ]);

  /* =======================================================
     FETCH ACTIVE PRODUCT CATEGORIES
  ======================================================= */

  useEffect(() => {
    const controller =
      new AbortController();

    const fetchCategories =
      async () => {
        try {
          setCategoriesLoading(true);

          setCategoriesError("");

          const response =
            await axios.get(
              STONES_API,
              {
                signal:
                  controller.signal,
              }
            );

          const result =
            response.data;

          if (!result.success) {
            throw new Error(
              "Unable to load product categories."
            );
          }

          const activeCategories = (
            Array.isArray(result.data)
              ? result.data
              : []
          )
            .filter(
              (item) =>
                item.is_active ===
                  true &&
                item.parent_id ===
                  null
            )
            .sort((a, b) => {
              if (
                a.slug ===
                "ultra-quartz"
              ) {
                return -1;
              }

              if (
                b.slug ===
                "ultra-quartz"
              ) {
                return 1;
              }

              if (
                a.slug ===
                "atlas-plan"
              ) {
                return 1;
              }

              if (
                b.slug ===
                "atlas-plan"
              ) {
                return -1;
              }

              return a.name.localeCompare(
                b.name,
                undefined,
                {
                  sensitivity:
                    "base",
                }
              );
            });

          if (
            !controller.signal.aborted
          ) {
            setCategories(
              activeCategories
            );
          }
        } catch (error) {
          if (
            error.code !==
              "ERR_CANCELED" &&
            error.name !==
              "CanceledError"
          ) {
            console.error(
              "Product categories API error:",
              error
            );

            setCategoriesError(
              "Unable to load product categories. Please refresh the page."
            );
          }
        } finally {
          if (
            !controller.signal.aborted
          ) {
            setCategoriesLoading(
              false
            );
          }
        }
      };

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  /* =======================================================
     FETCH PRODUCTS BY SELECTED CATEGORY
  ======================================================= */

  useEffect(() => {
    if (!selectedCategory?.slug) {
      setProducts([]);

      setProductsLoading(false);

      setProductsError("");

      return;
    }

    const controller =
      new AbortController();

    const fetchProducts =
      async () => {
        try {
          setProductsLoading(true);

          setProductsError("");

          setProducts([]);

          const response =
            await axios.get(
              `${STONES_API}/${encodeURIComponent(
                selectedCategory.slug
              )}`,
              {
                signal:
                  controller.signal,
              }
            );

          const result =
            response.data;

          if (!result.success) {
            throw new Error(
              "Unable to load products."
            );
          }

          const activeProducts = (
            Array.isArray(
              result.products
            )
              ? result.products
              : []
          )
            .filter(
              (item) =>
                item.is_active ===
                  true &&
                item.is_published ===
                  true
            )
            .sort((a, b) =>
              a.name.localeCompare(
                b.name,
                undefined,
                {
                  sensitivity:
                    "base",
                }
              )
            );

          if (
            !controller.signal.aborted
          ) {
            setProducts(
              activeProducts
            );
          }
        } catch (error) {
          if (
            error.code !==
              "ERR_CANCELED" &&
            error.name !==
              "CanceledError"
          ) {
            console.error(
              "Products API error:",
              error
            );

            setProductsError(
              "Unable to load products for this category."
            );
          }
        } finally {
          if (
            !controller.signal.aborted
          ) {
            setProductsLoading(
              false
            );
          }
        }
      };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [
    selectedCategory?.slug,
  ]);

  /* =======================================================
     PHOTO PREVIEWS
  ======================================================= */

  useEffect(() => {
    const previews =
      installationPhotos.map(
        (file) => ({
          name: file.name,

          url:
            URL.createObjectURL(
              file
            ),
        })
      );

    setPhotoPreviews(
      previews
    );

    return () => {
      previews.forEach(
        (preview) => {
          URL.revokeObjectURL(
            preview.url
          );
        }
      );
    };
  }, [
    installationPhotos,
  ]);

  /* =======================================================
     FIELD CHANGE
  ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      };

      /* RESET PRODUCT WHEN CATEGORY CHANGES */

      if (
        name ===
        "product_category"
      ) {
        updated.product_name =
          "";
      }

      /* RESET INSTALLATION DATE IF PURCHASE DATE CHANGES */

      if (
        name ===
          "purchase_date" &&
        updated.installation_date &&
        updated.installation_date <
          value
      ) {
        updated.installation_date =
          "";
      }

      /* RESET OTHER INSTALLATION TYPE */

      if (
        name ===
          "installation_type" &&
        value !== "Other"
      ) {
        updated.installation_type_other =
          "";
      }

      /* RESET CONDITIONAL INSTALLATION FIELDS */

      if (
        name ===
        "is_installed"
      ) {
        if (
          value === "true"
        ) {
          updated.tentative_installation_date =
            "";
        } else {
          updated.installation_date =
            "";

          updated.installation_address =
            "";

          updated.fabricator_installer_name =
            "";

          updated.fabricator_installer_contact =
            "";
        }
      }

      return updated;
    });

    /* CLEAR PHOTOS WHEN NOT INSTALLED */

    if (
      name ===
        "is_installed" &&
      value === "false"
    ) {
      setInstallationPhotos(
        []
      );

      if (
        photosInputRef.current
      ) {
        photosInputRef.current.value =
          "";
      }
    }

    /* CLEAR VALIDATION ERRORS */

    setErrors((previous) => {
      const updated = {
        ...previous,

        [name]: "",
      };

      if (
        name ===
        "product_category"
      ) {
        updated.product_name =
          "";
      }

      if (
        name ===
        "is_installed"
      ) {
        updated.installation_date =
          "";

        updated.installation_address =
          "";

        updated.installation_photos =
          "";

        updated.tentative_installation_date =
          "";
      }

      if (
        name ===
        "installation_type"
      ) {
        updated.installation_type_other =
          "";
      }

      if (
        name ===
        "purchase_date"
      ) {
        updated.installation_date =
          "";
      }

      return updated;
    });

    setSubmitError("");
  };

  /* =======================================================
     INVOICE UPLOAD
  ======================================================= */

  const handleInvoiceChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
    ];

    const extension =
      file.name
        .substring(
          file.name.lastIndexOf(
            "."
          )
        )
        .toLowerCase();

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      setErrors(
        (previous) => ({
          ...previous,

          purchase_invoice:
            "Only PDF, JPG and PNG files are allowed.",
        })
      );

      event.target.value =
        "";

      return;
    }

    if (
      file.size >
      MAX_INVOICE_SIZE
    ) {
      setErrors(
        (previous) => ({
          ...previous,

          purchase_invoice:
            "Invoice file must be smaller than 15 MB.",
        })
      );

      event.target.value =
        "";

      return;
    }

    setInvoiceFile(
      file
    );

    setErrors(
      (previous) => ({
        ...previous,

        purchase_invoice:
          "",
      })
    );
  };

  /* =======================================================
     INSTALLATION PHOTO UPLOAD
  ======================================================= */

  const handlePhotosChange = (
    event
  ) => {
    const selectedFiles =
      Array.from(
        event.target.files ||
          []
      );

    if (
      selectedFiles.length ===
      0
    ) {
      return;
    }

    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];

    const invalidFile =
      selectedFiles.find(
        (file) => {
          const extension =
            file.name
              .substring(
                file.name.lastIndexOf(
                  "."
                )
              )
              .toLowerCase();

          return !allowedExtensions.includes(
            extension
          );
        }
      );

    if (invalidFile) {
      setErrors(
        (previous) => ({
          ...previous,

          installation_photos:
            "Only JPG, PNG and WebP images are allowed.",
        })
      );

      event.target.value =
        "";

      return;
    }

    const oversizedFile =
      selectedFiles.find(
        (file) =>
          file.size >
          MAX_PHOTO_SIZE
      );

    if (
      oversizedFile
    ) {
      setErrors(
        (previous) => ({
          ...previous,

          installation_photos:
            "Each image must be smaller than 10 MB.",
        })
      );

      event.target.value =
        "";

      return;
    }

    const combinedFiles = [
      ...installationPhotos,
      ...selectedFiles,
    ];

    if (
      combinedFiles.length >
      MAX_PHOTOS
    ) {
      setErrors(
        (previous) => ({
          ...previous,

          installation_photos:
            `Maximum ${MAX_PHOTOS} installation photos are allowed.`,
        })
      );

      event.target.value =
        "";

      return;
    }

    setInstallationPhotos(
      combinedFiles
    );

    setErrors(
      (previous) => ({
        ...previous,

        installation_photos:
          "",
      })
    );

    event.target.value =
      "";
  };

  /* =======================================================
     REMOVE INSTALLATION PHOTO
  ======================================================= */

  const removePhoto = (
    index
  ) => {
    setInstallationPhotos(
      (previous) =>
        previous.filter(
          (_, photoIndex) =>
            photoIndex !==
            index
        )
    );
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm =
    () => {
      const newErrors =
        {};

      /* CUSTOMER INFORMATION */

      if (
        !form.full_name.trim()
      ) {
        newErrors.full_name =
          "Full name is required.";
      }

      if (
        !form.email.trim()
      ) {
        newErrors.email =
          "Email address is required.";
      } else if (
        !isValidEmail(
          form.email.trim()
        )
      ) {
        newErrors.email =
          "Enter a valid email address.";
      }

      if (
        !form.phone.trim()
      ) {
        newErrors.phone =
          "Phone number is required.";
      }

      /* PRODUCT CATEGORY */

      if (
        !form.product_category
      ) {
        newErrors.product_category =
          "Please select a product category.";
      } else if (
        !selectedCategory
      ) {
        newErrors.product_category =
          "Please select a valid product category.";
      }

      /* PRODUCT NAME */

      if (
        !form.product_name
      ) {
        newErrors.product_name =
          "Please select a product.";
      } else if (
        !products.some(
          (product) =>
            product.name ===
            form.product_name
        )
      ) {
        newErrors.product_name =
          "Please select a valid product.";
      }

      if (
        !form.invoice_order_number.trim()
      ) {
        newErrors.invoice_order_number =
          "Invoice or order number is required.";
      }

      if (
        !form.purchase_date
      ) {
        newErrors.purchase_date =
          "Purchase date is required.";
      } else if (
        form.purchase_date >
        today
      ) {
        newErrors.purchase_date =
          "Purchase date cannot be in the future.";
      }

      /* PROJECT INFORMATION */

      if (
        !form.project_type
      ) {
        newErrors.project_type =
          "Please select a project type.";
      }

      if (
        !form.installation_type
      ) {
        newErrors.installation_type =
          "Please select an installation type.";
      }

      if (
        form.installation_type ===
          "Other" &&
        !form.installation_type_other.trim()
      ) {
        newErrors.installation_type_other =
          "Please specify the installation type.";
      }

      /* INSTALLATION INFORMATION */

      if (
        !form.is_installed
      ) {
        newErrors.is_installed =
          "Please select whether the product has been installed.";
      }

      if (
        form.is_installed ===
        "true"
      ) {
        if (
          !form.installation_date
        ) {
          newErrors.installation_date =
            "Installation date is required.";
        } else if (
          form.installation_date >
          today
        ) {
          newErrors.installation_date =
            "Installation date cannot be in the future.";
        } else if (
          form.purchase_date &&
          form.installation_date <
            form.purchase_date
        ) {
          newErrors.installation_date =
            "Installation date cannot be earlier than the purchase date.";
        }

        if (
          !form.installation_address.trim()
        ) {
          newErrors.installation_address =
            "Installation address is required.";
        }

        if (
          installationPhotos.length ===
          0
        ) {
          newErrors.installation_photos =
            "Upload at least one installation photo.";
        }
      }

      if (
        form.is_installed ===
        "false"
      ) {
        if (
          !form.tentative_installation_date
        ) {
          newErrors.tentative_installation_date =
            "Tentative installation date is required.";
        } else if (
          form.tentative_installation_date <
          today
        ) {
          newErrors.tentative_installation_date =
            "Tentative installation date cannot be in the past.";
        }
      }

      /* PURCHASE DOCUMENT */

      if (
        !invoiceFile
      ) {
        newErrors.purchase_invoice =
          "Please upload your purchase invoice.";
      }

      /* DECLARATION */

      if (
        !form.declaration_accepted
      ) {
        newErrors.declaration_accepted =
          "You must accept the declaration.";
      }

      setErrors(
        newErrors
      );

      return (
        Object.keys(
          newErrors
        ).length === 0
      );
    };

  /* =======================================================
     SUBMIT FORM
  ======================================================= */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        submitting
      ) {
        return;
      }

      setSubmitError(
        ""
      );

      if (
        !validateForm()
      ) {
        window.scrollTo({
          top: 0,

          behavior:
            "smooth",
        });

        return;
      }

      try {
        setSubmitting(
          true
        );

        const formData =
          new FormData();

        /* CUSTOMER DETAILS */

        formData.append(
          "full_name",
          form.full_name.trim()
        );

        formData.append(
          "email",
          form.email.trim()
        );

        formData.append(
          "phone",
          form.phone.trim()
        );

        /* PRODUCT DETAILS */

        formData.append(
          "product_category",
          form.product_category
        );

        formData.append(
          "product_name",
          form.product_name.trim()
        );

        formData.append(
          "invoice_order_number",
          form.invoice_order_number.trim()
        );

        formData.append(
          "purchase_date",
          form.purchase_date
        );

        /* PROJECT DETAILS */

        formData.append(
          "project_type",
          form.project_type
        );

        formData.append(
          "installation_type",
          form.installation_type
        );

        if (
          form.installation_type ===
          "Other"
        ) {
          formData.append(
            "installation_type_other",
            form.installation_type_other.trim()
          );
        }

        /* INSTALLATION DETAILS */

        formData.append(
          "is_installed",
          form.is_installed
        );

        if (
          form.is_installed ===
          "true"
        ) {
          formData.append(
            "installation_date",
            form.installation_date
          );

          formData.append(
            "installation_address",
            form.installation_address.trim()
          );

          formData.append(
            "fabricator_installer_name",
            form.fabricator_installer_name.trim()
          );

          formData.append(
            "fabricator_installer_contact",
            form.fabricator_installer_contact.trim()
          );

          installationPhotos.forEach(
            (file) => {
              formData.append(
                "installation_photos",
                file
              );
            }
          );
        } else {
          formData.append(
            "tentative_installation_date",
            form.tentative_installation_date
          );
        }

        /* PURCHASE INVOICE */

        formData.append(
          "purchase_invoice",
          invoiceFile
        );

        /* DECLARATION */

        formData.append(
          "declaration_accepted",
          String(
            form.declaration_accepted
          )
        );

        /* API REQUEST */

        const response =
          await axios.post(
            REGISTRATION_API,
            formData,
            {
              timeout:
                120000,
            }
          );

        if (
          !response.data?.success
        ) {
          throw new Error(
            response.data?.message ||
              "Registration failed."
          );
        }

        /* SUCCESS */

        setSuccessData(
          response.data.data
        );

        setForm({
          ...INITIAL_FORM,
        });

        setInvoiceFile(
          null
        );

        setInstallationPhotos(
          []
        );

        setErrors(
          {}
        );

        if (
          invoiceInputRef.current
        ) {
          invoiceInputRef.current.value =
            "";
        }

        if (
          photosInputRef.current
        ) {
          photosInputRef.current.value =
            "";
        }

        window.scrollTo({
          top: 0,

          behavior:
            "smooth",
        });
      } catch (error) {
        console.error(
          "Product registration error:",
          error
        );

        setSubmitError(
          getErrorMessage(
            error
          )
        );

        window.scrollTo({
          top: 0,

          behavior:
            "smooth",
        });
      } finally {
        setSubmitting(
          false
        );
      }
    };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const handleNewRegistration =
    () => {
      setSuccessData(
        null
      );

      setForm({
        ...INITIAL_FORM,
      });

      setInvoiceFile(
        null
      );

      setInstallationPhotos(
        []
      );

      setErrors(
        {}
      );

      setSubmitError(
        ""
      );

      if (
        invoiceInputRef.current
      ) {
        invoiceInputRef.current.value =
          "";
      }

      if (
        photosInputRef.current
      ) {
        photosInputRef.current.value =
          "";
      }

      window.scrollTo({
        top: 0,

        behavior:
          "smooth",
      });
    };

    /* =========================================================
   AUTO REDIRECT AFTER SUCCESSFUL REGISTRATION
========================================================= */

useEffect(() => {
  if (!successData) return;

  setRedirectCountdown(5);

  const redirectTimer = setTimeout(() => {
    navigate("/", { replace: true });
  }, 5000);

  const countdownTimer = setInterval(() => {
    setRedirectCountdown((previous) =>
      Math.max(previous - 1, 0)
    );
  }, 1000);

  return () => {
    clearTimeout(redirectTimer);
    clearInterval(countdownTimer);
  };
}, [successData, navigate]);

  /* =======================================================
     SHARED INPUT CLASSES
  ======================================================= */

  const inputClass = `
    w-full
    h-[52px]
    px-4
    border
    border-[#dedede]
    bg-white
    text-[#161412]
    text-[14px]
    outline-none
    transition-colors
    duration-300
    focus:border-[#161412]
    placeholder:text-[#aaa]
    disabled:bg-[#f5f5f5]
    disabled:cursor-not-allowed
  `;

  const textareaClass = `
    w-full
    min-h-[125px]
    p-4
    border
    border-[#dedede]
    bg-white
    text-[#161412]
    text-[14px]
    outline-none
    resize-y
    transition-colors
    duration-300
    focus:border-[#161412]
    placeholder:text-[#aaa]
  `;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        pt-[110px]
        pb-20
        bg-white
      "
      style={{
        fontFamily:
          "Montserrat, sans-serif",
      }}
    >
      {/* ===================================================
          PAGE HEADING
      =================================================== */}

      <section
        ref={formTopRef}
      >
        <div
          className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
          "
        >
          <h1
            className="
              text-[34px]
              md:text-[42px]
              font-semibold
              text-[#161412]
              leading-tight
            "
          >
            Product Registration
          </h1>

          <div
            className="
              w-[70px]
              h-[4px]
              bg-[#c91f26]
              mt-4
              mb-4
            "
          />

          {/* BREADCRUMB */}

          <p
            className="
              text-[13px]
              text-[#777]
            "
          >
            <Link
              to="/"
              className="
                hover:text-[#161412]
                transition-colors
              "
            >
              Home
            </Link>

            {" / "}

            <span
              className="
                text-[#161412]
              "
            >
              <b>
                Product Registration
              </b>
            </span>
          </p>

          {/* DESCRIPTION */}

          <p
            className="
              text-[14px]
              text-[#777]
              mt-7
              max-w-[900px]
              leading-[1.9]
            "
          >
            Register your Ultra Stones product
            by providing your purchase and
            installation details. Please complete
            the form below and upload the
            required documents to submit your
            registration.
          </p>
        </div>
      </section>

      {/* ===================================================
          SUCCESS STATE
      =================================================== */}

      {successData ? (
        <section
          className="
            max-w-[1100px]
            mx-auto
            px-6
            xl:px-10
            pt-14
          "
        >
          <div
            className="
              border
              border-[#e5e5e5]
              bg-white
              p-8
              md:p-14
              text-center
            "
          >
            <div
              className="
                w-[85px]
                h-[85px]
                mx-auto
                bg-green-50
                flex
                items-center
                justify-center
                mb-7
              "
            >
              <CheckCircle2
                size={42}
                strokeWidth={1.5}
                className="
                  text-green-600
                "
              />
            </div>

            <h2
              className="
                text-[26px]
                md:text-[32px]
                font-semibold
                text-[#161412]
              "
            >
              Registration Submitted Successfully
            </h2>

            <p
              className="
                text-[14px]
                text-[#777]
                leading-[1.9]
                mt-5
                max-w-[650px]
                mx-auto
              "
            >
              Thank you for registering your product
              with Ultra Stones. Your registration
              has been received successfully.
              A confirmation email will be sent
              to your registered email address.
            </p>

            {/* REGISTRATION NUMBER */}

            <div
              className="
                bg-[#f8f8f8]
                border
                border-[#e9e9e9]
                max-w-[450px]
                mx-auto
                mt-10
                p-7
              "
            >
              <p
                className="
                  text-[11px]
                  text-[#888]
                  uppercase
                  tracking-[2px]
                  font-semibold
                "
              >
                Your Registration Number
              </p>

              <p
                className="
                  text-[26px]
                  md:text-[30px]
                  font-semibold
                  text-[#161412]
                  mt-3
                  break-all
                "
              >
                {
                  successData.registration_number
                }
              </p>
            </div>

            <div className="mt-7 text-center">
  <p className="text-[12px] text-[#888]">
    Please save your registration number
    for future reference.
  </p>

  <p className="text-[13px] text-[#c91f26] font-semibold mt-4">
    Redirecting to homepage in {redirectCountdown} seconds...
  </p>
</div>

            <div
              className="
                flex
                flex-col
                sm:flex-row
                justify-center
                gap-4
                mt-10
              "
            >
              <button
                type="button"
                onClick={
                  handleNewRegistration
                }
                className="
                  bg-[#161412]
                  text-white
                  px-8
                  py-4
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[1px]
                  hover:bg-[#c91f26]
                  transition-colors
                  cursor-pointer
                "
              >
                Register Another Product
              </button>

              <Link
                to="/"
                className="
                  border
                  border-[#dedede]
                  text-[#161412]
                  px-8
                  py-4
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[1px]
                  hover:border-[#161412]
                  transition-colors
                "
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      ) : (
        /* =================================================
           REGISTRATION FORM
        ================================================= */

        <section
          className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
            pt-12
          "
        >
          {/* ===============================================
              FORM INTRODUCTION
          =============================================== */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
              bg-[#f8f8f8]
              border
              border-[#ededed]
              p-6
              mb-10
            "
          >
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <ShieldCheck
                size={27}
                strokeWidth={1.5}
                className="
                  text-[#c91f26]
                  shrink-0
                "
              />

              <div>
                <h3
                  className="
                    text-[14px]
                    font-semibold
                    text-[#161412]
                  "
                >
                  Product Registration Form
                </h3>

                <p
                  className="
                    text-[12px]
                    text-[#888]
                    mt-2
                    leading-relaxed
                  "
                >
                  Please ensure that all information
                  provided is accurate before submission.
                </p>
              </div>
            </div>

            <p
              className="
                text-[11px]
                text-[#888]
                whitespace-nowrap
              "
            >
              <span
                className="
                  text-[#c91f26]
                "
              >
                *
              </span>{" "}
              Required Fields
            </p>
          </div>

          {/* ===============================================
              SUBMISSION ERROR
          =============================================== */}

          {submitError && (
            <div
              role="alert"
              className="
                border
                border-red-200
                bg-red-50
                p-5
                text-red-700
                text-[13px]
                leading-relaxed
                mb-8
              "
            >
              {submitError}
            </div>
          )}

          <form
            onSubmit={
              handleSubmit
            }
            noValidate
            className="
              space-y-10
            "
          >
            {/* =============================================
                SECTION 01 - CUSTOMER INFORMATION
            ============================================= */}

            <div
              className="
                border
                border-[#e8e8e8]
                bg-white
                p-6
                md:p-10
              "
            >
              <SectionHeading
                number="01"
                title="Customer Information"
                description="Enter your contact details."
              />

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-x-7
                  gap-y-7
                "
              >
                {/* FULL NAME */}

                <div
                  className="
                    md:col-span-2
                  "
                >
                  <FieldLabel required>
                    Full Name
                  </FieldLabel>

                  <input
                    type="text"
                    name="full_name"
                    value={
                      form.full_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={255}
                    className={
                      inputClass
                    }
                    aria-invalid={
                      Boolean(
                        errors.full_name
                      )
                    }
                  />

                  <FieldError
                    message={
                      errors.full_name
                    }
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <FieldLabel required>
                    Email Address
                  </FieldLabel>

                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your email address"
                    autoComplete="email"
                    maxLength={255}
                    className={
                      inputClass
                    }
                    aria-invalid={
                      Boolean(
                        errors.email
                      )
                    }
                  />

                  <FieldError
                    message={
                      errors.email
                    }
                  />
                </div>

                {/* PHONE */}

                <div>
                  <FieldLabel required>
                    Phone Number
                  </FieldLabel>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    maxLength={30}
                    className={
                      inputClass
                    }
                    aria-invalid={
                      Boolean(
                        errors.phone
                      )
                    }
                  />

                  <FieldError
                    message={
                      errors.phone
                    }
                  />
                </div>
              </div>
            </div>

            {/* =============================================
                SECTION 02 - PRODUCT INFORMATION
            ============================================= */}

            <div
              className="
                border
                border-[#e8e8e8]
                bg-white
                p-6
                md:p-10
              "
            >
              <SectionHeading
                number="02"
                title="Product Information"
                description="Provide the details of your purchased product."
              />

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-x-7
                  gap-y-7
                "
              >
                {/* PRODUCT CATEGORY */}

                <div>
                  <FieldLabel required>
                    Product Category
                  </FieldLabel>

                  <div
                    className="
                      relative
                    "
                  >
                    <select
                      name="product_category"
                      value={
                        form.product_category
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        categoriesLoading ||
                        submitting ||
                        Boolean(
                          categoriesError
                        )
                      }
                      className={`
                        ${inputClass}
                        appearance-none
                        pr-12
                        cursor-pointer
                        disabled:cursor-not-allowed
                      `}
                      aria-invalid={
                        Boolean(
                          errors.product_category
                        )
                      }
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading Categories..."
                          : categoriesError
                          ? "Unable to Load Categories"
                          : "Select Product Category"}
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={
                              category.id
                            }
                            value={
                              category.name
                            }
                          >
                            {
                              category.name
                            }
                          </option>
                        )
                      )}
                    </select>

                    {categoriesLoading ? (
                      <Loader2
                        size={17}
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          animate-spin
                          text-[#777]
                          pointer-events-none
                        "
                      />
                    ) : (
                      <ChevronDown
                        size={17}
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          pointer-events-none
                          text-[#777]
                        "
                      />
                    )}
                  </div>

                  <FieldError
                    message={
                      errors.product_category ||
                      categoriesError
                    }
                  />
                </div>

                {/* PRODUCT NAME */}

                <div>
                  <FieldLabel required>
                    Product Name
                  </FieldLabel>

                  <div
                    className="
                      relative
                    "
                  >
                    <select
                      name="product_name"
                      value={
                        form.product_name
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !form.product_category ||
                        productsLoading ||
                        submitting ||
                        Boolean(
                          productsError
                        ) ||
                        products.length ===
                          0
                      }
                      className={`
                        ${inputClass}
                        appearance-none
                        pr-12
                        cursor-pointer
                        disabled:cursor-not-allowed
                      `}
                      aria-invalid={
                        Boolean(
                          errors.product_name
                        )
                      }
                    >
                      <option value="">
                        {!form.product_category
                          ? "Select Product Category First"
                          : productsLoading
                          ? "Loading Products..."
                          : productsError
                          ? "Unable to Load Products"
                          : products.length === 0
                          ? "No Products Available"
                          : "Select Product Name"}
                      </option>

                      {products.map(
                        (product) => (
                          <option
                            key={
                              product.id
                            }
                            value={
                              product.name
                            }
                          >
                            {
                              product.name
                            }
                          </option>
                        )
                      )}
                    </select>

                    {productsLoading ? (
                      <Loader2
                        size={17}
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          animate-spin
                          text-[#777]
                          pointer-events-none
                        "
                      />
                    ) : (
                      <ChevronDown
                        size={17}
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          pointer-events-none
                          text-[#777]
                        "
                      />
                    )}
                  </div>

                  <FieldError
                    message={
                      errors.product_name ||
                      productsError
                    }
                  />

                  {form.product_category &&
                    !productsLoading &&
                    !productsError &&
                    products.length >
                      0 && (
                      <p
                        className="
                          text-[11px]
                          text-[#999]
                          mt-2
                        "
                      >
                        {
                          products.length
                        }{" "}
                        {products.length ===
                        1
                          ? "product"
                          : "products"}{" "}
                        available
                      </p>
                    )}
                </div>

                {/* INVOICE NUMBER */}

                <div>
                  <FieldLabel required>
                    Invoice / Order Number
                  </FieldLabel>

                  <input
                    type="text"
                    name="invoice_order_number"
                    value={
                      form.invoice_order_number
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter invoice or order number"
                    maxLength={100}
                    className={
                      inputClass
                    }
                  />

                  <FieldError
                    message={
                      errors.invoice_order_number
                    }
                  />
                </div>

                {/* PURCHASE DATE */}

                <div>
                  <FieldLabel required>
                    Purchase Date
                  </FieldLabel>

                  <input
                    type="date"
                    name="purchase_date"
                    value={
                      form.purchase_date
                    }
                    onChange={
                      handleChange
                    }
                    max={
                      today
                    }
                    className={
                      inputClass
                    }
                    aria-invalid={
                      Boolean(
                        errors.purchase_date
                      )
                    }
                  />

                  <FieldError
                    message={
                      errors.purchase_date
                    }
                  />
                </div>
              </div>
            </div>

            {/* =============================================
                SECTION 03 - PROJECT INFORMATION
            ============================================= */}

            <div
              className="
                border
                border-[#e8e8e8]
                bg-white
                p-6
                md:p-10
              "
            >
              <SectionHeading
                number="03"
                title="Project Information"
                description="Tell us where and how the product will be used."
              />

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-x-7
                  gap-y-7
                "
              >
                {/* PROJECT TYPE */}

                <div>
                  <FieldLabel required>
                    Project Type
                  </FieldLabel>

                  <div
                    className="
                      relative
                    "
                  >
                    <select
                      name="project_type"
                      value={
                        form.project_type
                      }
                      onChange={
                        handleChange
                      }
                      className={`
                        ${inputClass}
                        appearance-none
                        pr-12
                        cursor-pointer
                      `}
                    >
                      <option value="">
                        Select Project Type
                      </option>

                      {PROJECT_TYPES.map(
                        (type) => (
                          <option
                            key={
                              type
                            }
                            value={
                              type
                            }
                          >
                            {
                              type
                            }
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={17}
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        pointer-events-none
                        text-[#777]
                      "
                    />
                  </div>

                  <FieldError
                    message={
                      errors.project_type
                    }
                  />
                </div>

                {/* INSTALLATION TYPE */}

                <div>
                  <FieldLabel required>
                    Installation Type
                  </FieldLabel>

                  <div
                    className="
                      relative
                    "
                  >
                    <select
                      name="installation_type"
                      value={
                        form.installation_type
                      }
                      onChange={
                        handleChange
                      }
                      className={`
                        ${inputClass}
                        appearance-none
                        pr-12
                        cursor-pointer
                      `}
                    >
                      <option value="">
                        Select Installation Type
                      </option>

                      {INSTALLATION_TYPES.map(
                        (type) => (
                          <option
                            key={
                              type
                            }
                            value={
                              type
                            }
                          >
                            {
                              type
                            }
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={17}
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        pointer-events-none
                        text-[#777]
                      "
                    />
                  </div>

                  <FieldError
                    message={
                      errors.installation_type
                    }
                  />
                </div>

                {/* OTHER INSTALLATION TYPE */}

                {form.installation_type ===
                  "Other" && (
                  <div
                    className="
                      md:col-span-2
                    "
                  >
                    <FieldLabel required>
                      Specify Installation Type
                    </FieldLabel>

                    <input
                      type="text"
                      name="installation_type_other"
                      value={
                        form.installation_type_other
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Describe your installation type"
                      maxLength={255}
                      className={
                        inputClass
                      }
                    />

                    <FieldError
                      message={
                        errors.installation_type_other
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* =============================================
                SECTION 04 - INSTALLATION INFORMATION
            ============================================= */}

            <div
              className="
                border
                border-[#e8e8e8]
                bg-white
                p-6
                md:p-10
              "
            >
              <SectionHeading
                number="04"
                title="Installation Information"
                description="Provide your installation details."
              />

              {/* INSTALLATION STATUS */}

              <div>
                <FieldLabel required>
                  Has Your Product Been Installed?
                </FieldLabel>

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                    mt-3
                  "
                >
                  {/* YES */}

                  <label
                    className={`
                      flex
                      items-center
                      gap-4
                      p-5
                      border
                      cursor-pointer
                      transition-all
                      duration-300

                      ${
                        form.is_installed ===
                        "true"
                          ? "border-[#161412] bg-[#fafafa]"
                          : "border-[#e5e5e5] hover:border-[#aaa]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="is_installed"
                      value="true"
                      checked={
                        form.is_installed ===
                        "true"
                      }
                      onChange={
                        handleChange
                      }
                      className="
                        accent-[#c91f26]
                      "
                    />

                    <div>
                      <p
                        className="
                          text-[14px]
                          font-semibold
                          text-[#161412]
                        "
                      >
                        Yes, Installed
                      </p>

                      <p
                        className="
                          text-[12px]
                          text-[#888]
                          mt-1
                        "
                      >
                        Installation is complete
                      </p>
                    </div>
                  </label>

                  {/* NO */}

                  <label
                    className={`
                      flex
                      items-center
                      gap-4
                      p-5
                      border
                      cursor-pointer
                      transition-all
                      duration-300

                      ${
                        form.is_installed ===
                        "false"
                          ? "border-[#161412] bg-[#fafafa]"
                          : "border-[#e5e5e5] hover:border-[#aaa]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="is_installed"
                      value="false"
                      checked={
                        form.is_installed ===
                        "false"
                      }
                      onChange={
                        handleChange
                      }
                      className="
                        accent-[#c91f26]
                      "
                    />

                    <div>
                      <p
                        className="
                          text-[14px]
                          font-semibold
                          text-[#161412]
                        "
                      >
                        Not Yet Installed
                      </p>

                      <p
                        className="
                          text-[12px]
                          text-[#888]
                          mt-1
                        "
                      >
                        Installation is pending
                      </p>
                    </div>
                  </label>
                </div>

                <FieldError
                  message={
                    errors.is_installed
                  }
                />
              </div>

              {/* ===========================================
                  INSTALLED PRODUCT DETAILS
              =========================================== */}

              {form.is_installed ===
                "true" && (
                <div
                  className="
                    mt-9
                    pt-9
                    border-t
                    border-[#ededed]
                  "
                >
                  <h3
                    className="
                      text-[15px]
                      font-semibold
                      text-[#161412]
                      mb-7
                    "
                  >
                    Completed Installation Details
                  </h3>

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-x-7
                      gap-y-7
                    "
                  >
                    {/* INSTALLATION DATE */}

                    <div>
                      <FieldLabel required>
                        Installation Date
                      </FieldLabel>

                      <input
                        type="date"
                        name="installation_date"
                        value={
                          form.installation_date
                        }
                        onChange={
                          handleChange
                        }
                        min={
                          form.purchase_date ||
                          undefined
                        }
                        max={
                          today
                        }
                        className={
                          inputClass
                        }
                        aria-invalid={
                          Boolean(
                            errors.installation_date
                          )
                        }
                      />

                      <FieldError
                        message={
                          errors.installation_date
                        }
                      />
                    </div>

                    {/* INSTALLATION ADDRESS */}

                    <div
                      className="
                        md:col-span-2
                      "
                    >
                      <FieldLabel required>
                        Installation Address
                      </FieldLabel>

                      <textarea
                        name="installation_address"
                        value={
                          form.installation_address
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter complete installation address"
                        className={
                          textareaClass
                        }
                      />

                      <FieldError
                        message={
                          errors.installation_address
                        }
                      />
                    </div>

                    {/* FABRICATOR NAME */}

                    <div>
                      <FieldLabel>
                        Fabricator / Installer Name
                      </FieldLabel>

                      <input
                        type="text"
                        name="fabricator_installer_name"
                        value={
                          form.fabricator_installer_name
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter fabricator or installer name"
                        maxLength={255}
                        className={
                          inputClass
                        }
                      />
                    </div>

                    {/* FABRICATOR CONTACT */}

                    <div>
                      <FieldLabel>
                        Fabricator / Installer Contact
                      </FieldLabel>

                      <input
                        type="text"
                        name="fabricator_installer_contact"
                        value={
                          form.fabricator_installer_contact
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter contact information"
                        maxLength={255}
                        className={
                          inputClass
                        }
                      />
                    </div>
                  </div>

                  {/* =======================================
                      INSTALLATION PHOTOS
                  ======================================= */}

                  <div
                    className="
                      mt-9
                    "
                  >
                    <FieldLabel required>
                      Installation Photos
                    </FieldLabel>

                    <p
                      className="
                        text-[12px]
                        text-[#888]
                        mb-4
                        leading-relaxed
                      "
                    >
                      Upload clear photographs showing
                      the completed installation.
                      Maximum 10 images, 10 MB each.
                    </p>

                    <input
                      ref={
                        photosInputRef
                      }
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      multiple
                      onChange={
                        handlePhotosChange
                      }
                      className="
                        hidden
                      "
                    />

                    {/* UPLOAD AREA */}

                    <button
                      type="button"
                      onClick={() =>
                        photosInputRef.current?.click()
                      }
                      disabled={
                        installationPhotos.length >=
                          MAX_PHOTOS ||
                        submitting
                      }
                      className="
                        w-full
                        min-h-[150px]
                        border-2
                        border-dashed
                        border-[#dedede]
                        bg-[#fafafa]
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-3
                        cursor-pointer
                        hover:border-[#161412]
                        transition-colors
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >
                      <ImagePlus
                        size={30}
                        strokeWidth={1.4}
                        className="
                          text-[#777]
                        "
                      />

                      <span
                        className="
                          text-[13px]
                          font-semibold
                          text-[#333]
                        "
                      >
                        Click to Upload Installation Photos
                      </span>

                      <span
                        className="
                          text-[11px]
                          text-[#999]
                        "
                      >
                        JPG, PNG, WebP
                      </span>
                    </button>

                    <FieldError
                      message={
                        errors.installation_photos
                      }
                    />

                    {/* PHOTO PREVIEWS */}

                    {photoPreviews.length >
                      0 && (
                      <div
                        className="
                          grid
                          grid-cols-2
                          sm:grid-cols-3
                          md:grid-cols-4
                          lg:grid-cols-5
                          gap-4
                          mt-6
                        "
                      >
                        {photoPreviews.map(
                          (
                            photo,
                            index
                          ) => (
                            <div
                              key={`${photo.name}-${index}`}
                              className="
                                relative
                                aspect-square
                                border
                                border-[#e5e5e5]
                                bg-[#f5f5f5]
                                group
                              "
                            >
                              <img
                                src={
                                  photo.url
                                }
                                alt={`Installation ${index + 1}`}
                                className="
                                  w-full
                                  h-full
                                  object-cover
                                "
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removePhoto(
                                    index
                                  )
                                }
                                disabled={
                                  submitting
                                }
                                aria-label={`Remove installation photo ${index + 1}`}
                                className="
                                  absolute
                                  top-2
                                  right-2
                                  w-8
                                  h-8
                                  bg-[#161412]
                                  text-white
                                  flex
                                  items-center
                                  justify-center
                                  hover:bg-[#c91f26]
                                  cursor-pointer
                                  disabled:cursor-not-allowed
                                "
                              >
                                <X
                                  size={
                                    15
                                  }
                                />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {installationPhotos.length >
                      0 && (
                      <p
                        className="
                          text-[12px]
                          text-[#888]
                          mt-4
                        "
                      >
                        {
                          installationPhotos.length
                        }{" "}
                        of{" "}
                        {
                          MAX_PHOTOS
                        }{" "}
                        photos selected
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ===========================================
                  NOT INSTALLED
              =========================================== */}

              {form.is_installed ===
                "false" && (
                <div
                  className="
                    mt-9
                    pt-9
                    border-t
                    border-[#ededed]
                  "
                >
                  <h3
                    className="
                      text-[15px]
                      font-semibold
                      text-[#161412]
                      mb-7
                    "
                  >
                    Planned Installation Details
                  </h3>

                  <div
                    className="
                      max-w-[500px]
                    "
                  >
                    <FieldLabel required>
                      Tentative Installation Date
                    </FieldLabel>

                    <input
                      type="date"
                      name="tentative_installation_date"
                      value={
                        form.tentative_installation_date
                      }
                      onChange={
                        handleChange
                      }
                      min={
                        today
                      }
                      className={
                        inputClass
                      }
                      aria-invalid={
                        Boolean(
                          errors.tentative_installation_date
                        )
                      }
                    />

                    <FieldError
                      message={
                        errors.tentative_installation_date
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* =============================================
                SECTION 05 - PURCHASE DOCUMENT
            ============================================= */}

            <div
              className="
                border
                border-[#e8e8e8]
                bg-white
                p-6
                md:p-10
              "
            >
              <SectionHeading
                number="05"
                title="Purchase Documentation"
                description="Upload proof of purchase."
              />

              <div>
                <FieldLabel required>
                  Purchase Invoice
                </FieldLabel>

                <p
                  className="
                    text-[12px]
                    text-[#888]
                    mb-5
                    leading-relaxed
                  "
                >
                  Upload a copy of your purchase invoice
                  or order confirmation. Accepted
                  formats: PDF, JPG, PNG.
                  Maximum file size: 15 MB.
                </p>

                <input
                  ref={
                    invoiceInputRef
                  }
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={
                    handleInvoiceChange
                  }
                  className="
                    hidden
                  "
                />

                {!invoiceFile ? (
                  <button
                    type="button"
                    onClick={() =>
                      invoiceInputRef.current?.click()
                    }
                    disabled={
                      submitting
                    }
                    className="
                      w-full
                      min-h-[170px]
                      border-2
                      border-dashed
                      border-[#dedede]
                      bg-[#fafafa]
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-3
                      cursor-pointer
                      hover:border-[#161412]
                      transition-colors
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    <UploadCloud
                      size={32}
                      strokeWidth={1.4}
                      className="
                        text-[#777]
                      "
                    />

                    <span
                      className="
                        text-[13px]
                        font-semibold
                        text-[#333]
                      "
                    >
                      Click to Upload Purchase Invoice
                    </span>

                    <span
                      className="
                        text-[11px]
                        text-[#999]
                      "
                    >
                      PDF, JPG, PNG — Max 15 MB
                    </span>
                  </button>
                ) : (
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      border
                      border-[#e5e5e5]
                      bg-[#fafafa]
                      p-5
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-4
                        min-w-0
                      "
                    >
                      <div
                        className="
                          w-[50px]
                          h-[55px]
                          bg-white
                          border
                          border-[#e5e5e5]
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <FileText
                          size={25}
                          strokeWidth={1.5}
                          className="
                            text-[#c91f26]
                          "
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                        "
                      >
                        <p
                          className="
                            text-[13px]
                            font-semibold
                            text-[#161412]
                            truncate
                          "
                        >
                          {
                            invoiceFile.name
                          }
                        </p>

                        <p
                          className="
                            text-[11px]
                            text-[#888]
                            mt-1
                          "
                        >
                          {formatFileSize(
                            invoiceFile.size
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceFile(
                          null
                        );

                        if (
                          invoiceInputRef.current
                        ) {
                          invoiceInputRef.current.value =
                            "";
                        }
                      }}
                      disabled={
                        submitting
                      }
                      className="
                        w-9
                        h-9
                        shrink-0
                        flex
                        items-center
                        justify-center
                        text-[#777]
                        hover:text-[#c91f26]
                        cursor-pointer
                        disabled:cursor-not-allowed
                      "
                      aria-label="Remove purchase invoice"
                    >
                      <X
                        size={
                          20
                        }
                      />
                    </button>
                  </div>
                )}

                <FieldError
                  message={
                    errors.purchase_invoice
                  }
                />
              </div>
            </div>

            {/* =============================================
                SECTION 06 - DECLARATION
            ============================================= */}

            <div
              className="
                border
                border-[#e8e8e8]
                bg-white
                p-6
                md:p-10
              "
            >
              <SectionHeading
                number="06"
                title="Declaration & Confirmation"
                description="Please review and confirm the information provided."
              />

              <label
                className="
                  flex
                  items-start
                  gap-4
                  cursor-pointer
                "
              >
                <input
                  type="checkbox"
                  name="declaration_accepted"
                  checked={
                    form.declaration_accepted
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-[18px]
                    h-[18px]
                    mt-1
                    shrink-0
                    accent-[#c91f26]
                    cursor-pointer
                  "
                />

                <span
                  className="
                    text-[13px]
                    text-[#555]
                    leading-[1.9]
                  "
                >
                  I hereby declare that the information
                  provided in this registration form is
                  accurate and complete to the best of
                  my knowledge. I understand that the
                  submitted details and documents may
                  be reviewed and verified by Ultra Stones
                  as part of the product registration process.

                  <span
                    className="
                      text-[#c91f26]
                      ml-1
                    "
                  >
                    *
                  </span>
                </span>
              </label>

              <FieldError
                message={
                  errors.declaration_accepted
                }
              />

              <div
                className="
                  flex
                  items-start
                  gap-3
                  bg-[#f8f8f8]
                  p-5
                  mt-7
                "
              >
                <ShieldCheck
                  size={21}
                  strokeWidth={1.5}
                  className="
                    text-[#777]
                    shrink-0
                  "
                />

                <p
                  className="
                    text-[12px]
                    text-[#777]
                    leading-[1.8]
                  "
                >
                  Submitting this form records your
                  product registration with Ultra Stones.
                  Please retain your registration number
                  for future reference.
                </p>
              </div>
            </div>

            {/* =============================================
                SUBMIT BUTTON
            ============================================= */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-6
                pt-2
              "
            >
              <p
                className="
                  text-[12px]
                  text-[#888]
                  leading-relaxed
                  max-w-[450px]
                "
              >
                Please verify all information and
                uploaded documents before submitting
                your registration.
              </p>

              <button
                type="submit"
                disabled={
                  submitting ||
                  categoriesLoading ||
                  productsLoading
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  bg-[#161412]
                  text-white
                  px-10
                  py-[18px]
                  min-w-[260px]
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[1.2px]
                  hover:bg-[#c91f26]
                  transition-colors
                  duration-300
                  cursor-pointer
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="
                        animate-spin
                      "
                    />

                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Registration

                    <ArrowRight
                      size={18}
                    />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}