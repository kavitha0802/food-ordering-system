
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { orderService } from '../services/orderService';

function MyOrders() {
    const location = useLocation();
    const justPlacedOrderId = location.state?.justPlaced;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                setOrders(data);
            } catch (err) {
                setError('Could not load your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancel = async (orderId) => {
        if (!window.confirm('Cancel this order? This cannot be undone.')) return;

        setCancellingId(orderId);
        setError('');

        try {
            const updated = await orderService.cancelOrder(orderId);
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? updated : o))
            );
        } catch (err) {
            const message = err.response?.data?.message || 'Could not cancel this order.';
            setError(message);
        } finally {
            setCancellingId(null);
        }
    };

    const statusStyles = {
        PENDING: 'bg-amber-100 text-amber-800',
        CONFIRMED: 'bg-blue-100 text-blue-800',
        PREPARING: 'bg-orange-100 text-orange-800',
        OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };

    return (
        <div className="min-h-screen bg-[#fffaf5]">
            <Navbar />

            <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
                <div className="mb-8">
                    <p className="text-orange-600 font-semibold text-sm tracking-widest uppercase mb-2">
                        Your Munchly experience
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#292522]">
                        My Orders
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Track your orders and enjoy every bite.
                    </p>
                </div>

                {justPlacedOrderId && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl mb-6">
                        <p className="font-semibold">Order placed successfully!</p>
                        <p className="text-sm mt-1">Your order #{justPlacedOrderId} has been received.</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-20 text-gray-500">
                        Loading your orders...
                    </div>
                )}

                {!loading && orders.length === 0 && !error && (
                    <div className="bg-white rounded-3xl border border-orange-100 text-center py-16 px-6 shadow-sm">
                        <div className="text-5xl mb-4">🍽️</div>
                        <h2 className="text-xl font-bold text-gray-800">No orders yet</h2>
                        <p className="text-gray-500 mt-2">
                            Your delicious journey starts with your first order.
                        </p>
                        <a
                            href="/"
                            className="inline-block mt-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                        >
                            Explore restaurants
                        </a>
                    </div>
                )}

                {!loading && orders.length > 0 && (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white border border-orange-100 rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium mb-1">
                                            ORDER #{order.id}
                                        </p>
                                        <h2 className="text-xl font-bold text-[#292522]">
                                            {order.restaurantName}
                                        </h2>
                                    </div>

                                    <span className={`w-fit text-xs font-bold px-4 py-2 rounded-full ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-400 mb-5">
                                    {new Date(order.placedAt).toLocaleString()}
                                </p>

                                <div className="bg-[#fffaf5] rounded-xl p-4 space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between gap-3 text-sm">
                                            <span className="text-gray-700">
                                                {item.menuItemName} × {item.quantity}
                                            </span>
                                            <span className="font-semibold text-gray-800 whitespace-nowrap">
                                                ₹{Number(item.subtotal).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-orange-100 mt-5 pt-5 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Total amount</p>
                                        <p className="text-2xl font-extrabold text-orange-600">
                                            ₹{Number(order.totalAmount).toFixed(2)}
                                        </p>
                                    </div>

                                    {order.status === 'PENDING' && (
                                        <button
                                            onClick={() => handleCancel(order.id)}
                                            disabled={cancellingId === order.id}
                                            className="border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                                        >
                                            {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyOrders;
