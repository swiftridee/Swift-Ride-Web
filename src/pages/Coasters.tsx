import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import VehicleFilters from "@/components/VehicleFilters";
import { Pagination } from "@/components/ui/pagination";
import { VehicleType } from "@/types";
import { useVehicles } from "@/hooks/useVehicles";

const Coasters = () => {
  const {
    vehicles: allVehicles,
    loading,
    pagination,
    setPage,
  } = useVehicles({
    vehicleType: "Coaster",
    limit: 5,
  });
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleType[]>([]);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  // Extract unique brands and locations
  const brands = [...new Set(allVehicles.map((coaster) => coaster.brand))];
  const locations = [
    ...new Set(allVehicles.map((coaster) => coaster.location)),
  ];

  // Apply filters with new checkbox-based logic
  const handleFilterChange = (filters: any) => {
    let filtered = [...allVehicles];

    // Apply brand filter (multiple selections)
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((coaster) =>
        filters.brands.some((brand: string) =>
          coaster.brand.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Apply location filter (multiple selections)
    if (filters.locations && filters.locations.length > 0) {
      filtered = filtered.filter((coaster) =>
        filters.locations.some((location: string) =>
          coaster.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    // Apply seating capacity filter
    if (filters.seatingCapacity && filters.seatingCapacity.length > 0) {
      filtered = filtered.filter((coaster) =>
        filters.seatingCapacity.includes(coaster.seatingCapacity)
      );
    }

    // Apply features filter
    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter((coaster) =>
        filters.features.some((feature: string) =>
          coaster.features?.some((coasterFeature: string) =>
            coasterFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    // Apply availability filter
    if (filters.availability === "available") {
      filtered = filtered.filter((coaster) => coaster.availability === true);
    }

    // Apply price filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (coaster) =>
          coaster.pricePerDay >= filters.priceRange.min &&
          coaster.pricePerDay <= filters.priceRange.max
      );
    }

    // Apply sorting
    if (filters.sortBy === "price_low_high") {
      filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (filters.sortBy === "price_high_low") {
      filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
    }

    setFilteredVehicles(filtered);
    setHasAppliedFilters(true);
  };

  // Initialize filtered vehicles when allVehicles changes
  useEffect(() => {
    setFilteredVehicles(allVehicles);
    setHasAppliedFilters(false);
  }, [allVehicles]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Determine which vehicles to display
  const displayVehicles = hasAppliedFilters ? filteredVehicles : allVehicles;

  return (
    <>
      <Helmet>
        <title>
          Coaster Rental Services - Swift Ride | Medium to Large Group
          Transportation
        </title>
        <meta
          name="description"
          content="Rent coasters from Swift Ride for medium to large groups and tours. Spacious and comfortable transportation for extended journeys."
        />
        <meta
          name="keywords"
          content="coaster rental, medium group transportation, large group travel, tour transportation, Swift Ride"
        />
      </Helmet>

      <Navbar />

      <main className="pt-20 pb-16 bg-gray-50 min-h-screen w-full">
        <div className="content-container mx-auto animate-fade-in">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">Coasters for Rent</h1>
            <p className="text-gray-600 mb-6">
              Our coasters are perfect for medium to large groups and tours.
              Spacious and comfortable for extended journeys.
            </p>

            <div className="lg:flex gap-6">
              {/* Filters */}
              <VehicleFilters
                vehicleType="coaster"
                brands={brands}
                locations={locations}
                onFilterChange={handleFilterChange}
              />

              {/* Results */}
              <div className="w-full">
                {loading ? (
                  <div className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Loading coasters...</p>
                  </div>
                ) : !loading && displayVehicles.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-3xl text-gray-400 mb-4">
                      <i className="fas fa-search"></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No coasters found
                    </h3>
                    <p className="text-gray-600">
                      {hasAppliedFilters
                        ? "Try adjusting your filters to find available coasters."
                        : "No coasters are currently available."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {displayVehicles.map((coaster) => (
                        <VehicleCard key={coaster._id} vehicle={coaster} />
                      ))}
                    </div>

                    {/* Pagination - Only show when not filtering */}
                    {!hasAppliedFilters && pagination.totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination
                          currentPage={pagination.currentPage}
                          totalPages={pagination.totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Coasters;
