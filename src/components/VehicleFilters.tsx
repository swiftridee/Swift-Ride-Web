import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface VehicleFiltersProps {
  vehicleType: string;
  brands: string[];
  locations: string[];
  onFilterChange: (filters: any) => void;
}

const MAX_VISIBLE_OPTIONS = 5;

const VehicleFilters = ({ vehicleType, brands, locations, onFilterChange }: VehicleFiltersProps) => {
  // Local state for filter fields
  const [localFilters, setLocalFilters] = useState({
    brand: "",
    location: "",
    priceRange: [5000, 150000],
    sortBy: "default"
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  // Brand options based on vehicle type
  const getBrandOptions = () => {
    switch (vehicleType) {
      case "car":
        return ["Toyota", "Honda", "Suzuki", "Hyundai", "Kia", "MG", "BMW", "Audi"];
      case "bus":
        return ["Yutong", "Hino", "Isuzu", "MAN"];
      case "minibus":
        return ["Yutong", "Hino", "Isuzu", "MAN"];
      case "coaster":
        return ["Toyota Coaster", "Higer Coaster", "Yutong Coaster"];
      default:
        return brands;
    }
  };

  const locationOptions = [
    "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Islamabad",
    "Gujranwala", "Peshawar", "Multan", "Sialkot", "Quetta",
    "Bahawalpur", "Sargodha", "Mardan", "Gujrat", "Sheikhupura"
  ];

  // Filtered options for dropdowns
  const filteredBrandOptions = getBrandOptions().filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));
  const filteredLocationOptions = locationOptions.filter(l => l.toLowerCase().includes(locationSearch.toLowerCase()));

  // Handle dropdown selection
  const handleBrandSelect = (brand: string) => {
    setLocalFilters(prev => ({ ...prev, brand }));
    setShowBrandDropdown(false);
    setBrandSearch("");
  };
  const handleLocationSelect = (location: string) => {
    setLocalFilters(prev => ({ ...prev, location }));
    setShowLocationDropdown(false);
    setLocationSearch("");
  };

  // Handle slider
  const handlePriceSliderChange = (value: number[]) => {
    setLocalFilters(prev => ({ ...prev, priceRange: value }));
  };

  // Handle sort
  const handleSortChange = (sortValue: string) => {
    setLocalFilters(prev => ({ ...prev, sortBy: prev.sortBy === sortValue ? "default" : sortValue }));
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      brands: localFilters.brand ? [localFilters.brand] : [],
      locations: localFilters.location ? [localFilters.location] : [],
      priceRange: { min: localFilters.priceRange[0], max: localFilters.priceRange[1] },
      sortBy: localFilters.sortBy
    });
    setShowMobileFilters(false);
  };

  // Clear all
  const clearFilters = () => {
    setLocalFilters({
      brand: "",
      location: "",
      priceRange: [5000, 150000],
      sortBy: "default"
    });
    onFilterChange({
      brands: [],
      locations: [],
      priceRange: { min: 5000, max: 150000 },
      sortBy: "default"
    });
    setShowMobileFilters(false);
  };

  const Dropdown = ({
    label,
    value,
    options,
    showDropdown,
    setShowDropdown,
    onSelect,
    search,
    setSearch
  }: any) => (
    <div className="relative">
      <button
        type="button"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setShowDropdown((v: boolean) => !v)}
      >
        {value || `Select ${label}`}
      </button>
      {showDropdown && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto animate-fade-in">
          <input
            type="text"
            placeholder={`Search ${label}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-100 focus:outline-none"
          />
          {options.length === 0 && (
            <div className="px-3 py-2 text-gray-400 text-sm">No options</div>
          )}
          {options.slice(0, MAX_VISIBLE_OPTIONS).map((option: string) => (
            <div
              key={option}
              className="px-3 py-2 cursor-pointer hover:bg-primary hover:text-white rounded"
              onClick={() => onSelect(option)}
            >
              {option}
            </div>
          ))}
          {options.length > MAX_VISIBLE_OPTIONS && (
            <div className="px-3 py-2 text-gray-400 text-xs">Scroll for more...</div>
          )}
        </div>
      )}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Filters</h3>
      {/* Sort By */}
      <div>
        <label className="form-label font-medium mb-2 block">Sort By</label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer gap-2 p-1 rounded hover:bg-gray-100">
            <input
              type="radio"
              name="sortBy"
              checked={localFilters.sortBy === "price_low_high"}
              onChange={() => handleSortChange("price_low_high")}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 accent-primary"
            />
            <span className="text-sm">Low to High</span>
          </label>
          <label className="flex items-center cursor-pointer gap-2 p-1 rounded hover:bg-gray-100">
            <input
              type="radio"
              name="sortBy"
              checked={localFilters.sortBy === "price_high_low"}
              onChange={() => handleSortChange("price_high_low")}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 accent-primary"
            />
            <span className="text-sm">High to Low</span>
          </label>
        </div>
      </div>
      {/* Brand Dropdown */}
      <div>
        <label className="form-label font-medium mb-2 block">Brand</label>
        <Dropdown
          label="brand"
          value={localFilters.brand}
          options={filteredBrandOptions}
          showDropdown={showBrandDropdown}
          setShowDropdown={setShowBrandDropdown}
          onSelect={handleBrandSelect}
          search={brandSearch}
          setSearch={setBrandSearch}
        />
      </div>
      {/* Location Dropdown */}
      <div>
        <label className="form-label font-medium mb-2 block">Location</label>
        <Dropdown
          label="location"
          value={localFilters.location}
          options={filteredLocationOptions}
          showDropdown={showLocationDropdown}
          setShowDropdown={setShowLocationDropdown}
          onSelect={handleLocationSelect}
          search={locationSearch}
          setSearch={setLocationSearch}
        />
      </div>
      {/* Price Range Slider */}
      <div>
        <label className="form-label font-medium mb-2 block">Price Range (PKR)</label>
        <div className="space-y-4">
          <div className="px-2">
            <Slider
              value={localFilters.priceRange}
              onValueChange={handlePriceSliderChange}
              max={150000}
              min={5000}
              step={1000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>PKR {localFilters.priceRange[0].toLocaleString()}</span>
            <span>PKR {localFilters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={applyFilters}
          className="w-full px-4 py-2 rounded bg-primary text-white font-semibold shadow hover:bg-primary-dark transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="w-full px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold border border-gray-200 hover:bg-gray-200 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block lg:w-80 flex-shrink-0">
        <div className="sticky top-24 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <FilterContent />
        </div>
      </div>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 flex justify-end">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="px-4 py-2 rounded bg-primary text-white font-semibold shadow hover:bg-primary-dark transition-colors"
        >
          Filters
        </button>
      </div>
      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90vw] max-w-sm mx-auto relative animate-fade-in">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-primary text-2xl font-bold"
              aria-label="Close filters"
            >
              &times;
            </button>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleFilters;
