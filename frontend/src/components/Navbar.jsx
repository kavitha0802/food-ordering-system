
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
    const { user, isAuthenticated, logout, hasRole } = useAuth();
    const { getItemCount } = useCart();
    const navigate = useNavigate();

    const cartCount = getItemCount();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-orange-100 shadow-sm px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-5">

                {/* Logo */}
                <Link to="/" className="shrink-0">
                    <div className="text-2xl font-extrabold text-orange-600 tracking-tight">
                        Munchly<span className="text-gray-800">.</span>
                    </div>
                    <span className="block text-[10px] font-semibold text-gray-500 tracking-widest">
                        GOOD FOOD. GOOD MOOD.
                    </span>
                </Link>

                {/* Navigation */}
                <div className="flex flex-wrap items-center gap-6">

                    {(!isAuthenticated || hasRole('CUSTOMER')) && (
                        <>
                            <Link to="/" className="text-gray-600 hover:text-orange-600 font-medium transition">
                                Home
                            </Link>
                            <Link to="/#restaurants" className="text-gray-600 hover:text-orange-600 font-medium transition">
                                Restaurants
                            </Link>
                        </>
                    )}

                    {isAuthenticated && hasRole('CUSTOMER') && (
                        <>
                            <Link to="/my-orders" className="text-gray-600 hover:text-orange-600 font-medium transition">
                                My Orders
                            </Link>
                            <Link to="/my-addresses" className="text-gray-600 hover:text-orange-600 font-medium transition">
                                My Addresses
                            </Link>
                        </>
                    )}

                    {isAuthenticated && hasRole('RESTAURANT_OWNER') && (
                        <Link to="/owner/dashboard" className="text-gray-600 hover:text-orange-600 font-medium transition">
                            My Restaurants
                        </Link>
                    )}
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-5">

                    {isAuthenticated && hasRole('CUSTOMER') && (
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-2 text-gray-700 hover:text-orange-600 transition"
                            aria-label={`Cart with ${cartCount} items`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="23"
                                height="23"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span className="font-semibold">Cart</span>

                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-orange-600 text-white text-[11px] font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            <span className="text-gray-500 text-sm hidden lg:block">
                                Hi, <span className="font-semibold text-gray-700">{user.fullName}</span>
                            </span>

                            <button
                                onClick={handleLogout}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-orange-600 text-sm font-semibold transition">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
