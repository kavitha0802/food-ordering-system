
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const response = await authService.login(formData);
            login(response);
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-4 py-3.5 rounded-xl border border-[#e9dfd5] bg-[#fffaf6] text-[#33251f] text-sm outline-none focus:border-[#e8753d] focus:ring-2 focus:ring-orange-100 transition";

    return (
        <div className="min-h-screen bg-[#eeeae2]">

            {/* NAVBAR */}
            <Navbar />

            {/* MAIN CONTENT */}
            <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-5 sm:p-8">

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl bg-white">

                    {/* LEFT FOOD IMAGE */}
                    <section className="relative min-h-[350px] md:min-h-[570px] overflow-hidden">

                        <img
                            src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200"
                            alt="Delicious Indian chicken biryani"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

                        <Link
                            to="/"
                            className="absolute top-8 left-8 text-2xl font-black text-white"
                        >
                            FoodHub<span className="text-orange-400">.</span>
                        </Link>

                        <div className="absolute bottom-10 left-8 right-8 text-white">

                            <span className="inline-block bg-orange-500 rounded-full px-4 py-2 text-xs font-bold mb-5">
                                FRESH • TASTY • DELIVERED
                            </span>

                            <h1 className="text-4xl lg:text-5xl font-black leading-tight">
                                Good Food.
                                <br />
                                <span className="text-orange-400">
                                    Good Mood.
                                </span>
                            </h1>

                            <p className="mt-4 text-sm sm:text-base text-white/85 max-w-sm leading-relaxed">
                                Discover delicious meals, explore your favourite
                                restaurants and enjoy food delivered right to
                                your doorstep.
                            </p>
                        </div>
                    </section>

                    {/* RIGHT LOGIN FORM */}
                    <section className="flex items-center justify-center bg-[#fffdf9] px-7 py-12 sm:px-12 lg:px-16">

                        <div className="w-full max-w-md">

                            <div className="mb-8">

                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl mb-5">
                                    🍛
                                </div>

                                <h2 className="text-3xl font-extrabold text-[#33251f]">
                                    Welcome Back!
                                </h2>

                                <p className="text-sm text-[#99877d] mt-2">
                                    Login to continue your food journey.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">

                                <div>
                                    <label className="block text-sm font-semibold text-[#33251f] mb-2">
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
                                    <label className="block text-sm font-semibold text-[#33251f] mb-2">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                        className={inputClass}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#e8753d] text-white py-3.5 rounded-xl font-bold hover:bg-[#cc5d2b] shadow-md shadow-orange-100 transition disabled:opacity-50"
                                >
                                    {loading ? 'Logging in...' : 'Login to FoodHub →'}
                                </button>

                            </form>

                            <p className="text-center text-sm text-[#99877d] mt-7">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-bold text-[#dc6b35] hover:underline"
                                >
                                    Create Account
                                </Link>
                            </p>

                            <p className="text-center text-xs text-[#b2a49c] mt-10">
                                © FoodHub. Good food, delivered with love.
                            </p>

                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}

export default Login;
