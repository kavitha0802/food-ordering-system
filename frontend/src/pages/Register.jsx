
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'CUSTOMER',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.register(formData);
            login(response);
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl border border-[#e9dfd5] bg-[#faf9f6] text-[#33251f] text-sm outline-none focus:border-[#d9683e] focus:ring-2 focus:ring-orange-100 transition";

    return (
        <div className="min-h-screen bg-[#f5f2eb]">

            <Navbar />

            <main className="flex justify-center px-5 py-10 sm:py-12">

                <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_35px_rgba(60,40,20,0.08)] border border-[#eee8df] p-7 sm:p-9">

                    {/* BRAND */}
                    <div className="text-center mb-7">
                        <Link to="/" className="text-2xl font-extrabold text-[#33251f]">
                            🍔 Munch<span className="text-[#e8753d]">ly.</span>
                        </Link>

                        <h1 className="text-2xl font-extrabold text-[#33251f] mt-5">
                            Create Account
                        </h1>

                        <p className="text-sm text-[#99877d] mt-2">
                            Sign up to start ordering delicious food.
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                            {error}
                        </div>
                    )}

                    {/* REGISTER FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-semibold text-[#45372f] mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#45372f] mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#45372f] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                placeholder="Enter your password"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#45372f] mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#45372f] mb-2">
                                I want to
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="CUSTOMER">
                                    Order food (Customer)
                                </option>
                                <option value="RESTAURANT_OWNER">
                                    List my restaurant (Restaurant Owner)
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#bd4932] text-white py-3.5 rounded-xl font-bold hover:bg-[#a83c29] transition shadow-md shadow-red-100 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>

                    </form>

                    <p className="text-center text-sm text-[#99877d] mt-6">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-[#c94d35] hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </div>
            </main>
        </div>
    );
}

export default Register;
