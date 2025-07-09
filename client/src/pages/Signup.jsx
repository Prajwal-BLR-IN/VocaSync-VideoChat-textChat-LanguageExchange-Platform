import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useCustomMutation } from '../hooks/useCustomMutation'


const Signup = () => {
  const navigate = useNavigate()
  
  const initialValue = {
    fullName: '',
    email: '',
    password: '',
    acceptTerms: false,
  }

  const validationSchema = Yup.object({
    fullName: Yup.string().required('⚠ Required'),
    email: Yup.string().email('⚠ Invalid email').required('⚠ Required'),
    password: Yup.string().min(8, "⚠ must be 8+ charecters").required(' ⚠ Required'),
    acceptTerms: Yup.boolean().oneOf([true], '⚠ You must accept the terms & conditions'),
  })


  const { mutate, isPending } = useCustomMutation({
    url: '/auth/signup',
    onSuccessRedirect: () => navigate('/verify-email')
  });


  const onSubmit = (value) => {
    mutate(value);
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-section">
        <div className="form-control">
          <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched }) => (
              <Form>
                <img src={assets.logo} alt="logo" className="logo-image" />

                <h2 className="form-heading">Create an Account</h2>
                <p className="form-paragraph">Join VocaSync and start your language learning journey</p>

                <div className="form-field">
                  {/* Full Name */}
                  <label htmlFor="fullName" className="form-label">
                    <span>Full Name</span>
                    {touched.fullName && errors.fullName && (
                      <span className="error-message active">{errors.fullName}</span>
                    )}
                  </label>
                  <div className={`form-area ${touched.fullName && errors.fullName ? 'error' : ''}`}>
                    <div className="formfield-image-wrapper">
                      <img src={assets.personIcon} alt="person icon" />
                    </div>
                    <Field type="text" name="fullName" />
                  </div>

                  {/* Email */}
                  <label htmlFor="email" className="form-label">
                    <span>Email</span>
                    {touched.email && errors.email && (
                      <span className="error-message active">{errors.email}</span>
                    )}
                  </label>
                  <div className={`form-area ${touched.email && errors.email ? 'error' : ''}`}>
                    <div className="formfield-image-wrapper">
                      <img src={assets.mailIcon} alt="mail icon" />
                    </div>
                    <Field type="email" name="email" />
                  </div>

                  {/* Password */}
                  <label htmlFor="password" className="form-label">
                    <span>Password</span>
                    {touched.password && errors.password && (
                      <span className="error-message active">{errors.password}</span>
                    )}
                  </label>
                  <div className={`form-area ${touched.password && errors.password ? 'error' : ''}`}>
                    <div className="formfield-image-wrapper">
                      <img src={assets.lockIcon} alt="lock icon" />
                    </div>
                    <Field type="password" name="password" />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="checkbox-wrapper">
                  <Field type="checkbox" name="acceptTerms" className="custom-checkbox" />
                  <span className="custom-check"></span>
                  <span className="checkbox-label-text">
                    I agree to the <a href="#" className="greenify-text">terms of service</a> and
                    <a href="#" className="greenify-text"> privacy policy</a>
                  </span>
                </label>
                {touched.acceptTerms && errors.acceptTerms && (
                  <div className="error-message error-message-tick">{errors.acceptTerms}</div>
                )}

                {/* Submit Button */}
                <button type="submit" className="form-button">{isPending ? (
                  <>
                  <div className='loading-spinner' >
                  </div>
                  <span>Signing up...</span>
                  </>
                ) : "Sign up"}</button>

                {/* Switch to Login */}
                <p className="form-switcher">
                  <span className="form-switcher-text">Already have an account? </span>
                  <Link to="/login" className="greenify-text">Sign in</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>

        <div className="auth-page-illustrator">
          <img src={assets.videoCall} alt="video call" className='illustrator-image' />
          <div>
            <h3 className='auth-page-illustrator-heading'>Connect with language partners worldwide</h3>
            <p className='auth-page-illustrator-paragraph' >Practice conversations, make friends, and improve your  language skills together</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
