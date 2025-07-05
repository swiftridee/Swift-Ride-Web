import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "@/components/ui/sonner";

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      toast.error("Email is required");
      navigate("/forgot-password");
      return;
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit OTP
      if (otpString.length === 6) {
        toast.success("OTP verified successfully!");
        // Navigate to reset password page with email and verified OTP
        navigate(`/reset-password?email=${email}&otp=${otpString}`);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("OTP resent successfully!");
      setTimeLeft(30);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify OTP - Swift Ride | Complete Password Reset</title>
        <meta name="description" content="Verify the 6-digit OTP sent to your email to complete your Swift Ride password reset process securely." />
        <meta name="keywords" content="OTP verification, password reset, Swift Ride security, account recovery" />
      </Helmet>
      
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold text-primary">Swift<span className="text-secondary">Ride</span></span>
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">Verify OTP</h1>
            <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
            {email && (
              <p className="text-sm text-gray-500 mt-2">{email}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter OTP
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary py-2 flex items-center justify-center"
              disabled={loading || otp.join("").length !== 6}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Verifying...
                </span>
              ) : 'Verify OTP'}
            </button>
            
            <div className="text-center space-y-4">
              {timeLeft > 0 ? (
                <p className="text-gray-600 text-sm">
                  Resend OTP in {timeLeft} seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="text-primary hover:text-primary-dark text-sm font-medium disabled:opacity-50"
                >
                  {resendLoading ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                    </span>
                  ) : 'Resend OTP'}
                </button>
              )}
              
              <div className="border-t pt-4">
                <p className="text-gray-600 text-sm">
                  <Link to="/forgot-password" className="text-primary hover:text-primary-dark">
                    ← Back to forgot password
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default VerifyOTP; 