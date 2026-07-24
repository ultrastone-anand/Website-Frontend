import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';


const API_URL =
  import.meta.env.VITE_API_URL;

const INITIAL_FILTERS = {
  employmentType: '',
  location: '',
  department: '',
};

const INITIAL_FILTER_OPTIONS = {
  departments: [],
  locations: [],
  employmentTypes: [],
  workModes: [],
};

const INITIAL_RESUME_FORM = {
  fullName: '',
  email: '',
  phone: '',
  department: '',
  message: '',
  resume: null,
};

const formatEnumLabel = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

const splitFullName = (fullName) => {
  const nameParts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    firstName: nameParts[0] || '',
    lastName:
      nameParts.slice(1).join(' ') || '-',
  };
};

const CustomSelect = ({
  name,
  value,
  onChange,
  children,
}) => (
  <div className="relative">
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="
        w-full
        h-[58px]
        bg-white
        border
        border-[#e5e5e5]
        px-5
        pr-12
        appearance-none
        outline-none
        text-[#555]
        cursor-pointer
        transition-colors
        focus:border-[#c91f26]
      "
    >
      {children}
    </select>

    <svg
      className="
        absolute
        right-5
        top-1/2
        -translate-y-1/2
        w-4
        h-4
        pointer-events-none
        text-[#555]
      "
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

CustomSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const Career = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState(
    INITIAL_FILTERS
  );

  const [
    filterOptions,
    setFilterOptions,
  ] = useState(
    INITIAL_FILTER_OPTIONS
  );

  const [
    jobsLoading,
    setJobsLoading,
  ] = useState(true);

  const [jobsError, setJobsError] =
    useState('');

  const [
    resumeForm,
    setResumeForm,
  ] = useState(
    INITIAL_RESUME_FORM
  );

  const [
    resumeSubmitting,
    setResumeSubmitting,
  ] = useState(false);

  const [
    resumeMessage,
    setResumeMessage,
  ] = useState({
    type: '',
    text: '',
  });

  const fetchFilters =
    useCallback(async () => {
      try {
        const response = await fetch(
          `${API_URL}/careers/jobs/filters`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              'Failed to load job filters'
          );
        }

        setFilterOptions({
          departments:
            result.data?.departments ||
            [],

          locations:
            result.data?.locations ||
            [],

          employmentTypes:
            result.data
              ?.employmentTypes ||
            [],

          workModes:
            result.data?.workModes ||
            [],
        });
      } catch (error) {
        console.error(
          'Career Filters Error:',
          error
        );
      }
    }, []);

  const fetchJobs = useCallback(
    async (
      selectedFilters =
        INITIAL_FILTERS
    ) => {
      try {
        setJobsLoading(true);
        setJobsError('');

        const query =
          new URLSearchParams();

        query.set('page', '1');
        query.set('limit', '100');

        if (
          selectedFilters.employmentType
        ) {
          query.set(
            'employment_type',
            selectedFilters.employmentType
          );
        }

        if (
          selectedFilters.location
        ) {
          query.set(
            'location',
            selectedFilters.location
          );
        }

        if (
          selectedFilters.department
        ) {
          query.set(
            'department',
            selectedFilters.department
          );
        }

        const response = await fetch(
          `${API_URL}/careers/jobs?${query.toString()}`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              'Failed to load career jobs'
          );
        }

        setJobs(result.data || []);
      } catch (error) {
        console.error(
          'Career Jobs Error:',
          error
        );

        setJobs([]);

        setJobsError(
          error.message ||
            'Unable to load career jobs.'
        );
      } finally {
        setJobsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFilters();
    fetchJobs(INITIAL_FILTERS);
  }, [fetchFilters, fetchJobs]);

  const handleFilterChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSearchJobs = () => {
    fetchJobs(filters);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    fetchJobs(INITIAL_FILTERS);
  };

  const handleResumeInputChange = (
    event
  ) => {
    const {
      name,
      value,
      files,
    } = event.target;

    setResumeMessage({
      type: '',
      text: '',
    });

    setResumeForm((previous) => ({
      ...previous,

      [name]:
        name === 'resume'
          ? files?.[0] || null
          : value,
    }));
  };

  const handleSubmitResume =
    async (event) => {
      event.preventDefault();

      const {
        firstName,
        lastName,
      } = splitFullName(
        resumeForm.fullName
      );

      if (!firstName) {
        setResumeMessage({
          type: 'error',
          text:
            'Please enter your full name.',
        });

        return;
      }

      if (!resumeForm.email.trim()) {
        setResumeMessage({
          type: 'error',
          text:
            'Please enter your email address.',
        });

        return;
      }

      if (!resumeForm.resume) {
        setResumeMessage({
          type: 'error',
          text:
            'Please upload your resume.',
        });

        return;
      }

      try {
        setResumeSubmitting(true);

        setResumeMessage({
          type: '',
          text: '',
        });

        const formData =
          new FormData();

        formData.append(
          'application_type',
          'GENERAL_RESUME'
        );

        formData.append(
          'first_name',
          firstName
        );

        formData.append(
          'last_name',
          lastName
        );

        formData.append(
          'email',
          resumeForm.email.trim()
        );

        formData.append(
          'phone',
          resumeForm.phone.trim()
        );

        formData.append(
          'department',
          resumeForm.department.trim()
        );

        formData.append(
          'message',
          resumeForm.message.trim()
        );

        formData.append(
          'source_page',
          '/careers'
        );

        formData.append(
          'resume',
          resumeForm.resume
        );

        const response = await fetch(
          `${API_URL}/careers/applications`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              'Failed to submit resume'
          );
        }

        setResumeMessage({
          type: 'success',
          text:
            'Your resume has been submitted successfully.',
        });

        setResumeForm(
          INITIAL_RESUME_FORM
        );

        const resumeInput =
          document.getElementById(
            'general-resume-file'
          );

        if (resumeInput) {
          resumeInput.value = '';
        }
      } catch (error) {
        console.error(
          'Resume Submission Error:',
          error
        );

        setResumeMessage({
          type: 'error',
          text:
            error.message ||
            'Failed to submit your resume.',
        });
      } finally {
        setResumeSubmitting(false);
      }
    };

  const hasActiveFilters =
    Boolean(
      filters.employmentType ||
        filters.location ||
        filters.department
    );

  return (
    <>

      <div className="min-h-screen pt-[110px]">
        <section className="py-12">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="
                text-[34px]
                md:text-[42px]
                font-semibold
                text-[#161412]
              "
              style={{
                fontFamily:
                  'Montserrat, sans-serif',
              }}
            >
              Careers
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4" />

            <p className="text-[13px] text-[#777]">
              <Link
                to="/"
                className="hover:text-[#161412]"
              >
                Home
              </Link>

              {' / '}

              <Link
                to="/resource-center"
                className="hover:text-[#161412]"
              >
                Resource Center
              </Link>

              {' / '}

              <span className="font-semibold text-[#161412]">
                Careers
              </span>
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <CustomSelect
                name="employmentType"
                value={
                  filters.employmentType
                }
                onChange={
                  handleFilterChange
                }
              >
                <option value="">
                  All Job Types
                </option>

                {filterOptions.employmentTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {formatEnumLabel(
                        type
                      )}
                    </option>
                  )
                )}
              </CustomSelect>

              <CustomSelect
                name="location"
                value={filters.location}
                onChange={
                  handleFilterChange
                }
              >
                <option value="">
                  All Locations
                </option>

                {filterOptions.locations.map(
                  (location) => (
                    <option
                      key={location}
                      value={location}
                    >
                      {location}
                    </option>
                  )
                )}
              </CustomSelect>

              <CustomSelect
                name="department"
                value={
                  filters.department
                }
                onChange={
                  handleFilterChange
                }
              >
                <option value="">
                  All Departments
                </option>

                {filterOptions.departments.map(
                  (department) => (
                    <option
                      key={department}
                      value={department}
                    >
                      {department}
                    </option>
                  )
                )}
              </CustomSelect>

              <button
                type="button"
                onClick={handleSearchJobs}
                disabled={jobsLoading}
                className="
                  h-[58px]
                  bg-[#c91f26]
                  text-white
                  font-medium
                  hover:bg-[#a9191f]
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  duration-300
                "
              >
                {jobsLoading
                  ? 'Searching...'
                  : 'Search Jobs'}
              </button>
            </div>

            <div className="min-h-[32px] mb-8 text-right">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  disabled={jobsLoading}
                  className="
                    text-sm
                    text-[#777]
                    underline
                    hover:text-[#c91f26]
                    disabled:opacity-50
                  "
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid lg:grid-cols-[1fr_360px] gap-10">
              <div className="bg-white">
                {jobsLoading && (
                  <div className="py-20 text-center">
                    <div
                      className="
                        inline-block
                        w-9
                        h-9
                        border-[3px]
                        border-[#e5e5e5]
                        border-t-[#c91f26]
                        rounded-full
                        animate-spin
                      "
                    />

                    <p className="mt-4 text-[#777]">
                      Loading available
                      positions...
                    </p>
                  </div>
                )}

                {!jobsLoading &&
                  jobsError && (
                    <div
                      className="
                        py-12
                        px-6
                        border
                        border-red-200
                        bg-red-50
                        text-red-700
                      "
                    >
                      {jobsError}
                    </div>
                  )}

                {!jobsLoading &&
                  !jobsError &&
                  jobs.length === 0 && (
                    <div
                      className="
                        py-16
                        px-6
                        text-center
                        border
                        border-[#e5e5e5]
                      "
                    >
                      <h2
                        className="
                          text-[28px]
                          text-[#161412]
                        "
                        style={{
                          fontFamily:
                            '"Cormorant Garamond", serif',
                        }}
                      >
                        No Positions Found
                      </h2>

                      <p className="mt-3 text-[#666]">
                        No current openings
                        match the selected
                        filters.
                      </p>
                    </div>
                  )}

                {!jobsLoading &&
                  !jobsError &&
                  jobs.map(
                    (job, index) => (
                      <article
                        key={job.id}
                        className={`
                          py-10
                          px-6
                          ${
                            index !==
                            jobs.length - 1
                              ? 'border-b border-[#e5e5e5]'
                              : ''
                          }
                        `}
                      >
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.department && (
                                <span
                                  className="
                                    px-3
                                    py-1
                                    bg-[#f7f7f7]
                                    text-[12px]
                                    text-[#555]
                                  "
                                >
                                  {
                                    job.department
                                  }
                                </span>
                              )}

                              {job.employment_type && (
                                <span
                                  className="
                                    px-3
                                    py-1
                                    border
                                    border-[#e5e5e5]
                                    text-[12px]
                                    text-[#555]
                                  "
                                >
                                  {formatEnumLabel(
                                    job.employment_type
                                  )}
                                </span>
                              )}

                              {job.work_mode && (
                                <span
                                  className="
                                    px-3
                                    py-1
                                    border
                                    border-[#e5e5e5]
                                    text-[12px]
                                    text-[#555]
                                  "
                                >
                                  {formatEnumLabel(
                                    job.work_mode
                                  )}
                                </span>
                              )}

                              {job.is_featured && (
                                <span
                                  className="
                                    px-3
                                    py-1
                                    bg-[#c91f26]
                                    text-white
                                    text-[12px]
                                  "
                                >
                                  Featured
                                </span>
                              )}
                            </div>

                            <h2
                              className="
                                text-[26px]
                                md:text-[34px]
                                text-[#161412]
                                mb-4
                              "
                              style={{
                                fontFamily:
                                  '"Cormorant Garamond", serif',
                              }}
                            >
                              {job.title}
                            </h2>

                            <p
                              className="
                                text-[#555]
                                leading-[1.8]
                                max-w-[900px]
                              "
                            >
                              {job.short_description ||
                                'Explore this career opportunity at Ultra Stones.'}
                            </p>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-[13px] text-[#777]">
                              {job.experience_required && (
                                <span>
                                  Experience:{' '}
                                  {
                                    job.experience_required
                                  }
                                </span>
                              )}

                              {job.vacancies && (
                                <span>
                                  Vacancies:{' '}
                                  {
                                    job.vacancies
                                  }
                                </span>
                              )}

                              {job.salary_range && (
                                <span>
                                  Salary:{' '}
                                  {
                                    job.salary_range
                                  }
                                </span>
                              )}
                            </div>
                          </div>

                          <div
                            className="
                              flex
                              flex-col
                              lg:items-end
                              gap-4
                              min-w-[190px]
                            "
                          >
                            <span className="text-sm text-[#777]">
                              {job.location ||
                                'Location not specified'}
                            </span>

                            <Link
                              to={`/careers/${job.slug}`}
                              className="
                                bg-[#c91f26]
                                text-white
                                px-6
                                py-3
                                text-sm
                                text-center
                                hover:bg-[#a9191f]
                                duration-300
                              "
                            >
                              More Details
                            </Link>
                          </div>
                        </div>
                      </article>
                    )
                  )}
              </div>

              <aside
                className="
                  bg-white
                  border
                  border-[#e5e5e5]
                  p-6
                  h-fit
                  lg:sticky
                  lg:top-[140px]
                "
              >
                <h3
                  className="
                    text-[24px]
                    text-[#161412]
                    mb-3
                  "
                  style={{
                    fontFamily:
                      '"Cormorant Garamond", serif',
                  }}
                >
                  Submit Your Resume
                </h3>

                <p
                  className="
                    text-[14px]
                    text-[#666]
                    mb-6
                    leading-relaxed
                  "
                >
                  Didn&apos;t find the
                  right opening? Upload
                  your resume and
                  we&apos;ll get in touch
                  when something matches.
                </p>

                {resumeMessage.text && (
                  <div
                    className={`
                      mb-5
                      p-3
                      text-sm
                      border
                      ${
                        resumeMessage.type ===
                        'success'
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }
                    `}
                  >
                    {resumeMessage.text}
                  </div>
                )}

                <form
                  onSubmit={
                    handleSubmitResume
                  }
                  className="space-y-4"
                >
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Full Name*"
                    value={
                      resumeForm.fullName
                    }
                    onChange={
                      handleResumeInputChange
                    }
                    className="
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                      focus:border-[#c91f26]
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email*"
                    value={
                      resumeForm.email
                    }
                    onChange={
                      handleResumeInputChange
                    }
                    className="
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                      focus:border-[#c91f26]
                    "
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={
                      resumeForm.phone
                    }
                    onChange={
                      handleResumeInputChange
                    }
                    className="
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                      focus:border-[#c91f26]
                    "
                  />

                  <input
                    type="text"
                    name="department"
                    placeholder="Preferred Department"
                    value={
                      resumeForm.department
                    }
                    onChange={
                      handleResumeInputChange
                    }
                    className="
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                      focus:border-[#c91f26]
                    "
                  />

                  <textarea
                    rows={5}
                    name="message"
                    placeholder="Tell us about yourself"
                    value={
                      resumeForm.message
                    }
                    onChange={
                      handleResumeInputChange
                    }
                    className="
                      w-full
                      border
                      border-[#ddd]
                      px-4
                      py-3
                      resize-none
                      outline-none
                      focus:border-[#c91f26]
                    "
                  />

                  <div>
                    <label
                      htmlFor="general-resume-file"
                      className="
                        block
                        text-sm
                        font-medium
                        text-[#333]
                        mb-2
                      "
                    >
                      Resume*
                    </label>

                    <input
                      id="general-resume-file"
                      type="file"
                      name="resume"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={
                        handleResumeInputChange
                      }
                      className="w-full text-sm"
                    />

                    <p className="mt-2 text-[12px] text-[#888]">
                      Accepted formats:
                      PDF, DOC and DOCX.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      resumeSubmitting
                    }
                    className="
                      w-full
                      h-[52px]
                      bg-[#c91f26]
                      text-white
                      font-medium
                      hover:bg-[#a9191f]
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      duration-300
                    "
                  >
                    {resumeSubmitting
                      ? 'Submitting...'
                      : 'Submit Resume'}
                  </button>
                </form>
              </aside>
            </div>
          </div>
        </section>
      </div>

    </>
  );
};

export default Career;