
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { restaurantService } from '../services/restaurantService';

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

const categoryIcons = {
    STARTER: '🥗',
    MAIN_COURSE: '🍛',
    DESSERT: '🍰',
    BEVERAGE: '🥤',
    SNACK: '🍟',
};

function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await restaurantService.getAllRestaurants();
                setRestaurants(data);
            } catch {
                setError('Could not load restaurants. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const availableCategories = [
        ...new Set(
            restaurants.flatMap((r) =>
                (r.menuItems || []).map((item) => item.category)
            )
        ),
    ].sort();


    const filteredRestaurants = restaurants.filter((restaurant) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            restaurant.name.toLowerCase().includes(search) ||
            (restaurant.address || '').toLowerCase().includes(search) ||
            (restaurant.menuItems || []).some((item) =>
                (item.name || '').toLowerCase().includes(search)
            );

        const matchesCategory =
            categoryFilter === 'ALL' ||
            (restaurant.menuItems || []).some(
                (item) => item.category === categoryFilter
            );

        return matchesSearch && matchesCategory;
    });


    return (
        <div className="min-h-screen bg-[#fffaf5] text-[#33251f]">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10">

                {/* HERO */}
                <section className="pt-8">
                    <div className="relative overflow-hidden rounded-[32px] bg-[#f8e8d9]">
                        <div className="grid md:grid-cols-2 items-center">

                            <div className="relative z-10 px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wide text-[#cf6339] shadow-sm">
                                    <span>✦</span> FOOD THAT MAKES YOU HAPPY
                                </span>

                                <h1 className="mt-7 text-4xl sm:text-5xl lg:text-[58px] font-black leading-[1.12] tracking-tight">
                                    Cravings?
                                    <br />
                                    We've got
                                    <br />
                                    <span className="text-[#df693b]">
                                        you covered.
                                    </span>
                                </h1>

                                <p className="mt-5 max-w-md text-base leading-7 text-[#806e63]">
                                    From comforting biryani to your favourite
                                    treats, discover delicious food from
                                    restaurants around you.
                                </p>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        document.getElementById('restaurants')?.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                    }}
                                    className="mt-8 flex max-w-lg flex-col gap-2 rounded-2xl bg-white p-2 shadow-lg sm:flex-row"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                                        <span className="text-xl">⌕</span>
                                        <input
                                            type="text"
                                            placeholder="Search dishes, restaurants or locations" value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full min-w-0 py-3 text-sm outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="rounded-xl bg-[#e8753d] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#c95d2d]"
                                    >
                                        Find Food →
                                    </button>
                                </form>

                                <div className="mt-7 flex flex-wrap gap-5 text-sm font-medium text-[#806e63]">
                                    <span>✓ Delicious choices</span>
                                    <span>✓ Easy ordering</span>
                                </div>
                            </div>

                            <div className="relative min-h-[320px] md:min-h-[510px] p-6 sm:p-10">
                                <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#f1c7a6] blur-3xl opacity-70" />

                                <img
                                    src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200"
                                    alt="Delicious Indian biryani"
                                    className="relative z-10 h-[320px] w-full rounded-[28px] object-cover shadow-2xl sm:h-[410px]"
                                />

                                <div className="absolute bottom-9 left-2 z-20 rounded-2xl bg-white px-5 py-3 shadow-xl sm:bottom-14 sm:left-0">
                                    <p className="text-xs text-[#99877d]">
                                        Today's craving
                                    </p>
                                    <p className="mt-1 font-bold text-[#bd5635]">
                                        Biryani Mood 🍛
                                    </p>
                                </div>

                                <div className="absolute right-9 top-3 z-20 rounded-full bg-white px-4 py-3 text-sm font-bold shadow-lg">
                                    ❤️ Made with love
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CATEGORIES */}
                <section className="py-14">
                    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold tracking-[2px] text-[#df693b]">
                                WHAT ARE YOU CRAVING?
                            </p>
                            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                                Explore Categories
                            </h2>
                        </div>

                        <button
                            onClick={() => setCategoryFilter('ALL')}
                            className="text-sm font-bold text-[#d96537] hover:underline"
                        >
                            View All →
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {availableCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() =>
                                    setCategoryFilter(
                                        categoryFilter === category ? 'ALL' : category
                                    )
                                }
                                className={`rounded-2xl border p-5 text-center transition duration-200 hover:-translate-y-1 hover:shadow-md ${categoryFilter === category
                                    ? 'border-[#e8753d] bg-[#fce8d9] shadow-sm'
                                    : 'border-[#f0e6dc] bg-white hover:border-[#e9b99c]'
                                    }`}
                            >
                                <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-[#fff1e6] text-3xl">
                                    {categoryIcons[category] || '🍴'}
                                </span>
                                <p className="mt-3 text-sm font-bold text-[#45362e]">
                                    {category.replace(/_/g, ' ')}
                                </p>
                            </button>
                        ))}
                    </div>

                    {availableCategories.length === 0 && (
                        <p className="text-sm text-[#99877d]">
                            Categories will appear when restaurants add menu items.
                        </p>
                    )}
                </section>

                {/* RESTAURANTS */}
                <section id="restaurants" className="scroll-mt-8 pb-14">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold tracking-[2px] text-[#df693b]">
                                DISCOVER SOMETHING DELICIOUS
                            </p>
                            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                                Restaurants Near You
                            </h2>
                            <p className="mt-2 text-sm text-[#99877d]">
                                Find your next favourite meal.
                            </p>
                        </div>

                        <span className="rounded-full bg-[#fce8d9] px-4 py-2 text-sm font-bold text-[#bd5635]">
                            {filteredRestaurants.length} Restaurants
                        </span>
                    </div>

                    {loading && (
                        <div className="py-16 text-center">
                            <div className="text-4xl animate-bounce">🍛</div>
                            <p className="mt-4 text-sm text-[#99877d]">
                                Finding delicious restaurants...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-red-600">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredRestaurants.length === 0 && (
                        <div className="rounded-3xl border border-[#f0e6dc] bg-white p-12 text-center">
                            <span className="text-5xl">🍽️</span>
                            <h3 className="mt-4 text-xl font-bold">
                                No restaurants found
                            </h3>
                            <p className="mt-2 text-sm text-[#99877d]">
                                Try another search or category.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setCategoryFilter('ALL');
                                }}
                                className="mt-5 font-bold text-[#d96537]"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredRestaurants.map((restaurant, index) => (
                            <Link
                                key={restaurant.id}
                                to={`/restaurants/${restaurant.id}`}
                                className="group overflow-hidden rounded-3xl border border-[#f0e6dc] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="relative h-56 overflow-hidden bg-[#fce8d9]">
                                    <img
                                        src={restaurantImages[restaurant.id]}
                                        alt={restaurant.name}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <span className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#bd5635] shadow">
                                        Restaurant
                                    </span>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-extrabold transition group-hover:text-[#d96537]">
                                        {restaurant.name}
                                    </h3>

                                    <p className="mt-2 text-sm text-[#99877d]">
                                        📍 {restaurant.address || 'Address unavailable'}
                                    </p>

                                    {restaurant.description && (
                                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#887970]">
                                            {restaurant.description}
                                        </p>
                                    )}

                                    <div className="mt-5 flex items-center justify-between border-t border-[#f2eae3] pt-4">
                                        <span className="text-sm font-bold text-[#d96537]">
                                            Explore Menu
                                        </span>
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0e5] text-[#d96537] transition group-hover:bg-[#e8753d] group-hover:text-white">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* BOTTOM BANNER */}
                <section className="mb-14 overflow-hidden rounded-[28px] bg-[#bd4932]">
                    <div className="grid items-center md:grid-cols-2">
                        <div className="px-8 py-10 text-white sm:px-12">
                            <p className="text-xs font-bold tracking-[2px] text-orange-100">
                                GOOD FOOD IS ALWAYS A GOOD IDEA
                            </p>

                            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                                Your next favourite meal is waiting.
                            </h2>

                            <p className="mt-4 text-sm leading-6 text-orange-100">
                                Explore restaurants and discover something
                                delicious today.
                            </p>

                            <button
                                onClick={() =>
                                    document.getElementById('restaurants')?.scrollIntoView({
                                        behavior: 'smooth',
                                    })
                                }
                                className="mt-6 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#bd4932] transition hover:bg-orange-50"
                            >
                                Explore Restaurants →
                            </button>
                        </div>

                        <div className="p-5 sm:p-7">
                            <img
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
                                alt="Fresh food"
                                className="h-64 w-full rounded-2xl object-cover"
                            />
                        </div>
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="border-t border-[#f0e6dc] bg-white px-6 py-8">
                <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-black text-[#d96537]">
                            🍴 Munchly.
                        </h2>
                        <p className="mt-1 text-xs text-[#99877d]">
                            Good Food. Good Mood.
                        </p>
                    </div>

                    <p className="text-xs text-[#aa9b92]">
                        © {new Date().getFullYear()} Munchly. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
