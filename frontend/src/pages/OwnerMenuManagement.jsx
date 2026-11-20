import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { menuItemService } from '../services/menuItemService';

const CATEGORIES = [
    'STARTER',
    'MAIN_COURSE',
    'DESSERT',
    'BEVERAGE',
    'SNACK'
];

function OwnerMenuManagement() {
    const { id: restaurantId } = useParams();

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: 'MAIN_COURSE',
        available: true,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchMenuItems();
    }, [restaurantId]);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const data = await menuItemService.getOwnerMenuItems(restaurantId);
            setMenuItems(data);
        } catch (err) {
            setError('Could not load menu items.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            imageUrl: '',
            category: 'MAIN_COURSE',
            available: true,
        });

        setShowAddForm(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError('');

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                available: formData.available,
            };

            if (editingId !== null) {
                const updated = await menuItemService.updateMenuItem(
                    editingId,
                    payload
                );

                setMenuItems((prev) =>
                    prev.map((item) =>
                        item.id === editingId ? updated : item
                    )
                );
            } else {
                const created = await menuItemService.addMenuItem(
                    restaurantId,
                    payload
                );

                setMenuItems((prev) => [...prev, created]);
            }

            resetForm();
        } catch (err) {
            setError(
                'Could not save menu item. Please check the fields and try again.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price,
            imageUrl: item.imageUrl || '',
            category: item.category,
            available: item.available ?? true,
        });

        setEditingId(item.id);
        setShowAddForm(true);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Remove this item from the menu?')) {
            return;
        }

        try {
            await menuItemService.deleteMenuItem(itemId);

            setMenuItems((prev) =>
                prev.filter((item) => item.id !== itemId)
            );
        } catch (err) {
            setError('Could not remove this item.');
        }
    };

   const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-[#f1d8c8] bg-[#fffaf6] text-[#33251f] text-sm outline-none placeholder:text-[#b9a69b] focus:border-[#e8753d] focus:ring-4 focus:ring-orange-100 transition-all duration-200";
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 mb-8">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#e8753d]">
                            Restaurant management
                        </p>

                        <h1 className="text-3xl font-extrabold mt-2">
                            Manage Menu
                        </h1>

                        <p className="text-sm text-[#8c7770] mt-2">
                            Add your dishes and keep your menu updated.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            showAddForm ? resetForm() : setShowAddForm(true)
                        }
                        className="bg-[#e8753d] text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#cc5d2b] transition"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Food Item'}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-7">
                    <div className="bg-white rounded-2xl p-5 border border-orange-100">
                        <p className="text-sm text-[#9a8982]">
                            Total Menu Items
                        </p>

                        <p className="text-3xl font-extrabold mt-2">
                            {menuItems.length}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-orange-100">
                        <p className="text-sm text-[#9a8982]">
                            Available Items
                        </p>

                        <p className="text-3xl font-extrabold mt-2">
                            {menuItems.filter((item) => item.available).length}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                        {error}
                    </div>
                )}

                {showAddForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-3xl border border-orange-100 shadow-lg p-6 sm:p-8 mb-8 space-y-6"
                    >
                        <div className="border-b border-orange-100 pb-5">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#e8753d] mb-2">
                                Menu Details
                            </p>

                            <h2 className="text-2xl font-extrabold text-[#33251f]">
                                {editingId !== null ? 'Edit Food Item' : 'Add New Food Item'}
                            </h2>

                            <p className="text-sm text-[#9a8982] mt-2">
                                Enter the details of your dish.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#4b342b] mb-2">
                                Food Name <span className="text-[#e8753d]">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Chicken Biryani"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#4b342b] mb-2">
                                Description
                            </label>

                            <textarea
                                name="description"
                                placeholder="Describe your dish..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Price (₹)
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Enter price"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Image URL (Optional)
                            </label>

                            <input
                                type="text"
                                name="imageUrl"
                                placeholder="Paste food image URL"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <label className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100 cursor-pointer">
                            <input
                                type="checkbox"
                                name="available"
                                checked={formData.available}
                                onChange={handleChange}
                                className="w-5 h-5 accent-orange-600"
                            />

                            <span>
                                <span className="block text-sm font-bold">
                                    Available for customers
                                </span>

                                <span className="block text-xs text-[#9a8982] mt-1">
                                    Customers can order this dish when enabled.
                                </span>
                            </span>
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-[#e8753d] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#cc5d2b] transition disabled:opacity-50"
                            >
                                {saving
                                    ? 'Saving...'
                                    : editingId !== null
                                        ? 'Update Item'
                                        : 'Add Item'}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 rounded-xl border border-orange-200 text-[#765e53] font-semibold hover:bg-orange-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                <div className="mb-4">
                    <h2 className="text-xl font-bold">
                        Your Food Items
                    </h2>

                    <p className="text-sm text-[#9a8982] mt-1">
                        Manage the dishes displayed to customers.
                    </p>
                </div>

                {loading && (
                    <p className="text-center text-[#8c7770] py-10">
                        Loading menu items...
                    </p>
                )}

                {!loading && menuItems.length === 0 && !showAddForm && (
                    <div className="bg-white border border-orange-100 rounded-3xl p-10 text-center">
                        <div className="text-5xl mb-4">🍽️</div>

                        <h3 className="text-lg font-bold">
                            Your menu is empty
                        </h3>

                        <p className="text-sm text-[#9a8982] mt-2">
                            Add your first food item to get started.
                        </p>
                    </div>
                )}

                {!loading && menuItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-3xl border border-orange-100 shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <img
                                    src={
                                        item.imageUrl ||
                                        (item.name.toLowerCase().includes('special')
                                            ? "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800"
                                            : "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800")
                                    }
                                    alt={item.name}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {item.name}
                                            </h3>

                                            <p className="text-xs text-[#dc6b35] font-semibold mt-1">
                                                {item.category.replace('_', ' ')}
                                            </p>
                                        </div>

                                        <span
                                            className={`text-xs font-semibold px-3 py-1 rounded-full ${item.available
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-600'
                                                }`}
                                        >
                                            {item.available
                                                ? 'Available'
                                                : 'Unavailable'}
                                        </span>
                                    </div>

                                    {item.description && (
                                        <p className="text-sm text-[#8c7770] mt-3">
                                            {item.description}
                                        </p>
                                    )}

                                    <p className="text-2xl font-extrabold text-[#dc6b35] mt-5">
                                        ₹{Number(item.price).toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex gap-3 border-t border-orange-100 pt-4 mt-auto">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 py-3 rounded-xl bg-[#e8753d] text-white text-sm font-bold hover:bg-[#cc5d2b] transition shadow-sm"                                    >
                                        Edit Item
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition"                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default OwnerMenuManagement;
