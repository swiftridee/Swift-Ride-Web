import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import VehicleFilters from "@/components/VehicleFilters";
import { Pagination } from "@/components/ui/pagination";
import { VehicleType } from "@/types";
import { useVehicles } from "@/hooks/useVehicles";

const Cars = () => {
  const {
    vehicles: allVehicles,
    loading,
    pagination,
    setPage,
  } = useVehicles({
    vehicleType: "Car",
    limit: 5,
  });
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleType[]>([]);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  // Extract unique brands and locations
  const brands = [...new Set(allVehicles.map((car) => car.brand))];
  const locations = [...new Set(allVehicles.map((car) => car.location))];

  // Apply filters with new checkbox-based logic
  const handleFilterChange = (filters: any) => {
    let filtered = [...allVehicles];

    // Apply brand filter (multiple selections)
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((car) =>
        filters.brands.some((brand: string) =>
          car.brand.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Apply location filter (multiple selections)
    if (filters.locations && filters.locations.length > 0) {
      filtered = filtered.filter((car) =>
        filters.locations.some((location: string) =>
          car.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    // Apply seating capacity filter
    if (filters.seatingCapacity && filters.seatingCapacity.length > 0) {
      filtered = filtered.filter((car) =>
        filters.seatingCapacity.includes(car.seatingCapacity)
      );
    }

    // Apply features filter
    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter((car) =>
        filters.features.some((feature: string) =>
          car.features?.some((carFeature: string) =>
            carFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    // Apply availability filter
    if (filters.availability === "available") {
      filtered = filtered.filter((car) => car.availability === true);
    }

    // Apply price filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (car) =>
          car.pricePerDay >= filters.priceRange.min &&
          car.pricePerDay <= filters.priceRange.max
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
        <title>Car Rental Services - Swift Ride | Quality Cars for Hire</title>
        <meta
          name="description"
          content="Rent quality cars from Swift Ride for personal travel, family trips, and business use. Choose from top brands with flexible rental plans and competitive rates."
        />
        <meta
          name="keywords"
          content="car rental, car hire, vehicle rental, personal car, business car, family car, Swift Ride"
        />
      </Helmet>

      <Navbar />

      <main className="pt-20 pb-16 bg-gray-50 min-h-screen w-full">
        <div className="content-container mx-auto animate-fade-in">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">Cars for Rent</h1>
            <p className="text-gray-600 mb-6">
              Our cars are perfect for personal travel, family trips, and
              business use. Choose from top brands for a comfortable and
              luxurious journey.
            </p>

            <div className="lg:flex gap-6">
              {/* Filters */}
              <VehicleFilters
                vehicleType="car"
                brands={brands}
                locations={locations}
                onFilterChange={handleFilterChange}
              />

              {/* Results */}
              <div className="w-full">
                {loading ? (
                  <div className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Loading cars...</p>
                  </div>
                ) : !loading && displayVehicles.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-3xl text-gray-400 mb-4">
                      <i className="fas fa-search"></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No cars found
                    </h3>
                    <p className="text-gray-600">
                      {hasAppliedFilters
                        ? "Try adjusting your filters to find available cars."
                        : "No cars are currently available."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {displayVehicles.map((car) => (
                        <VehicleCard key={car._id} vehicle={car} />
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

export default Cars;
