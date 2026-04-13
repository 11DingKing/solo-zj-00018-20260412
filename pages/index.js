import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Grid from "@/components/Grid";
import FilterPanel from "@/components/FilterPanel";
import { FilterIcon } from "@heroicons/react/outline";

const sampleData = [
  {
    id: "001",
    image: "/homes/space.jpeg",
    title: "Peaceful retreat in Space with stunning view of Earth",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    guests: 2,
    beds: 1,
    baths: 1,
    price: 2500,
  },
  {
    id: "002",
    image: "/homes/amsterdam.jpeg",
    title: "Luxury houseboat in Amsterdam center",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    guests: 4,
    beds: 3,
    baths: 2,
    price: 1500,
  },
  {
    id: "003",
    image: "/homes/providence.jpeg",
    title: "Clean and modern apartment in downtown Providence, RI",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    guests: 2,
    beds: 1,
    baths: 1,
    price: 170,
  },
  {
    id: "004",
    image: "/homes/shanghai.jpeg",
    title: "Entire rental unit on the Bund - Shanghai",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    guests: 6,
    beds: 3,
    baths: 3,
    price: 765,
  },
];

const FAVORITES_KEY = "home_favorites";

export default function Home() {
  const [allHomes, setAllHomes] = useState(sampleData);
  const [filteredHomes, setFilteredHomes] = useState(sampleData);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    guests: 0,
    beds: 0,
    baths: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load favorites:", e);
    }
  }, [isClient]);

  const saveFavorites = (newFavorites) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  };

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    saveFavorites(newFavorites);
  };

  const applyFilters = () => {
    setLoading(true);
    setError(null);

    try {
      const errors = [];

      if (filters.priceMin < 0) {
        errors.push("priceMin must be a non-negative number");
      }
      if (filters.priceMax < 0) {
        errors.push("priceMax must be a non-negative number");
      }
      if (filters.priceMin > filters.priceMax) {
        errors.push("priceMin cannot be greater than priceMax");
      }
      if (filters.guests < 0 || !Number.isInteger(filters.guests)) {
        errors.push("guests must be a non-negative integer");
      }
      if (filters.beds < 0 || !Number.isInteger(filters.beds)) {
        errors.push("beds must be a non-negative integer");
      }
      if (filters.baths < 0 || !Number.isInteger(filters.baths)) {
        errors.push("baths must be a non-negative integer");
      }

      if (errors.length > 0) {
        setError(errors.join(", "));
        setLoading(false);
        return;
      }

      let result = [...allHomes];

      if (filters.priceMin > 0) {
        result = result.filter((home) => home.price >= filters.priceMin);
      }
      if (filters.priceMax < 10000) {
        result = result.filter((home) => home.price <= filters.priceMax);
      }
      if (filters.guests > 0) {
        result = result.filter((home) => home.guests >= filters.guests);
      }
      if (filters.beds > 0) {
        result = result.filter((home) => home.beds >= filters.beds);
      }
      if (filters.baths > 0) {
        result = result.filter((home) => home.baths >= filters.baths);
      }

      setFilteredHomes(result);
    } catch (e) {
      console.error("Filter error:", e);
      setError("Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilteredHomes(allHomes);
    setError(null);
  };

  const getDisplayHomes = () => {
    let result = filteredHomes;

    if (showFavoritesOnly) {
      result = result.filter((home) => favorites.includes(home.id));
    }

    return result.map((home) => ({
      ...home,
      favorite: favorites.includes(home.id),
    }));
  };

  const displayHomes = getDisplayHomes();

  if (!isClient) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">
          Top-rated places to stay
        </h1>
        <p className="text-gray-500">
          Explore some of the best places in the world
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 text-sm">Show favorites only</span>
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`toggle-switch ${showFavoritesOnly ? "active" : ""}`}
            aria-label={
              showFavoritesOnly
                ? "Hide favorites filter"
                : "Show favorites only"
            }
          />
        </div>

        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FilterIcon className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Filters</span>
          </button>
        ) : null}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!isMobile && (
        <div className="mb-6">
          <FilterPanel
            isOpen={filterPanelOpen}
            onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
            filters={filters}
            onFilterChange={setFilters}
            onApply={applyFilters}
            onReset={resetFilters}
          />
        </div>
      )}

      {isMobile && mobileFilterOpen && (
        <FilterPanel
          isOpen={true}
          onToggle={() => {}}
          filters={filters}
          onFilterChange={setFilters}
          onApply={applyFilters}
          onReset={resetFilters}
          isMobile={true}
          onClose={() => setMobileFilterOpen(false)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="mt-8">
          <Grid homes={displayHomes} onClickFavorite={toggleFavorite} />
        </div>
      )}
    </Layout>
  );
}
