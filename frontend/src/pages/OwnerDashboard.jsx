import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { restaurantService } from '../services/restaurantService';
import { orderService } from '../services/orderService';


function OwnerDashboard() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orderCounts, setOrderCounts] = useState({});

    const [showAddForm, setShowAddForm] = useState(false);
    const [newRestaurant, setNewRestaurant] = useState({
        name: '',
        description: '',
        address: '',
        contactNumber: '',
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const data = await restaurantService.getMyRestaurants();
            setRestaurants(data);
            fetchOrderCounts(data);
        } catch (err) {
            setError('Could not load your restaurants.');
        } finally {
            setLoading(false);
        }
    };
    const fetchOrderCounts = async (restaurantList) => {
        const counts = {};

        await Promise.all(
            restaurantList.map(async (restaurant) => {
                try {
                    const orders = await orderService.getOrdersByRestaurant(restaurant.id);

                    counts[restaurant.id] = {
                        total: orders.length,
                        pending: orders.filter(
                            (order) => order.status === 'PENDING'
                        ).length,
                    };
                } catch (err) {
console.error('Order count error:', err);
    counts[restaurant.id] = { total: 0, pending: 0 };
}
            })
        );

        setOrderCounts(counts);
    };

    const handleChange = (e) => {
        setNewRestaurant({
            ...newRestaurant,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError('');

        try {
            const created = await restaurantService.createRestaurant(newRestaurant);
            setRestaurants((prev) => [...prev, created]);
            setShowAddForm(false);
            setNewRestaurant({
                name: '',
                description: '',
                address: '',
                contactNumber: '',
            });
        } catch (err) {
            setError('Could not create restaurant. Please check the fields and try again.');
        } finally {
            setCreating(false);
        }
    };

    const inputStyle =
        "w-full px-4 py-3 border border-orange-100 rounded-xl text-sm bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-orange-300";

    return (
        <div className="min-h-screen bg-[#fffaf5]">
            <Navbar />

            <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="text-orange-600 font-semibold text-sm tracking-widest uppercase mb-2">
                            Restaurant management
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#292522]">
                            My Restaurants
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Manage your restaurant and keep your customers happy.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setError('');
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
                    >
                        {showAddForm ? '✕ Cancel' : '+ Add Restaurant'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {showAddForm && (
                    <form
                        onSubmit={handleCreate}
                        className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sm:p-8 mb-8"
                    >
                        <h2 className="text-xl font-bold text-[#292522] mb-6">
                            Add a new restaurant
                        </h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Restaurant name"
                                value={newRestaurant.name}
                                onChange={handleChange}
                                required
                                className={inputStyle}
                            />

                            <textarea
                                name="description"
                                placeholder="Restaurant description"
                                value={newRestaurant.description}
                                onChange={handleChange}
                                rows={3}
                                className={inputStyle}
                            />

                            <input
                                type="text"
                                name="address"
                                placeholder="Restaurant address"
                                value={newRestaurant.address}
                                onChange={handleChange}
                                required
                                className={inputStyle}
                            />

                            <input
                                type="text"
                                name="contactNumber"
                                placeholder="Contact number"
                                value={newRestaurant.contactNumber}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={creating}
                            className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                        >
                            {creating ? 'Creating...' : 'Create Restaurant'}
                        </button>
                    </form>
                )}

                {loading && (
                    <p className="text-gray-500 text-center py-12">
                        Loading your restaurants...
                    </p>
                )}

                {!loading && restaurants.length === 0 && !showAddForm && (
                    <div className="bg-white border border-orange-100 rounded-2xl text-center py-16 px-6 shadow-sm">
                        <div className="text-5xl mb-4">🍽️</div>
                        <h2 className="text-xl font-bold text-gray-800">
                            No restaurants yet
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Create your first restaurant to get started.
                        </p>
                    </div>
                )}

                {!loading && restaurants.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {restaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex items-start justify-between gap-3 mb-5">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl mb-4">
                                            🍴
                                        </div>
                                        <h2 className="text-xl font-bold text-[#292522]">
                                            {restaurant.name}
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-2">
                                            {restaurant.address}
                                        </p>
                                    </div>

                                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${restaurant.active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {restaurant.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-orange-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-500">Total Orders</p>
                                        <p className="text-xl font-bold text-[#33251f]">
                                            {orderCounts[restaurant.id]?.total ?? '...'}
                                        </p>
                                    </div>

                                    <div className="bg-yellow-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-500">Pending Orders</p>
                                        <p className="text-xl font-bold text-yellow-700">
                                            {orderCounts[restaurant.id]?.pending ?? '...'}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-orange-100 pt-4 grid grid-cols-3 gap-2">
                                    <Link
                                        to={`/owner/restaurants/${restaurant.id}/edit`}
                                        className="text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg py-2 transition"
                                    >
                                        Edit
                                    </Link>

                                    <Link
                                        to={`/owner/restaurants/${restaurant.id}/menu`}
                                        className="text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg py-2 transition"
                                    >
                                        Menu
                                    </Link>

                                    <Link
                                        to={`/owner/restaurants/${restaurant.id}/orders`}
                                        className="text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg py-2 transition"
                                    >
                                        Orders
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default OwnerDashboard;
