import { useAuthUser } from '../hooks/useAuthUser';
import { assets } from '../assets/assets';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import { LANGUAGES } from '../constants/langaues';
import { useState } from 'react';
import { useCustomMutation } from '../hooks/useCustomMutation';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const { authUser } = useAuthUser();
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [randomAvatar, setRandomAvatar] = useState(authUser.profilePic);
  const navigate = useNavigate();

  const initialValues = {
    profilePic: randomAvatar || '',
    fullName: authUser.fullName || '',
    bio: '',
    nativeLanguage: '',
    learningLanguage: '',
    location: ''
  };

  const validationSchema = Yup.object({
    profilePic: Yup.string().optional(),
    fullName: Yup.string().required("⚠ Required"),
    bio: Yup.string().required("⚠ Required"),
    nativeLanguage: Yup.string().required("⚠ Required"),
    learningLanguage: Yup.string().required("⚠ Required"),
    location: Yup.string().required("⚠ Required")
  });

  const { mutate, isPending } = useCustomMutation({
    url: '/auth/onboarding',
    onSuccessRedirect: () => navigate('/'),
    invalidateKey: 'authUser'
  });

  const onSubmit = (values) => {
    mutate(values);
  };

  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-section">
        <div className="form-control">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form>
                <h2 className="form-heading">Complete Your Profile</h2>

                <div className="profile-picture-wrapper">
                  <img
                    src={randomAvatar ? randomAvatar : assets.personIcon}
                    alt="profile"
                    className="onboarding-profile-picture"
                    onLoad={() => setIsAvatarLoading(false)}
                    onError={() => setIsAvatarLoading(false)}
                  />
                  <button
                    type="button"
                    className="form-button"
                    onClick={() => {
                      const idx = Math.floor(1 + Math.random() * 100);
                      const randomPic = `https://avatar.iran.liara.run/public/${idx}.png`;
                      setIsAvatarLoading(true);
                      setRandomAvatar(randomPic);
                      setFieldValue('profilePic', randomPic);
                    }} >
                    {isAvatarLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <img src={assets.randomIcon} alt="random icon" className="random-icon" />
                        <span>Generate Random Avatar</span>
                      </>
                    )}

                  </button>
                </div>

                <div className="form-field">
                  {/* Full Name */}
                  <label htmlFor="fullName" className="form-label">
                    <span>Full Name</span>
                    {touched.fullName && errors.fullName && (
                      <span className="error-message active">{errors.fullName}</span>
                    )}
                  </label>
                  <div className={`form-area ${touched.fullName && errors.fullName ? 'error' : ''}`}>
                    <Field type="text" name="fullName" />
                  </div>

                  {/* Bio */}
                  <label htmlFor="bio" className="form-label">
                    <span>Bio</span>
                    {touched.bio && errors.bio && (
                      <span className="error-message active">{errors.bio}</span>
                    )}
                  </label>
                  <Field
                    as="textarea"
                    name="bio"
                    className={`form-area ${touched.bio && errors.bio ? 'error' : ''}`}
                    placeholder="Tell others about yourself and your language learning goals"
                  />

                  {/* Languages */}
                  <div className="form-langauge-wrapper">
                    {/* Native Language */}
                    <div>
                      <label htmlFor="nativeLanguage" className="form-label">
                        <span>Native Language</span>
                        {touched.nativeLanguage && errors.nativeLanguage && (
                          <span className="error-message active">{errors.nativeLanguage}</span>
                        )}
                      </label>
                      <div
                        className={`form-area ${touched.nativeLanguage && errors.nativeLanguage ? 'error' : ''
                          }`}
                      >
                        <Field list="languageList" name="nativeLanguage" placeholder="Type to search..." />
                      </div>
                    </div>

                    {/* Learning Language */}
                    <div>
                      <label htmlFor="learningLanguage" className="form-label">
                        <span>Learning Language</span>
                        {touched.learningLanguage && errors.learningLanguage && (
                          <span className="error-message active">{errors.learningLanguage}</span>
                        )}
                      </label>
                      <div
                        className={`form-area ${touched.learningLanguage && errors.learningLanguage ? 'error' : ''
                          }`}
                      >
                        <Field list="languageList" name="learningLanguage" placeholder="Type to search..." />
                      </div>
                    </div>

                    {/* Shared datalist */}
                    <datalist id="languageList">
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang} />
                      ))}
                    </datalist>
                  </div>

                  {/* Location */}
                  <label htmlFor="location" className="form-label">
                    <span>Location</span>
                    {touched.location && errors.location && (
                      <span className="error-message active">{errors.location}</span>
                    )}
                  </label>
                  <div className={`form-area ${touched.location && errors.location ? 'error' : ''}`}>
                    <div className="formfield-image-wrapper">
                      <img src={assets.locationIcon} alt="location icon" />
                    </div>
                    <Field type="text" name="location" placeholder="City, Country" />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="form-button">
                    {isPending ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <img src={assets.globeIcon} alt="globe icon" className="globe-icon" />
                        <span>Complete Onboarding</span>
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
