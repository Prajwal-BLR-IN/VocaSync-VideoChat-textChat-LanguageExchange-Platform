import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useCustomMutation } from '../hooks/useCustomMutation';

const Login = () => {
  const navigate = useNavigate()

  const initialValue = {
    email: '',
    password: ''
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('⚠ Invalid email').required('⚠ Required'),
    password: Yup.string().min(8, "⚠ must be 8+ charecters").required(' ⚠ Required'),
  })

  const { mutate, isPending } = useCustomMutation({
    url: '/auth/login',
    onSuccessRedirect: () => navigate('/'),
    invalidateKey: 'authUser'
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

                <h2 className="form-heading">Welcome back</h2>
                <p className="form-paragraph">Sign in to your account to continue your language journey</p>

                <div className="form-field">

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

                {/* forgot password */}
                <p className="form-switcher">
                  <Link to="/reset-password" className="greenify-text">Forgot password?</Link>
                </p>

                {/* Submit Button */}
                <button type="submit" className="form-button">{isPending ? (
                  <>
                  <div className='loading-spinner' >
                  </div>
                  <span>Signing in...</span>
                  </>
                ) : "Sign in"}</button>
                {/* Switch to Login */}
                <p className="form-switcher">
                  <span className="form-switcher-text">Don't have an account? </span>
                  <Link to="/signup" className="greenify-text">Sign up</Link>
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

export default Login
