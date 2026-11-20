
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { orderService } from '../services/orderService';

const STATUS_OPTIONS = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
];

function OwnerOrders() {
    const { id: restaurantId } = useParams();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [restaurantId]);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getOrdersByRestaurant(restaurantId);
            setOrders(data);
        } catch (err) {
            setError('Could not load orders.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        setError('');

        try {
            const updated = await orderService.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
        } catch (err) {
            setError('Could not update order status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusStyle = (status) => {
        const styles = {
            PENDING: 'bg-yellow-50 text-yellow-700',
            CONFIRMED: 'bg-blue-50 text-blue-700',
            PREPARING: 'bg-orange-50 text-orange-700',
            OUT_FOR_DELIVERY: 'bg-purple-50 text-purple-700',
            DELIVERED: 'bg-green-50 text-green-700',
            CANCELLED: 'bg-red-50 text-red-700',
        };

        return styles[status] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="min-h-screen bg-[#fff8f2] text-[#33251f]">
            <Navbar />

            <main className="max-w-5xl mx-auto px-5 py-10">
                <Link
                    to="/owner/dashboard"
                    className="text-sm font-semibold text-[#dc6b35] hover:text-[#b94e20]"
                >
                    ← Back to My Restaurants
                </Link>

                <div className="mt-6 mb-8">
                    <p className="text-sm font-bold uppercase tracking-widest text-[#e8753d]">
                        Restaurant management
                    </p>
                    <h1 className="text-3xl font-extrabold mt-2">Customer Orders</h1>
                    <p className="text-sm text-[#8c7770] mt-2">
                        View orders and manage their delivery status.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-7">
                    <div className="bg-white rounded-2xl p-5 border border-orange-100">
                        <p className="text-sm text-[#9a8982]">Total Orders</p>
                        <p className="text-3xl font-extrabold mt-2">{orders.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-orange-100">
                        <p className="text-sm text-[#9a8982]">Pending Orders</p>
                        <p className="text-3xl font-extrabold mt-2">
                            {orders.filter((order) => order.status === 'PENDING').length}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                        {error}
                    </div>
                )}

                {loading && (
                    <p className="text-center text-[#8c7770] py-10">
                        Loading orders...
                    </p>
                )}

                {!loading && orders.length === 0 && (
                    <div className="bg-white border border-orange-100 rounded-3xl p-10 text-center">
                        <div className="text-5xl mb-4">🛍️</div>
                        <h2 className="text-lg font-bold">No orders yet</h2>
                        <p className="text-sm text-[#9a8982] mt-2">
                            New customer orders will appear here.
                        </p>
                    </div>
                )}

                <div className="space-y-5">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-3xl border border-orange-100 shadow-sm p-5 sm:p-7"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9a8982]">
                                        Order ID
                                    </p>
                                    <h2 className="text-xl font-extrabold mt-1">
                                        #{order.id}
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full w-fit ${getStatusStyle(order.status)}`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>

                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        disabled={updatingId === order.id}
                                        className="text-sm border border-orange-100 bg-[#fffaf6] rounded-xl px-3 py-2 outline-none focus:border-[#e8753d] disabled:opacity-50"
                                    >
                                        {STATUS_OPTIONS.map((status) => (
                                            <option key={status} value={status}>
                                                {status.replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>

                                    {updatingId === order.id && (
                                        <p className="text-xs text-[#dc6b35]">Updating...</p>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-[#9a8982] mb-5">
                                Placed on: {new Date(order.placedAt).toLocaleString()}
                            </p>

                            <div className="bg-[#fffaf6] rounded-2xl p-4 space-y-3">
                                <h3 className="text-sm font-bold mb-3">Order Items</h3>

                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center gap-3 text-sm"
                                    >
                                        <span className="text-[#765e53]">
                                            {item.menuItemName} × {item.quantity}
                                        </span>
                                        <span className="font-semibold whitespace-nowrap">
                                            ₹{Number(item.subtotal).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-orange-100 mt-5 pt-4 flex justify-between items-center">
                                <span className="font-bold">Order Total</span>
                                <span className="text-xl font-extrabold text-[#dc6b35]">
                                    ₹{Number(order.totalAmount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default OwnerOrders;
