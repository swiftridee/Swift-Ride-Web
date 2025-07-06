import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "@/components/ui/sonner";
import { auth } from "@/utils/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await auth.forgotPassword(email);
      
      if (response.success) {
        setSubmitted(true);
        toast.success(response.message || "OTP sent to your email address");
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Swift Ride | Reset Your Account Password</title>
        <meta name="description" content="Reset your Swift Ride account password securely. Enter your email to receive password reset instructions." />
        <meta name="keywords" content="forgot password, password reset, Swift Ride account recovery, vehicle rental login" />
      </Helmet>
      
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold text-primary">Swift<span className="text-secondary">Ride</span></span>
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">Enter your email to reset your password</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400"></i>
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-2 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                  </span>
                ) : 'Reset Password'}
              </button>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Remember your password? <Link to="/login" className="text-primary hover:text-primary-dark">Back to login</Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="text-6xl text-green-500 mb-4">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 className="text-2xl font-bold mb-4">OTP Sent Successfully</h2>
              <p className="text-gray-600 mb-6">
                We've sent a 6-digit OTP to:
                <br />
                <span className="font-medium">{email}</span>
              </p>
              <p className="text-gray-600 mb-8 text-sm">
                Please check your email and enter the OTP to continue.
              </p>
              <div className="space-y-4">
                <Link 
                  to={`/verify-otp?email=${encodeURIComponent(email)}`}
                  className="btn-primary w-full block text-center"
                >
                  Enter OTP
                </Link>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline w-full"
                >
                  Try Another Email
                </button>
                <Link to="/login" className="text-primary hover:text-primary-dark text-sm">
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;
