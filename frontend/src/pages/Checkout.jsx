
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';

function Checkout() {
    const navigate = useNavigate();
    const { restaurantId, restaurantName, items, getTotal, clearCart } = useCart();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [error, setError] = useState('');

    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
    });

    useEffect(() => {
        if (items.length === 0) {
            navigate('/');
            return;
        }
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const data = await addressService.getMyAddresses();
            setAddresses(data);
            if (data.length > 0) {
                setSelectedAddressId(data[0].id);
            } else {
                setShowAddForm(true);
            }
        } catch (err) {
            setError('Could not load your addresses.');
        } finally {
            setLoading(false);
        }
    };

    const handleNewAddressChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setSavingAddress(true);
        setError('');

        try {
            const created = await addressService.addAddress(newAddress);
            setAddresses([...addresses, created]);
            setSelectedAddressId(created.id);
            setShowAddForm(false);
            setNewAddress({
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                landmark: '',
            });
        } catch (err) {
            setError('Could not save address. Please check the fields and try again.');
        } finally {
            setSavingAddress(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            setError('Please select a delivery address.');
            return;
        }

        setPlacing(true);
        setError('');

        try {
            const orderData = {
                restaurantId,
                deliveryAddressId: selectedAddressId,
                items: items.map((i) => ({
                    menuItemId: i.menuItemId,
                    quantity: i.quantity,
                })),
            };

            const order = await orderService.placeOrder(orderData);
            clearCart();
            navigate('/my-orders', { state: { justPlaced: order.id } });
        } catch (err) {
            const message =
                err.response?.data?.message ||
                'Could not place order. Please try again.';
            setError(message);
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fffaf4]">
                <Navbar />
                <p className="text-center text-gray-500 py-20">
                    Loading your checkout...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fffaf4] pb-12">
            <Navbar />

            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

                {/* Page Heading */}
                <div className="mb-9">
                    <p className="text-orange-600 text-sm font-bold uppercase tracking-widest">
                        Almost there!
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                        Complete Your Order
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Good food is just a few clicks away.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start w-full">                    {/* Left Section */}
                    <div className="min-w-0 space-y-7">
                        {/* Order Summary */}
                        <section className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-orange-600 text-xs font-bold uppercase tracking-widest">
                                        Your selection
                                    </p>
                                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                                        Order Summary
                                    </h2>
                                </div>
                                <span className="bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-2 rounded-full">
                                    {items.length} item(s)
                                </span>
                            </div>

                            <div className="bg-orange-50 rounded-xl p-4 mb-5">
                                <p className="text-sm text-gray-500">
                                    Ordering from
                                </p>
                                <h3 className="font-bold text-gray-900 mt-1">
                                    {restaurantName}
                                </h3>
                            </div>

                            <div className="space-y-5">
                                {items.map((item) => (
                                    <div
                                        key={item.menuItemId}
                                        className="flex justify-between items-center gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1">
                                                ₹{Number(item.price).toFixed(2)} × {item.quantity}
                                            </p>
                                        </div>

                                        <span className="font-bold text-gray-900 whitespace-nowrap">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Delivery Address */}
                        <section className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 sm:p-8">
                            <div className="mb-6">
                                <p className="text-orange-600 text-xs font-bold uppercase tracking-widest">
                                    Where should we deliver?
                                </p>
                                <h2 className="text-xl font-bold text-gray-900 mt-1">
                                    Delivery Address
                                </h2>
                            </div>

                            {addresses.length > 0 && (
                                <div className="space-y-3 mb-5">
                                    {addresses.map((addr) => (
                                        <label
                                            key={addr.id}
                                            className={`flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition ${selectedAddressId === addr.id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-100 hover:border-orange-200'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={selectedAddressId === addr.id}
                                                onChange={() => setSelectedAddressId(addr.id)}
                                                className="mt-1 accent-orange-600"
                                            />

                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {addr.streetAddress}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {addr.city}, {addr.state} - {addr.zipCode}
                                                </p>
                                                {addr.landmark && (
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        Landmark: {addr.landmark}
                                                    </p>
                                                )}
                                                {addr.defaultAddress && (
                                                    <span className="inline-block mt-2 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                                                        Default Address
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {!showAddForm && (
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="text-orange-600 font-semibold text-sm hover:text-orange-700"
                                >
                                    + Add a new address
                                </button>
                            )}

                            {showAddForm && (
                                <form
                                    onSubmit={handleAddAddress}
                                    className="border-t border-gray-100 pt-6 mt-5 space-y-4"
                                >
                                    <h3 className="font-bold text-gray-800">
                                        Add Delivery Address
                                    </h3>

                                    <input
                                        type="text"
                                        name="streetAddress"
                                        placeholder="Street address"
                                        value={newAddress.streetAddress}
                                        onChange={handleNewAddressChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                                    />

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={newAddress.city}
                                            onChange={handleNewAddressChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                                        />

                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={newAddress.state}
                                            onChange={handleNewAddressChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="PIN code"
                                        value={newAddress.zipCode}
                                        onChange={handleNewAddressChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                                    />

                                    <input
                                        type="text"
                                        name="landmark"
                                        placeholder="Landmark (optional)"
                                        value={newAddress.landmark}
                                        onChange={handleNewAddressChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                                    />

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="submit"
                                            disabled={savingAddress}
                                            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50"
                                        >
                                            {savingAddress ? 'Saving...' : 'Save Address'}
                                        </button>

                                        {addresses.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAddForm(false)}
                                                className="text-gray-500 px-4 py-3 font-medium"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </section>
                    </div>

                    {/* Right Section - Total */}

                    {/* Right Section - Bill Details */}
<aside className="min-w-0 w-full">                        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sm:p-7 lg:sticky lg:top-8">

                            <h2 className="text-xl font-extrabold text-gray-900 mb-7">
                                Bill Details
                            </h2>

                            <div className="space-y-5 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">
                                        Item Total ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        ₹{getTotal().toFixed(2)}
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
                                    ₹{getTotal().toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={placing || !selectedAddressId}
                                className="w-full mt-7 bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {placing ? 'Placing Order...' : 'Place Order →'}
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Your order will be placed securely.
                            </p>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
}

export default Checkout;
