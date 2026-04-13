import { useState, useEffect } from 'react';
import { FilterIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

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

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handlePriceMinChange = (value) => {
    const newMin = Math.min(Number(value), localFilters.priceMax);
    setLocalFilters(prev => ({ ...prev, priceMin: newMin }));
  };

  const handlePriceMaxChange = (value) => {
    const newMax = Math.max(Number(value), localFilters.priceMin);
    setLocalFilters(prev => ({ ...prev, priceMax: newMax }));
  };

  const handleGuestsChange = (delta) => {
    setLocalFilters(prev => ({
      ...prev,
      guests: Math.max(0, (prev.guests || 0) + delta),
    }));
  };

  const handleBedsChange = (delta) => {
    setLocalFilters(prev => ({
      ...prev,
      beds: Math.max(0, (prev.beds || 0) + delta),
    }));
  };

  const handleBathsChange = (delta) => {
    setLocalFilters(prev => ({
      ...prev,
      baths: Math.max(0, (prev.baths || 0) + delta),
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
    if (isMobile) {
      onClose();
    }
  };

  const handleReset = () => {
    const resetFilters = {
      priceMin: 0,
      priceMax: 10000,
      guests: 0,
      beds: 0,
      baths: 0,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset();
    if (isMobile) {
      onClose();
    }
  };

  const priceMinPercent = ((localFilters.priceMin - 0) / (10000 - 0)) * 100;
  const priceMaxPercent = ((localFilters.priceMax - 0) / (10000 - 0)) * 100;

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
        <span className="w-8 text-center font-medium text-gray-800">{value}</span>
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
        <div className="relative h-8">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2" />
          <div
            className="absolute top-1/2 h-1 bg-blue-500 rounded-full transform -translate-y-1/2"
            style={{
              left: `${priceMinPercent}%`,
              width: `${priceMaxPercent - priceMinPercent}%`,
            }}
          />
          <input
            type="range"
            min="0"
            max="10000"
            value={localFilters.priceMin}
            onChange={(e) => handlePriceMinChange(e.target.value)}
            className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer slider-thumb"
            style={{ zIndex: priceMinPercent > priceMaxPercent ? 10 : 5 }}
          />
          <input
            type="range"
            min="0"
            max="10000"
            value={localFilters.priceMax}
            onChange={(e) => handlePriceMaxChange(e.target.value)}
            className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer slider-thumb"
            style={{ zIndex: priceMaxPercent > priceMinPercent ? 10 : 5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>${localFilters.priceMin.toLocaleString()}</span>
          <span>${localFilters.priceMax.toLocaleString()}</span>
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
          <div className="p-6">
            {filterContent}
          </div>
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
