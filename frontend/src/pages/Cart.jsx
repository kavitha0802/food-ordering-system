
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

function Cart() {
    const navigate = useNavigate();

    const {
        restaurantName,
        items,
        updateQuantity,
        removeItem,
        getTotal,
        getItemCount,
    } = useCart();

    const total = getTotal();

    return (
        <div className="min-h-screen bg-[#fffaf4] pb-12">
            <Navbar />

            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

                <div className="mb-9">
                    <p className="text-orange-600 text-sm font-bold uppercase tracking-widest">
                        Almost delicious!
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                        Your Cart
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Review your items before checkout.
                    </p>
                </div>

                {items.length === 0 ? (
                    <section className="bg-white rounded-3xl border border-orange-100 shadow-sm p-10 text-center">
                        <div className="text-5xl mb-5">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Looks like you haven't added anything yet.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 bg-orange-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
                        >
                            Explore Restaurants
                        </button>
                    </section>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">

                        <section className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 sm:p-8 min-w-0">

                            <div className="mb-6">
                                <p className="text-orange-600 text-xs font-bold uppercase tracking-widest">
                                    Your selection
                                </p>
                                <h2 className="text-xl font-bold text-gray-900 mt-1">
                                    {restaurantName}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {getItemCount()} item(s)
                                </p>
                            </div>

                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div
                                        key={item.menuItemId}
                                        className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-800">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1">
                                                ₹{Number(item.price).toFixed(2)} each
                                            </p>
                                            <button
                                                onClick={() => removeItem(item.menuItemId)}
                                                className="text-red-500 text-sm font-medium mt-3 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border border-orange-200 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                                    className="px-3 py-2 text-orange-600 font-bold hover:bg-orange-50"
                                                >
                                                    −
                                                </button>
                                                <span className="px-3 font-semibold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                                    className="px-3 py-2 text-orange-600 font-bold hover:bg-orange-50"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <span className="font-bold text-gray-900 whitespace-nowrap">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <aside className="min-w-0 w-full">
                            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sm:p-7 lg:sticky lg:top-8">

                                <h2 className="text-xl font-extrabold text-gray-900 mb-7">
                                    Bill Details
                                </h2>

                                <div className="space-y-5 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">
                                            Item Total ({getItemCount()} items)
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            ₹{total.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Delivery Fee</span>
                                        <span className="font-semibold text-green-600">
                                            FREE
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-gray-200 my-6" />

                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-gray-900">
                                        Grand Total
                                    </span>
                                    <span className="text-2xl font-extrabold text-orange-600">
                                        ₹{total.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full mt-7 bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-md"
                                >
                                    Continue to Checkout →
                                </button>

                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full mt-3 text-orange-600 py-2 font-semibold hover:text-orange-700"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Cart;
