import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "@/components/ui/sonner";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !otp) {
      toast.error("Invalid reset link");
      navigate("/forgot-password");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - Swift Ride | Set New Account Password</title>
        <meta name="description" content="Set your new Swift Ride account password securely. Create a strong password to protect your vehicle rental account." />
        <meta name="keywords" content="reset password, new password, Swift Ride account security, vehicle rental login" />
      </Helmet>
      
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold text-primary">Swift<span className="text-secondary">Ride</span></span>
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400`}></i>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400`}></i>
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary py-2 flex items-center justify-center"
              disabled={loading || !password || !confirmPassword}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Resetting...
                </span>
              ) : 'Reset Password'}
            </button>
            
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Remember your password? <Link to="/login" className="text-primary hover:text-primary-dark">Back to login</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ResetPassword; 