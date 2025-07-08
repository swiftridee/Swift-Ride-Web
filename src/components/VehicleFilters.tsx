import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface VehicleFiltersProps {
  vehicleType: string;
  brands: string[];
  locations: string[];
  onFilterChange: (filters: any) => void;
}

const MAX_VISIBLE_OPTIONS = 5;

const VehicleFilters = ({
  vehicleType,
  brands,
  locations,
  onFilterChange,
}: VehicleFiltersProps) => {
  // Local state for filter fields
  const [localFilters, setLocalFilters] = useState({
    brand: "",
    location: "",
    priceRange: [0, 50000],
    sortBy: "default",
    seatingCapacity: [] as number[],
    features: [] as string[],
    availability: "all",
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
        return [
          "Toyota",
          "Honda",
          "Suzuki",
          "Hyundai",
          "Kia",
          "MG",
          "BMW",
          "Audi",
          "Mercedes",
          "Volkswagen",
          "Ford",
          "Nissan",
        ];
      case "bus":
        return ["Yutong", "Hino", "Isuzu", "MAN", "Volvo", "Scania"];
      case "minibus":
        return ["Yutong", "Hino", "Isuzu", "MAN", "Toyota", "Ford"];
      case "coaster":
        return [
          "Toyota Coaster",
          "Higer Coaster",
          "Yutong Coaster",
          "Isuzu Coaster",
        ];
      default:
        return brands;
    }
  };

  // Seating capacity options based on vehicle type
  const getSeatingCapacityOptions = () => {
    switch (vehicleType) {
      case "car":
        return [2, 4, 5, 6, 7, 8];
      case "bus":
        return [20, 25, 30, 35, 40, 45, 50];
      case "minibus":
        return [12, 14, 16, 18, 20, 22];
      case "coaster":
        return [15, 18, 20, 22, 25, 30];
      default:
        return [2, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50];
    }
  };

  // Feature options
  const featureOptions = [
    "Air Conditioning",
    "GPS Navigation",
    "Bluetooth",
    "USB Charging",
    "Leather Seats",
    "Sunroof",
    "Backup Camera",
    "Cruise Control",
    "Power Windows",
    "Power Steering",
    "ABS",
    "Airbags",
    "Child Seat",
    "Wheelchair Accessible",
  ];

  const locationOptions = [
    "Karachi",
    "Lahore",
    "Faisalabad",
    "Rawalpindi",
    "Islamabad",
    "Gujranwala",
    "Peshawar",
    "Multan",
    "Sialkot",
    "Quetta",
    "Bahawalpur",
    "Sargodha",
    "Mardan",
    "Gujrat",
    "Sheikhupura",
  ];

  // Filtered options for dropdowns
  const filteredBrandOptions = getBrandOptions().filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );
  const filteredLocationOptions = locationOptions.filter((l) =>
    l.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Handle dropdown selection
  const handleBrandSelect = (brand: string) => {
    setLocalFilters((prev) => ({ ...prev, brand }));
    setShowBrandDropdown(false);
    setBrandSearch("");
  };
  const handleLocationSelect = (location: string) => {
    setLocalFilters((prev) => ({ ...prev, location }));
    setShowLocationDropdown(false);
    setLocationSearch("");
  };

  // Handle slider
  const handlePriceSliderChange = (value: number[]) => {
    setLocalFilters((prev) => ({ ...prev, priceRange: value }));
  };

  // Handle sort
  const handleSortChange = (sortValue: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy: prev.sortBy === sortValue ? "default" : sortValue,
    }));
  };

  // Handle checkbox filters
  const handleSeatingCapacityChange = (capacity: number, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      seatingCapacity: checked
        ? [...prev.seatingCapacity, capacity]
        : prev.seatingCapacity.filter((c) => c !== capacity),
    }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      features: checked
        ? [...prev.features, feature]
        : prev.features.filter((f) => f !== feature),
    }));
  };

  const handleAvailabilityChange = (availability: string) => {
    setLocalFilters((prev) => ({ ...prev, availability }));
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      brands: localFilters.brand ? [localFilters.brand] : [],
      locations: localFilters.location ? [localFilters.location] : [],
      priceRange: {
        min: localFilters.priceRange[0],
        max: localFilters.priceRange[1],
      },
      sortBy: localFilters.sortBy,
      seatingCapacity: localFilters.seatingCapacity,
      features: localFilters.features,
      availability: localFilters.availability,
    });
    setShowMobileFilters(false);
  };

  // Clear all
  const clearFilters = () => {
    setLocalFilters({
      brand: "",
      location: "",
      priceRange: [0, 50000],
      sortBy: "default",
      seatingCapacity: [],
      features: [],
      availability: "all",
    });
    onFilterChange({
      brands: [],
      locations: [],
      priceRange: { min: 0, max: 50000 },
      sortBy: "default",
      seatingCapacity: [],
      features: [],
      availability: "all",
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
    setSearch,
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
            onChange={(e) => setSearch(e.target.value)}
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
            <div className="px-3 py-2 text-gray-400 text-xs">
              Scroll for more...
            </div>
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

      {/* Seating Capacity */}
      <div>
        <label className="form-label font-medium mb-2 block">
          Seating Capacity
        </label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {getSeatingCapacityOptions().map((capacity) => (
            <label
              key={capacity}
              className="flex items-center cursor-pointer gap-2"
            >
              <Checkbox
                checked={localFilters.seatingCapacity.includes(capacity)}
                onCheckedChange={(checked) =>
                  handleSeatingCapacityChange(capacity, checked as boolean)
                }
              />
              <span className="text-sm">{capacity} Seats</span>
            </label>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="form-label font-medium mb-2 block">Features</label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {featureOptions.map((feature) => (
            <label
              key={feature}
              className="flex items-center cursor-pointer gap-2"
            >
              <Checkbox
                checked={localFilters.features.includes(feature)}
                onCheckedChange={(checked) =>
                  handleFeatureChange(feature, checked as boolean)
                }
              />
              <span className="text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="form-label font-medium mb-2 block">
          Availability
        </label>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer gap-2">
            <input
              type="radio"
              name="availability"
              checked={localFilters.availability === "all"}
              onChange={() => handleAvailabilityChange("all")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="text-sm">All Vehicles</span>
          </label>
          <label className="flex items-center cursor-pointer gap-2">
            <input
              type="radio"
              name="availability"
              checked={localFilters.availability === "available"}
              onChange={() => handleAvailabilityChange("available")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="text-sm">Available Only</span>
          </label>
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <label className="form-label font-medium mb-2 block">
          Price Range (PKR)
        </label>
        <div className="space-y-4">
          <div className="px-2 py-2 bg-gray-50 rounded-lg">
            <Slider
              value={localFilters.priceRange}
              onValueChange={handlePriceSliderChange}
              max={50000}
              min={0}
              step={1000}
              className="w-full"
              onValueCommit={(value) => {
                console.log("Price slider committed:", value);
                setLocalFilters((prev) => ({ ...prev, priceRange: value }));
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 font-medium">
            <span className="bg-primary/10 px-2 py-1 rounded">
              PKR {localFilters.priceRange[0].toLocaleString()}
            </span>
            <span className="bg-primary/10 px-2 py-1 rounded">
              PKR {localFilters.priceRange[1].toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Drag handles to adjust price range
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
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90vw] max-w-sm mx-auto relative animate-fade-in max-h-[90vh] overflow-y-auto">
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
