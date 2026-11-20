
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { restaurantService } from '../services/restaurantService';

function EditRestaurant() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        contactNumber: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deactivating, setDeactivating] = useState(false);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const data = await restaurantService.getRestaurantById(id);
                setFormData({
                    name: data.name,
                    description: data.description || '',
                    address: data.address,
                    contactNumber: data.contactNumber || '',
                });
            } catch (err) {
                setError('Could not load restaurant details.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await restaurantService.updateRestaurant(id, formData);
            navigate('/owner/dashboard');
        } catch (err) {
            const message = err.response?.data?.message || 'Could not update restaurant.';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async () => {
        if (!window.confirm('Deactivate this restaurant? It will stop accepting new orders.')) {
            return;
        }

        setDeactivating(true);
        try {
            await restaurantService.deactivateRestaurant(id);
            navigate('/owner/dashboard');
        } catch (err) {
            setError('Could not deactivate restaurant.');
            setDeactivating(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-orange-100 bg-[#fffaf6] text-[#33251f] text-sm outline-none focus:border-[#e8753d] focus:ring-2 focus:ring-orange-100 transition";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fff8f2]">
                <Navbar />
                <p className="text-center text-gray-500 mt-16">Loading restaurant details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fff8f2] text-[#33251f]">
            <Navbar />

            <main className="max-w-3xl mx-auto px-5 py-10">
                <Link
                    to="/owner/dashboard"
                    className="text-sm font-semibold text-[#dc6b35] hover:text-[#b94e20]"
                >
                    ← Back to My Restaurants
                </Link>

                <div className="mt-6 mb-8">
                    <p className="text-sm font-bold uppercase tracking-widest text-[#e8753d]">
                        Restaurant settings
                    </p>
                    <h1 className="text-3xl font-extrabold mt-2">
                        Edit Restaurant
                    </h1>
                    <p className="text-[#8c7770] mt-2 text-sm">
                        Keep your restaurant information up to date.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6 sm:p-8 space-y-6"
                >
                    <div>
                        <h2 className="text-lg font-bold">Restaurant information</h2>
                        <p className="text-sm text-[#9a8982] mt-1">
                            Update the details customers see.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Restaurant Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={inputClass}
                            placeholder="Enter restaurant name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={inputClass}
                            placeholder="Tell customers about your restaurant..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Restaurant Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className={inputClass}
                            placeholder="Enter full address"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter contact number"
                        />
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-[#e8753d] text-white py-3 rounded-xl font-bold hover:bg-[#cc5d2b] transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>

                        <Link
                            to="/owner/dashboard"
                            className="text-center px-6 py-3 rounded-xl border border-orange-200 text-[#765e53] font-semibold hover:bg-orange-50 transition"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>

                <section className="mt-8 bg-white border border-red-100 rounded-3xl p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-red-500">
                        Danger zone
                    </p>
                    <h2 className="text-lg font-bold mt-2">Deactivate Restaurant</h2>
                    <p className="text-sm text-[#8c7770] mt-2 leading-relaxed">
                        Deactivating stops new orders but keeps your existing order history intact.
                    </p>

                    <button
                        onClick={handleDeactivate}
                        disabled={deactivating}
                        className="mt-5 px-5 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition disabled:opacity-50"
                    >
                        {deactivating ? 'Deactivating...' : 'Deactivate Restaurant'}
                    </button>
                </section>
            </main>
        </div>
    );
}

export default EditRestaurant;
