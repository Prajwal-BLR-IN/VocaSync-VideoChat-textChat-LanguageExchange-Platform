import React, { useRef, useState } from 'react'
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCustomMutation } from '../hooks/useCustomMutation';


const Otp = () => {
    const [otp, setOTP] = useState(Array(6).fill(''));
    const inputRef = useRef([]);
    const navigate = useNavigate()

  const { mutate, isPending } = useCustomMutation({
    url: '/auth/verify-account',
    onSuccessRedirect: () => navigate('/onboarding')
  });

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOTP(newOtp);

        if (index < 5) inputRef.current[index + 1]?.focus();

        setTimeout(() => {
            const fullOtp = newOtp.join('');
            if (fullOtp.length === 6 && !newOtp.includes('')) {
                mutate({otp: fullOtp});

            }
        }, 10); // short delay to ensure state is updated

    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = '';
                setOTP(newOtp);
            } else if (index > 0) {
                inputRef.current[index - 1]?.focus();
                newOtp[index - 1] = '';
                setOTP(newOtp);
            }
        }
    }

    const handlePaste = (e, index) => {

        e.preventDefault();

        const pasteData = e.clipboardData.getData("Text").replace(/[^0-9]/g, '');
        if (!pasteData) return;

        const pasteArray = pasteData.slice(0, 6 - index).split('');
        const newOtp = [...otp];

        pasteArray.forEach((char, i) => {
            newOtp[index + i] = char;
        })

        setOTP(newOtp);

        const nextFocus = Math.min(index + pasteArray.length, 5);
        inputRef.current[nextFocus]?.focus();

        //  Wait for OTP state to update first
        setTimeout(() => {
            const fullOtp = newOtp.join('');
            if (fullOtp.length === 6 && !newOtp.includes('')) {
                mutate({otp: fullOtp});

            }
        }, 10); // short delay to ensure state is updated

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length < 6 || otp.includes('')) {
            toast.error("Please enter all 6 digits.");
            return;
        }

         mutate({otp: fullOtp});

    }

    return (
        <div className="auth-wrapper">
            <div className="auth-section">
                <div className="form-control">
                    <form onSubmit={handleSubmit} className='otp-form-wrapper'>
                        <img src={assets.logo} alt="logo" className="logo-image" />
                        <h2 className="form-heading">Verify Your Account</h2>
                        <p className="form-paragraph">Enter the OTP we sent to continue your language journey</p>

                        {/* OTP input field */}
                        <div className="otp-field">
                            {
                                otp.map((digit, index) => (
                                    <input type="text"
                                        key={index}
                                        maxLength={1}
                                        inputMode="numeric"
                                        pattern="\d*"
                                        autoComplete={index === 0 ? "one-time-code" : "off"}
                                        value={digit}
                                        className="otp-form-field"
                                        ref={(el) => inputRef.current[index] = el}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={(e) => handlePaste(e, index)}
                                    />
                                ))
                            }
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="form-button form-button-otp">{ isPending ? (
                            <>
                                <div className='loading-spinner' >
                                </div>
                                <span>Verifying OTP...</span>
                            </>
                        ) : "Submit"}</button>

                        {/* Switch to Login */}
                        <p className="form-switcher">
                            <span className="form-switcher-text">Didn't received OTP? </span>
                            <Link to="/login" className="greenify-text">Resend OTP</Link>
                        </p>

                    </form>
                </div>

                <div className="auth-page-illustrator">
                    <img src={assets.EnterOtp} alt="video call" className='illustrator-image' />
                    <div>
                        <h3 className='auth-page-illustrator-heading'>Meet language partners from around the world</h3>
                        <p className='auth-page-illustrator-paragraph' >Chat, build friendships, and grow your language skills together.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Otp