import {
  useEffect,
  useState,
} from 'react';
import {
  Link,
  useParams,
} from 'react-router-dom';


const API_URL =
  import.meta.env.VITE_API_URL;

const EXPERIENCE_OPTIONS = [
  {
    value: 'ZERO_TO_TWO',
    label: '0 - 2 Years',
  },
  {
    value: 'THREE_TO_FIVE',
    label: '3 - 5 Years',
  },
  {
    value: 'FIVE_PLUS',
    label: '5+ Years',
  },
];

const INITIAL_APPLICATION_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  experienceLevel: '',
  yearsOfExperience: '',
  resume: null,
  coverLetter: null,
};

const formatEnumLabel = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  const parsedDate =
    new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return '';
  }

  return parsedDate.toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
};

const CareerDetails = () => {
  const { slug } = useParams();

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [
    applicationForm,
    setApplicationForm,
  ] = useState(
    INITIAL_APPLICATION_FORM
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submissionMessage,
    setSubmissionMessage,
  ] = useState({
    type: '',
    text: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${API_URL}/careers/jobs/${encodeURIComponent(
            slug
          )}`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              'Failed to load this position'
          );
        }

        if (isMounted) {
          setJob(result.data || null);
        }
      } catch (fetchError) {
        console.error(
          'Career Detail Error:',
          fetchError
        );

        if (isMounted) {
          setJob(null);

          setError(
            fetchError.message ||
              'Unable to load this position.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchJob();
    } else {
      setLoading(false);
      setError('Job slug is missing.');
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
      files,
    } = event.target;

    const isFileField =
      name === 'resume' ||
      name === 'coverLetter';

    setSubmissionMessage({
      type: '',
      text: '',
    });

    setApplicationForm(
      (previous) => ({
        ...previous,

        [name]: isFileField
          ? files?.[0] || null
          : value,
      })
    );
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (!job?.id) {
        setSubmissionMessage({
          type: 'error',
          text:
            'This position is currently unavailable.',
        });

        return;
      }

      if (
        !applicationForm.firstName.trim()
      ) {
        setSubmissionMessage({
          type: 'error',
          text:
            'Please enter your first name.',
        });

        return;
      }

      if (
        !applicationForm.lastName.trim()
      ) {
        setSubmissionMessage({
          type: 'error',
          text:
            'Please enter your last name.',
        });

        return;
      }

      if (
        !applicationForm.email.trim()
      ) {
        setSubmissionMessage({
          type: 'error',
          text:
            'Please enter your email address.',
        });

        return;
      }

      if (!applicationForm.resume) {
        setSubmissionMessage({
          type: 'error',
          text:
            'Please upload your resume.',
        });

        return;
      }

      try {
        setSubmitting(true);

        setSubmissionMessage({
          type: '',
          text: '',
        });

        const formData =
          new FormData();

        formData.append(
          'application_type',
          'JOB_APPLICATION'
        );

        formData.append(
          'job_id',
          job.id
        );

        formData.append(
          'first_name',
          applicationForm.firstName.trim()
        );

        formData.append(
          'last_name',
          applicationForm.lastName.trim()
        );

        formData.append(
          'email',
          applicationForm.email.trim()
        );

        formData.append(
          'phone',
          applicationForm.phone.trim()
        );

        formData.append(
          'department',
          job.department || ''
        );

        formData.append(
          'message',
          applicationForm.message.trim()
        );

        formData.append(
          'source_page',
          `/careers/${job.slug}`
        );

        if (
          applicationForm.experienceLevel
        ) {
          formData.append(
            'experience_level',
            applicationForm.experienceLevel
          );
        }

        if (
          applicationForm.yearsOfExperience !==
          ''
        ) {
          formData.append(
            'years_of_experience',
            applicationForm.yearsOfExperience
          );
        }

        formData.append(
          'resume',
          applicationForm.resume
        );

        if (
          applicationForm.coverLetter
        ) {
          formData.append(
            'cover_letter',
            applicationForm.coverLetter
          );
        }

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
              'Failed to submit application'
          );
        }

        setSubmissionMessage({
          type: 'success',
          text:
            'Your application has been submitted successfully.',
        });

        setApplicationForm(
          INITIAL_APPLICATION_FORM
        );

        const resumeInput =
          document.getElementById(
            'job-resume-file'
          );

        const coverLetterInput =
          document.getElementById(
            'job-cover-letter-file'
          );

        if (resumeInput) {
          resumeInput.value = '';
        }

        if (coverLetterInput) {
          coverLetterInput.value = '';
        }
      } catch (submitError) {
        console.error(
          'Application Submission Error:',
          submitError
        );

        setSubmissionMessage({
          type: 'error',
          text:
            submitError.message ||
            'Failed to submit your application.',
        });
      } finally {
        setSubmitting(false);
      }
    };

  if (loading) {
    return (
      <>
        <div
          className="
            min-h-screen
            pt-[110px]
            flex
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <div
              className="
                inline-block
                w-10
                h-10
                border-[3px]
                border-[#e5e5e5]
                border-t-[#c91f26]
                rounded-full
                animate-spin
              "
            />

            <p className="mt-4 text-[#777]">
              Loading position...
            </p>
          </div>
        </div>

      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <div
          className="
            min-h-screen
            pt-[110px]
            flex
            items-center
            justify-center
            px-6
          "
        >
          <div className="text-center max-w-[600px]">
            <h1
              className="
                text-[38px]
                text-[#161412]
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Position Not Available
            </h1>

            <p className="mt-4 text-[#666]">
              {error ||
                'This career opportunity is no longer available.'}
            </p>

            <Link
              to="/careers"
              className="
                inline-block
                mt-8
                bg-[#c91f26]
                text-white
                px-7
                py-3
                hover:bg-[#a9191f]
                duration-300
              "
            >
              View All Careers
            </Link>
          </div>
        </div>

      </>
    );
  }

  return (
    <>

      <div className="min-h-screen pt-[110px]">
        <section className="py-12">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <p className="text-[13px] text-[#777] mb-5">
              <Link
                to="/"
                className="hover:text-[#161412]"
              >
                Home
              </Link>

              {' / '}

              <Link
                to="/careers"
                className="hover:text-[#161412]"
              >
                Careers
              </Link>

              {' / '}

              <span className="font-semibold text-[#161412]">
                {job.title}
              </span>
            </p>

            <h1
              className="
                text-[38px]
                md:text-[52px]
                text-[#161412]
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-3 mt-6">
              {job.employment_type && (
                <span
                  className="
                    px-4
                    py-2
                    bg-white
                    border
                    border-[#e5e5e5]
                    text-[14px]
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
                    px-4
                    py-2
                    bg-white
                    border
                    border-[#e5e5e5]
                    text-[14px]
                  "
                >
                  {formatEnumLabel(
                    job.work_mode
                  )}
                </span>
              )}

              {job.location && (
                <span
                  className="
                    px-4
                    py-2
                    bg-white
                    border
                    border-[#e5e5e5]
                    text-[14px]
                  "
                >
                  {job.location}
                </span>
              )}

              {job.department && (
                <span
                  className="
                    px-4
                    py-2
                    bg-[#c91f26]
                    text-white
                    text-[14px]
                  "
                >
                  {job.department}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <div className="grid lg:grid-cols-[1fr_500px] gap-10 xl:gap-16">
              <main>
                <div
                  className="
                    grid
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                    mb-12
                  "
                >
                  {job.experience_required && (
                    <div className="border border-[#e5e5e5] p-5">
                      <p className="text-[12px] uppercase tracking-wide text-[#888]">
                        Experience
                      </p>

                      <p className="mt-2 text-[#222] font-medium">
                        {
                          job.experience_required
                        }
                      </p>
                    </div>
                  )}

                  {job.education_required && (
                    <div className="border border-[#e5e5e5] p-5">
                      <p className="text-[12px] uppercase tracking-wide text-[#888]">
                        Education
                      </p>

                      <p className="mt-2 text-[#222] font-medium">
                        {
                          job.education_required
                        }
                      </p>
                    </div>
                  )}

                  {job.vacancies && (
                    <div className="border border-[#e5e5e5] p-5">
                      <p className="text-[12px] uppercase tracking-wide text-[#888]">
                        Vacancies
                      </p>

                      <p className="mt-2 text-[#222] font-medium">
                        {job.vacancies}
                      </p>
                    </div>
                  )}

                  {job.closing_date && (
                    <div className="border border-[#e5e5e5] p-5">
                      <p className="text-[12px] uppercase tracking-wide text-[#888]">
                        Closing Date
                      </p>

                      <p className="mt-2 text-[#222] font-medium">
                        {formatDate(
                          job.closing_date
                        )}
                      </p>
                    </div>
                  )}

                  {job.salary_range && (
                    <div className="border border-[#e5e5e5] p-5">
                      <p className="text-[12px] uppercase tracking-wide text-[#888]">
                        Salary Range
                      </p>

                      <p className="mt-2 text-[#222] font-medium">
                        {
                          job.salary_range
                        }
                      </p>
                    </div>
                  )}
                </div>

                {(job.office_hours ||
                  job.location) && (
                  <div className="mb-12">
                    <p
                      className="
                        text-[#555]
                        leading-[1.9]
                        whitespace-pre-line
                      "
                    >
                      {job.office_hours
                        ? `Office Hours: ${job.office_hours}`
                        : ''}

                      {job.office_hours &&
                      job.location
                        ? '\n'
                        : ''}

                      {job.location || ''}
                    </p>
                  </div>
                )}

                {job.summary && (
                  <section className="mb-10">
                    <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                      Job Summary
                    </h2>

                    <p
                      className="
                        text-[#444]
                        leading-[1.9]
                        whitespace-pre-line
                      "
                    >
                      {job.summary}
                    </p>
                  </section>
                )}

                {job.responsibilities
                  ?.length > 0 && (
                  <section className="mb-10">
                    <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                      Responsibilities
                    </h2>

                    <ul className="list-disc pl-6 space-y-2 text-[#444] leading-[1.8]">
                      {job.responsibilities.map(
                        (
                          responsibility,
                          index
                        ) => (
                          <li
                            key={`${responsibility}-${index}`}
                          >
                            {
                              responsibility
                            }
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                )}

                {job.qualifications
                  ?.length > 0 && (
                  <section className="mb-10">
                    <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                      Qualifications
                    </h2>

                    <ul className="list-disc pl-6 space-y-2 text-[#444] leading-[1.8]">
                      {job.qualifications.map(
                        (
                          qualification,
                          index
                        ) => (
                          <li
                            key={`${qualification}-${index}`}
                          >
                            {
                              qualification
                            }
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                )}

                {job.skills_required
                  ?.length > 0 && (
                  <section className="mb-10">
                    <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                      Required Skills
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.map(
                        (skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="
                              px-4
                              py-2
                              bg-[#f5f5f5]
                              text-[#444]
                              text-sm
                            "
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </section>
                )}

                {job.benefits?.length >
                  0 && (
                  <section className="mb-10">
                    <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                      Benefits
                    </h2>

                    <ul className="list-disc pl-6 space-y-2 text-[#444] leading-[1.8]">
                      {job.benefits.map(
                        (benefit, index) => (
                          <li
                            key={`${benefit}-${index}`}
                          >
                            {benefit}
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                )}

                {(job.how_to_apply ||
                  job.contact_phone ||
                  job.contact_email) && (
                  <section>
                    <h2 className="text-[#c91f26] font-semibold text-[20px] mb-4">
                      How To Apply
                    </h2>

                    {job.how_to_apply && (
                      <p
                        className="
                          text-[#444]
                          leading-[1.9]
                          whitespace-pre-line
                        "
                      >
                        {job.how_to_apply}
                      </p>
                    )}

                    <div className="mt-5 space-y-2 text-[#444]">
                      {job.contact_phone && (
                        <p>
                          Phone:{' '}
                          <a
                            href={`tel:${job.contact_phone}`}
                            className="hover:text-[#c91f26]"
                          >
                            {
                              job.contact_phone
                            }
                          </a>
                        </p>
                      )}

                      {job.contact_email && (
                        <p>
                          Email:{' '}
                          <a
                            href={`mailto:${job.contact_email}`}
                            className="hover:text-[#c91f26]"
                          >
                            {
                              job.contact_email
                            }
                          </a>
                        </p>
                      )}
                    </div>
                  </section>
                )}
              </main>

              <aside
                className="
                  bg-white
                  border
                  border-[#e5e5e5]
                  rounded-xl
                  p-6
                  md:p-8
                  h-fit
                  lg:sticky
                  lg:top-[140px]
                "
              >
                <h2
                  className="
                    text-[28px]
                    text-[#161412]
                    mb-2
                  "
                  style={{
                    fontFamily:
                      '"Cormorant Garamond", serif',
                  }}
                >
                  Apply for This Position
                </h2>

                <p className="text-sm text-[#666] mb-6">
                  Complete the form and
                  attach your latest
                  resume.
                </p>

                {submissionMessage.text && (
                  <div
                    className={`
                      mb-5
                      p-3
                      text-sm
                      border
                      ${
                        submissionMessage.type ===
                        'success'
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }
                    `}
                  >
                    {
                      submissionMessage.text
                    }
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium mb-2"
                      >
                        First Name*
                      </label>

                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        required
                        placeholder="First Name"
                        value={
                          applicationForm.firstName
                        }
                        onChange={
                          handleInputChange
                        }
                        className="
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                          focus:border-[#c91f26]
                        "
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium mb-2"
                      >
                        Last Name*
                      </label>

                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        required
                        placeholder="Last Name"
                        value={
                          applicationForm.lastName
                        }
                        onChange={
                          handleInputChange
                        }
                        className="
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                          focus:border-[#c91f26]
                        "
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email*
                      </label>

                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="Email"
                        value={
                          applicationForm.email
                        }
                        onChange={
                          handleInputChange
                        }
                        className="
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                          focus:border-[#c91f26]
                        "
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-2"
                      >
                        Phone Number*
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        required
                        placeholder="Phone Number"
                        value={
                          applicationForm.phone
                        }
                        onChange={
                          handleInputChange
                        }
                        className="
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                          focus:border-[#c91f26]
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message*
                    </label>

                    <textarea
                      id="message"
                      rows={6}
                      name="message"
                      required
                      placeholder="Tell us about yourself..."
                      value={
                        applicationForm.message
                      }
                      onChange={
                        handleInputChange
                      }
                      className="
                        w-full
                        border
                        border-[#ddd]
                        p-4
                        resize-none
                        outline-none
                        focus:border-[#c91f26]
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="yearsOfExperience"
                      className="block text-sm font-medium mb-2"
                    >
                      Years of Experience
                    </label>

                    <input
                      id="yearsOfExperience"
                      type="number"
                      name="yearsOfExperience"
                      min="0"
                      placeholder="Example: 3"
                      value={
                        applicationForm.yearsOfExperience
                      }
                      onChange={
                        handleInputChange
                      }
                      className="
                        w-full
                        h-[52px]
                        border
                        border-[#ddd]
                        px-4
                        outline-none
                        focus:border-[#c91f26]
                      "
                    />
                  </div>

                  <fieldset>
                    <legend className="block text-sm font-medium mb-3">
                      Experience Level
                    </legend>

                    <div className="space-y-3">
                      {EXPERIENCE_OPTIONS.map(
                        (option) => (
                          <label
                            key={
                              option.value
                            }
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="experienceLevel"
                              value={
                                option.value
                              }
                              checked={
                                applicationForm.experienceLevel ===
                                option.value
                              }
                              onChange={
                                handleInputChange
                              }
                            />

                            <span>
                              {option.label}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </fieldset>

                  <div>
                    <label
                      htmlFor="job-resume-file"
                      className="block text-sm font-medium mb-3"
                    >
                      Resume*
                    </label>

                    <input
                      id="job-resume-file"
                      type="file"
                      name="resume"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={
                        handleInputChange
                      }
                      className="w-full text-sm"
                    />

                    <p className="mt-2 text-[12px] text-[#888]">
                      Accepted formats:
                      PDF, DOC and DOCX.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="job-cover-letter-file"
                      className="block text-sm font-medium mb-3"
                    >
                      Cover Letter
                    </label>

                    <input
                      id="job-cover-letter-file"
                      type="file"
                      name="coverLetter"
                      accept=".pdf,.doc,.docx"
                      onChange={
                        handleInputChange
                      }
                      className="w-full text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      w-full
                      bg-[#c91f26]
                      hover:bg-[#a91a20]
                      text-white
                      px-10
                      py-3
                      font-medium
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      transition-all
                    "
                  >
                    {submitting
                      ? 'Submitting...'
                      : 'Submit Application'}
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

export default CareerDetails;