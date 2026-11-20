
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { addressService } from '../services/addressService';

function MyAddresses() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const data = await addressService.getMyAddresses();
            setAddresses(data);
        } catch (err) {
            setError('Could not load your addresses.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const created = await addressService.addAddress(newAddress);
            setAddresses((prev) => [...prev, created]);
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
            setSaving(false);
        }
    };

    const handleDelete = async (addressId) => {
        if (!window.confirm('Delete this address?')) return;

        setDeletingId(addressId);
        setError('');

        try {
            await addressService.deleteAddress(addressId);
            setAddresses((prev) => prev.filter((a) => a.id !== addressId));
        } catch (err) {
            const message =
                err.response?.data?.message ||
                'Could not delete this address. It may be linked to an existing order.';
            setError(message);
        } finally {
            setDeletingId(null);
        }
    };

    const inputStyle =
        "w-full px-4 py-3 border border-orange-100 rounded-xl text-sm text-gray-800 bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-orange-300";

    return (
        <div className="min-h-screen bg-[#fffaf5]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="text-orange-600 font-semibold text-sm tracking-widest uppercase mb-2">
                            Delivery details
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#292522]">
                            My Addresses
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Manage your saved delivery locations.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setError('');
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
                    >
                        {showAddForm ? '✕ Cancel' : '+ Add Address'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {showAddForm && (
                    <form
                        onSubmit={handleAdd}
                        className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sm:p-8 mb-8"
                    >
                        <h2 className="text-xl font-bold text-[#292522] mb-6">
                            Add a new address
                        </h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                name="streetAddress"
                                placeholder="Street address"
                                value={newAddress.streetAddress}
                                onChange={handleChange}
                                required
                                className={inputStyle}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={newAddress.city}
                                    onChange={handleChange}
                                    required
                                    className={inputStyle}
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={newAddress.state}
                                    onChange={handleChange}
                                    required
                                    className={inputStyle}
                                />
                            </div>

                            <input
                                type="text"
                                name="zipCode"
                                placeholder="Zip code"
                                value={newAddress.zipCode}
                                onChange={handleChange}
                                required
                                className={inputStyle}
                            />

                            <input
                                type="text"
                                name="landmark"
                                placeholder="Landmark (optional)"
                                value={newAddress.landmark}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Address'}
                        </button>
                    </form>
                )}

                {loading && (
                    <p className="text-gray-500 py-10 text-center">
                        Loading your addresses...
                    </p>
                )}

                {!loading && addresses.length === 0 && !showAddForm && (
                    <div className="bg-white border border-orange-100 rounded-2xl text-center py-16 px-6 shadow-sm">
                        <div className="text-5xl mb-4">📍</div>
                        <h2 className="text-xl font-bold text-gray-800">
                            No saved addresses
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Add your delivery address to make ordering easier.
                        </p>
                    </div>
                )}

                {!loading && addresses.length > 0 && (
                    <div className="space-y-4">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className="bg-white border border-orange-100 rounded-2xl p-5 sm:p-6 shadow-sm flex items-start justify-between gap-4 hover:shadow-md transition"
                            >
                                <div className="flex gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
                                        📍
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-800">
                                            {addr.streetAddress}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {addr.city}, {addr.state} - {addr.zipCode}
                                        </p>
                                        {addr.landmark && (
                                            <p className="text-gray-400 text-sm mt-1">
                                                Near {addr.landmark}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    disabled={deletingId === addr.id}
                                    className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 shrink-0"
                                >
                                    {deletingId === addr.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyAddresses;
