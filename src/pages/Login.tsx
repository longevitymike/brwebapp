
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { TooltipProviderWrapper } from '@/components/providers/TooltipProvider';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      toast.error('Login failed', {
        description: 'Please check your credentials and try again.',
      });
    }
  };
  
  return (
    <TooltipProviderWrapper>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-primary to-blue-400">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Barefoot Reset
            </h1>
            <p className="text-white/80">
              Login to start your barefoot athletic journey
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="mb-8">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-gradient text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:brightness-110 disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    'Log In'
                  )}
                </button>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>For demo purposes:</p>
                <p className="font-medium">Athlete: alex@example.com</p>
                <p className="font-medium">Parent: sarah@example.com</p>
                <p>Any password will work</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </TooltipProviderWrapper>
  );
};

export default Login;
