import { useState, useEffect, useRef } from "react";
import {
  FilterIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";

const PRICE_MIN = 0;
const PRICE_MAX = 10000;

const FilterPanel = ({
  isOpen,
  onToggle,
  filters,
  onFilterChange,
  onApply,
  onReset,
  isMobile = false,
  onClose = () => {},
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const sliderRef = useRef(null);
  const [activeThumb, setActiveThumb] = useState(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const getPercent = (value) =>
    ((value - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const handlePriceMinChange = (value) => {
    const newMin = Math.min(Number(value), localFilters.priceMax);
    setLocalFilters((prev) => ({ ...prev, priceMin: newMin }));
  };

  const handlePriceMaxChange = (value) => {
    const newMax = Math.max(Number(value), localFilters.priceMin);
    setLocalFilters((prev) => ({ ...prev, priceMax: newMax }));
  };

  const handleSliderMouseDown = (e, thumb) => {
    e.preventDefault();
    setActiveThumb(thumb);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!activeThumb || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
      );
      const value = Math.round(
        (percent / 100) * (PRICE_MAX - PRICE_MIN) + PRICE_MIN,
      );

      if (activeThumb === "min") {
        handlePriceMinChange(value);
      } else {
        handlePriceMaxChange(value);
      }
    };

    const handleMouseUp = () => {
      setActiveThumb(null);
    };

    if (activeThumb) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeThumb, localFilters.priceMin, localFilters.priceMax]);

  const handleGuestsChange = (delta) => {
    setLocalFilters((prev) => ({
      ...prev,
      guests: Math.max(0, (prev.guests || 0) + delta),
    }));
  };

  const handleBedsChange = (delta) => {
    setLocalFilters((prev) => ({
      ...prev,
      beds: Math.max(0, (prev.beds || 0) + delta),
    }));
  };

  const handleBathsChange = (delta) => {
    setLocalFilters((prev) => ({
      ...prev,
      baths: Math.max(0, (prev.baths || 0) + delta),
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply(localFilters);
    if (isMobile) {
      onClose();
    }
  };

  const handleReset = () => {
    const resetFilters = {
      priceMin: PRICE_MIN,
      priceMax: PRICE_MAX,
      guests: 0,
      beds: 0,
      baths: 0,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset(resetFilters);
    if (isMobile) {
      onClose();
    }
  };

  const priceMinPercent = getPercent(localFilters.priceMin);
  const priceMaxPercent = getPercent(localFilters.priceMax);

  const NumberSelector = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => onChange(-1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <span className="text-gray-600 font-bold">−</span>
        </button>
        <span className="w-8 text-center font-medium text-gray-800">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <span className="text-gray-600 font-bold">+</span>
        </button>
      </div>
    </div>
  );

  const filterContent = (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-3">
          Price range
        </label>
        <div className="relative h-10 px-3">
          <div
            ref={sliderRef}
            className="absolute top-1/2 left-3 right-3 h-1.5 bg-gray-200 rounded-full transform -translate-y-1/2 cursor-pointer"
          >
            <div
              className="absolute top-0 h-full bg-blue-500 rounded-full"
              style={{
                left: `${priceMinPercent}%`,
                width: `${priceMaxPercent - priceMinPercent}%`,
              }}
            />
          </div>

          <div
            className={`absolute top-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-grab hover:scale-110 transition-transform ${
              activeThumb === "min" ? "cursor-grabbing scale-110" : ""
            }`}
            style={{ left: `calc(${priceMinPercent}% + 12px)` }}
            onMouseDown={(e) => handleSliderMouseDown(e, "min")}
          >
            <div className="absolute inset-1 bg-blue-500 rounded-full" />
          </div>

          <div
            className={`absolute top-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-grab hover:scale-110 transition-transform ${
              activeThumb === "max" ? "cursor-grabbing scale-110" : ""
            }`}
            style={{ left: `calc(${priceMaxPercent}% + 12px)` }}
            onMouseDown={(e) => handleSliderMouseDown(e, "max")}
          >
            <div className="absolute inset-1 bg-blue-500 rounded-full" />
          </div>
        </div>

        <div className="flex justify-between mt-3 px-1">
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-400 mb-1">Minimum</span>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
              <span className="text-gray-500 text-sm mr-1">$</span>
              <input
                type="number"
                min={PRICE_MIN}
                max={localFilters.priceMax}
                value={localFilters.priceMin}
                onChange={(e) => handlePriceMinChange(e.target.value)}
                className="w-20 bg-transparent text-gray-800 font-medium text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 mb-1">Maximum</span>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
              <span className="text-gray-500 text-sm mr-1">$</span>
              <input
                type="number"
                min={localFilters.priceMin}
                max={PRICE_MAX}
                value={localFilters.priceMax}
                onChange={(e) => handlePriceMaxChange(e.target.value)}
                className="w-20 bg-transparent text-gray-800 font-medium text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <NumberSelector
          label="Guests"
          value={localFilters.guests}
          onChange={handleGuestsChange}
        />
        <NumberSelector
          label="Beds"
          value={localFilters.beds}
          onChange={handleBedsChange}
        />
        <NumberSelector
          label="Baths"
          value={localFilters.baths}
          onChange={handleBathsChange}
        />
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
        <div className="w-full bg-white rounded-t-2xl max-h-[90vh] overflow-auto">
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <XIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6">{filterContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center space-x-2">
          <FilterIcon className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {filterContent}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
