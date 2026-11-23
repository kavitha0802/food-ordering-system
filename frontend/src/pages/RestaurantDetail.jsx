
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { restaurantService } from '../services/restaurantService';
import { reviewService } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const restaurantImages = {
    1: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700',
    2: 'https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=700&q=80',
    3: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700',
    4: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=700',
    5: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700',
    6: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700',
    7: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=700',
    8: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=700',
};
const foodImages = [
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700',
    'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700',
];

const categoryIcons = {
    STARTER: '🥗',
    MAIN_COURSE: '🍛',
    DESSERT: '🍰',
    BEVERAGE: '🥤',
    SNACK: '🍟',
};

function RestaurantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, hasRole } = useAuth();
    const { addItem, items, restaurantId, getItemCount } = useCart();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rating, setRating] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({
        rating: 5,
        comment: '',
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');

    const isOwner = isAuthenticated && hasRole('RESTAURANT_OWNER');

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const data = await restaurantService.getRestaurantById(id);
                setRestaurant(data);
            } catch {
                setError('Could not load this restaurant.');
            } finally {
                setLoading(false);
            }
        };

        const fetchReviewData = async () => {
            try {
                const [ratingData, reviewsData] = await Promise.all([
                    reviewService.getRestaurantRating(id),
                    reviewService.getReviewsByRestaurant(id),
                ]);
                setRating(ratingData);
                setReviews(reviewsData);
            } catch {
                // Reviews are optional.
            }
        };

        fetchRestaurant();
        fetchReviewData();
    }, [id]);

    const handleAddToCart = (menuItem) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        addItem(menuItem, restaurant);
    };

    const getQuantityInCart = (menuItemId) => {
        const item = items.find((i) => i.menuItemId === menuItemId);
        return item ? item.quantity : 0;
    };

    const handleReviewChange = (e) => {
        setReviewFormData({
            ...reviewFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        setReviewError('');

        try {
            const created = await reviewService.addReview(id, {
                rating: parseInt(reviewFormData.rating, 10),
                comment: reviewFormData.comment,
            });

            setReviews((previous) => [created, ...previous]);

            const updatedRating = await reviewService.getRestaurantRating(id);
            setRating(updatedRating);

            setShowReviewForm(false);
            setReviewFormData({ rating: 5, comment: '' });
        } catch (err) {
            setReviewError(
                err.response?.data?.message || 'Could not submit review.'
            );
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fffaf5]">
                <Navbar />
                <p className="py-24 text-center text-[#99877d]">
                    Finding something delicious...
                </p>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="min-h-screen bg-[#fffaf5]">
                <Navbar />
                <p className="py-24 text-center text-red-600">
                    {error || 'Restaurant not found.'}
                </p>
            </div>
        );
    }

    const menuItems = restaurant.menuItems || [];

    return (
        <div className="min-h-screen bg-[#fffaf5] text-[#33251f] pb-28">
            <Navbar />

            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9683d] hover:text-[#a94d2b]"
                >
                    ← Back to restaurants
                </Link>

                {/* RESTAURANT HEADER */}
                <section className="mt-6 overflow-hidden rounded-[28px] bg-white border border-[#f0e5da] shadow-sm">
<div className="grid min-w-0 md:min-h-[340px] md:grid-cols-[1.1fr_0.9fr]">                            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                            <span className="w-fit rounded-full bg-[#fff0e4] px-4 py-2 text-xs font-bold tracking-wide text-[#c9683d]">
                                ✦ WELCOME TO FOODHUB
                            </span>

                            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                                {restaurant.name}
                            </h1>

                            <p className="mt-4 text-sm leading-6 text-[#887970]">
                                {restaurant.description ||
                                    'Discover delicious food and enjoy every bite.'}
                            </p>

                            <p className="mt-4 text-sm text-[#887970]">
                                📍 {restaurant.address}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                {rating && (
                                    <div className="flex items-center gap-2 rounded-xl bg-[#fff5e9] px-4 py-3">
                                        <span className="text-[#e59a35]">★</span>
                                        <span className="font-bold">
                                            {Number(rating.averageRating || 0).toFixed(1)}
                                        </span>
                                        <span className="text-xs text-[#887970]">
                                            ({rating.totalReviews} reviews)
                                        </span>
                                    </div>
                                )}

                                <div className="rounded-xl bg-[#f8f4ef] px-4 py-3 text-sm font-semibold text-[#75675e]">
                                    🍽️ Freshly prepared
                                </div>
                            </div>
                        </div>

<div className="h-[340px] min-w-0 p-4 sm:p-6">                            <img
                                src={restaurantImages[restaurant.id]}
alt={restaurant.name}                                className="h-full min-h-0 w-full rounded-[22px] object-cover" />
                        </div>
                    </div>
                </section>

                {isOwner && (
                    <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
                        You're viewing this as a restaurant owner. Ordering is only available for customer accounts.
                    </div>
                )}

                {/* MENU */}
                <section className="mt-14">
                    <div className="mb-8">
                        <p className="text-xs font-bold tracking-[2px] text-[#d66a3c]">
                            MADE WITH LOVE
                        </p>
                        <h2 className="mt-2 text-3xl font-black">
                            Explore Our Menu
                        </h2>
                        <p className="mt-2 text-sm text-[#99877d]">
                            Handpicked favourites, ready to make your day.
                        </p>
                    </div>

                    {menuItems.length === 0 ? (
                        <div className="rounded-2xl border border-[#f0e5da] bg-white p-12 text-center text-[#99877d]">
                            This restaurant hasn't added any menu items yet.
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {menuItems.map((item, index) => (
                                <article
                                    key={item.id}
                                    className="group overflow-hidden rounded-[24px] border border-[#f0e5da] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="relative h-52 overflow-hidden bg-[#f8e8d9]">
                                        <img
                                            src={item.imageUrl || item.image_url || foodImages[0]}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />

                                        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-[#bd5635] shadow-sm">
                                            {categoryIcons[item.category] || '🍴'}{' '}
                                            {(item.category || 'FOOD').replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-lg font-extrabold">
                                                {item.name}
                                            </h3>
                                            <span className="whitespace-nowrap text-lg font-black text-[#d66a3c]">
                                                ₹{Number(item.price || 0).toFixed(2)}
                                            </span>
                                        </div>

                                        <p className="mt-2 min-h-10 text-sm leading-5 text-[#99877d]">
                                            {item.description || 'Prepared fresh and served with care.'}
                                        </p>

                                        {!isOwner && (
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={item.available === false}
                                                className="mt-5 w-full rounded-xl bg-[#bd4932] py-3 font-bold text-white transition hover:bg-[#a83c29] disabled:cursor-not-allowed disabled:bg-gray-300"
                                            >
                                                {item.available === false
                                                    ? 'Currently Unavailable'
                                                    : getQuantityInCart(item.id) > 0
                                                        ? `+ Add More (${getQuantityInCart(item.id)} in cart)`
                                                        : '+ Add to Cart'}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* REVIEWS */}
                <section className="mt-16">
                    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold tracking-[2px] text-[#d66a3c]">
                                REAL EXPERIENCES
                            </p>
                            <h2 className="mt-2 text-3xl font-black">
                                What Customers Say
                            </h2>
                        </div>

                        {isAuthenticated && hasRole('CUSTOMER') && (
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="rounded-xl bg-[#fff0e4] px-5 py-3 font-bold text-[#bd5635] transition hover:bg-[#f9dfcc]"
                            >
                                {showReviewForm ? 'Cancel' : '+ Write a Review'}
                            </button>
                        )}
                    </div>

                    {reviewError && (
                        <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                            {reviewError}
                        </div>
                    )}

                    {showReviewForm && (
                        <form
                            onSubmit={handleSubmitReview}
                            className="mb-7 space-y-4 rounded-2xl border border-[#f0e5da] bg-white p-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-bold">
                                    Your Rating
                                </label>
                                <select
                                    name="rating"
                                    value={reviewFormData.rating}
                                    onChange={handleReviewChange}
                                    className="w-full rounded-xl border border-[#e9dfd5] bg-[#fffaf5] px-4 py-3 outline-none focus:border-[#e8753d] sm:w-52"
                                >
                                    {[5, 4, 3, 2, 1].map((n) => (
                                        <option key={n} value={n}>
                                            {n} Star{n !== 1 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold">
                                    Your Experience
                                </label>
                                <textarea
                                    name="comment"
                                    value={reviewFormData.comment}
                                    onChange={handleReviewChange}
                                    placeholder="Tell us what you loved..."
                                    rows={4}
                                    className="w-full rounded-xl border border-[#e9dfd5] bg-[#fffaf5] px-4 py-3 outline-none focus:border-[#e8753d]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="rounded-xl bg-[#bd4932] px-6 py-3 font-bold text-white hover:bg-[#a83c29] disabled:opacity-50"
                            >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {reviews.length === 0 ? (
                        <div className="rounded-2xl border border-[#f0e5da] bg-white p-10 text-center">
                            <span className="text-4xl">💬</span>
                            <p className="mt-3 font-bold">
                                No reviews yet
                            </p>
                            <p className="mt-2 text-sm text-[#99877d]">
                                Be the first to share your experience!
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {reviews.map((review) => (
                                <article
                                    key={review.id}
                                    className="rounded-2xl border border-[#f0e5da] bg-white p-6 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-bold">
                                            {review.reviewerName}
                                        </span>
                                        <span className="text-[#e59a35]">
                                            {'★'.repeat(review.rating)}
                                            {'☆'.repeat(5 - review.rating)}
                                        </span>
                                    </div>

                                    {review.comment && (
                                        <p className="mt-3 text-sm leading-6 text-[#887970]">
                                            {review.comment}
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* FLOATING CART */}
            {!isOwner && restaurantId === restaurant.id && getItemCount() > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-orange-200 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                        <div>
                            <p className="font-extrabold text-[#33251f]">
                                {getItemCount()} item(s) in your cart
                            </p>
                            <p className="mt-1 text-xs text-[#99877d]">
                                Your delicious choices are waiting!
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="rounded-xl bg-[#bd4932] px-6 py-3 font-bold text-white transition hover:bg-[#a83c29]"
                        >
                            View Cart →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RestaurantDetail;
