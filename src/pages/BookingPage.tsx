import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import { VehicleType, RentalPlan } from "@/types";
import { calculatePrice } from "@/utils/pricing";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import axios from "@/utils/axios";
import { majorCities, timeOptions } from "@/data/locationData";

// Helper function to map backend vehicle type to frontend type
const mapVehicleType = (
  backendType: string
): "car" | "bus" | "minibus" | "coaster" => {
  const typeMap: Record<string, "car" | "bus" | "minibus" | "coaster"> = {
    Car: "car",
    Bus: "bus",
    "Mini Bus": "minibus",
    Coaster: "coaster",
  };
  return typeMap[backendType] || "car";
};

// Helper function to convert 12-hour time to 24-hour format
const convertTo24Hour = (time12h: string) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, "0")}:${minutes}`;
};

// Helper function to format yyyy-mm-dd to MM/DD/YYYY
const formatDateMMDDYYYY = (dateStr: string) => {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-");
  if (!yyyy || !mm || !dd) return dateStr;
  return `${mm}/${dd}/${yyyy}`;
};

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [vehicle, setVehicle] = useState<VehicleType | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!user) {
      toast.error("Please login to make a booking");
      navigate("/login", { state: { from: `/booking/${id}` } });
      return;
    }
  }, [user, id, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    rentalPlan: searchParams.get("plan") || "12hour",
    withDriver: searchParams.get("driver") === "true",
    notes: "",
  });

  // Auto-calculate return date/time based on rental plan and pickup
  useEffect(() => {
    if (!formData.pickupDate || !formData.pickupTime) return;
    const pickupDateTime = new Date(`${formData.pickupDate}T${convertTo24Hour(formData.pickupTime)}:00`);
    let returnDateTime = new Date(pickupDateTime);
    switch (formData.rentalPlan) {
      case "12hour":
        returnDateTime.setHours(returnDateTime.getHours() + 12);
        break;
      case "2day":
        returnDateTime.setDate(returnDateTime.getDate() + 2);
        break;
      case "3day":
        returnDateTime.setDate(returnDateTime.getDate() + 3);
        break;
      case "1week":
        returnDateTime.setDate(returnDateTime.getDate() + 7);
        break;
      default:
        break;
    }
    // Format date as yyyy-mm-dd
    const yyyy = returnDateTime.getFullYear();
    const mm = String(returnDateTime.getMonth() + 1).padStart(2, '0');
    const dd = String(returnDateTime.getDate()).padStart(2, '0');
    const returnDate = `${yyyy}-${mm}-${dd}`;
    // Format time as hh:mm AM/PM
    let hours = returnDateTime.getHours();
    const minutes = String(returnDateTime.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const returnTime = `${hours}:${minutes} ${ampm}`;
    setFormData((prev) => ({ ...prev, returnDate, returnTime }));
  }, [formData.pickupDate, formData.pickupTime, formData.rentalPlan]);

  // Shared Ride State
  const [enableSharedRide, setEnableSharedRide] = useState(false);
  const [sharedRiderInfo, setSharedRiderInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Find the vehicle data
  useEffect(() => {
    if (!id) {
      toast.error("No vehicle ID provided");
      navigate("/");
      return;
    }

    const fetchVehicle = async () => {
      setLoading(true);
      try {
        console.log("Fetching vehicle with ID:", id);
        const response = await axios.get(`/vehicles/${id}`);
        console.log("API Response:", response.data);

        if (response.data.success) {
          // Map the backend data to frontend VehicleType
          const backendVehicle = response.data.data;
          const mappedVehicle: VehicleType = {
            _id: backendVehicle._id || backendVehicle.id, // Handle both _id and id
            name: backendVehicle.name,
            brand: backendVehicle.brand,
            model: backendVehicle.model || backendVehicle.name,
            type: backendVehicle.vehicleType as
              | "Car"
              | "Bus"
              | "Mini Bus"
              | "Coaster",
            location: backendVehicle.location,
            pricePerDay: backendVehicle.rentalPlan.basePrice * 2,
            pricePerHour: backendVehicle.rentalPlan.basePrice / 12,
            seatingCapacity: backendVehicle.seats,
            transmission: backendVehicle.transmission || "Manual",
            fuelType: backendVehicle.fuelType || "Petrol",
            features: backendVehicle.features || [],
            images: backendVehicle.image ? [backendVehicle.image] : [],
            availability: backendVehicle.status === "Available",
          };
          console.log("Mapped vehicle:", mappedVehicle);
          setVehicle(mappedVehicle);
        } else {
          console.error("API returned success: false");
          toast.error("Failed to load vehicle details");
          navigate("/");
        }
      } catch (error: any) {
        console.error("Error loading vehicle:", error);
        const errorMessage =
          error.response?.data?.error ||
          "Error loading vehicle details. Please try again.";
        console.error("Error message:", errorMessage);
        toast.error(errorMessage);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, navigate]);

  // Calculate price based on selected options
  const calculateTotalPrice = () => {
    if (!vehicle) return 0;
    return calculatePrice(
      vehicle.type.toLowerCase() as "car" | "bus" | "minibus" | "coaster",
      formData.rentalPlan as RentalPlan,
      formData.withDriver
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDriverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      withDriver: e.target.value === "with",
    }));
  };

  const handleSharedRiderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSharedRiderInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSharedRideToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableSharedRide(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.pickupLocation ||
      !formData.dropLocation ||
      !formData.pickupDate ||
      !formData.pickupTime ||
      !formData.returnDate ||
      !formData.returnTime
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate shared rider info if shared ride is enabled
    if (enableSharedRide && (!sharedRiderInfo.name || !sharedRiderInfo.phone)) {
      toast.error("Please fill in all shared rider information");
      return;
    }

    // Phone number validation
    if (!/^03\d{2}-\d{7}$/.test(formData.phone)) {
      toast.error("Phone number must be in the format 0342-6988007");
      return;
    }

    if (!vehicle?._id) {
      toast.error("Vehicle information is missing");
      return;
    }

    // Show payment modal instead of directly creating booking
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentInfo: any) => {
    setIsSubmitting(true);

    try {
      // Convert times to 24-hour format
      const pickupTime24 = convertTo24Hour(formData.pickupTime);
      const returnTime24 = convertTo24Hour(formData.returnTime);

      // Combine date and time for start and end dates
      const startDate = new Date(`${formData.pickupDate}T${pickupTime24}:00`);
      const endDate = new Date(`${formData.returnDate}T${returnTime24}:00`);

      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date or time selected");
      }

      const bookingData = {
        vehicleId: vehicle?._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        includeDriver: formData.withDriver,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        notes: formData.notes,
        paymentInfo: {
          paymentMethod: paymentInfo.paymentMethod,
          cardName: paymentInfo.cardName,
          maskedCardNumber: paymentInfo.maskedCardNumber,
          expiryDate: paymentInfo.expiryDate,
          saveCard: paymentInfo.saveCard,
          paymentDate: paymentInfo.paymentDate,
          paymentStatus: paymentInfo.paymentStatus,
          payment: calculateTotalPrice(),
          // Note: Full card number and CVV are not stored for security
        },
        sharedRide: enableSharedRide
          ? {
              enabled: true,
              riderInfo: sharedRiderInfo,
            }
          : undefined,
      };
      const response = await axios.post("/bookings", bookingData);

      if (response.data.success) {
        toast.success("Booking created successfully!");
        navigate(`/dashboard/bookings/${response.data.data._id}`);
      } else {
        toast.error(response.data.error || "Failed to create booking");
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to create booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if vehicle type supports shared rides
  const isSharedRideSupported = vehicle?.type
    ? ["Car", "Mini Bus", "Coaster"].includes(vehicle.type)
    : false;

  // Calculate price per rider
  const getPricePerRider = () => {
    const totalPrice = calculateTotalPrice();
    return enableSharedRide ? totalPrice / 2 : totalPrice;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              Loading vehicle details...
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vehicle Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The vehicle you're looking for could not be found.
              </p>
              <button onClick={() => navigate("/")} className="btn-primary">
                Return to Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Book {vehicle.brand} {vehicle.name} - Swift Ride | Secure Vehicle
          Rental
        </title>
        <meta
          name="description"
          content={`Book the ${vehicle.brand} ${vehicle.name} for your trip. Choose your rental plan, driver option, and complete your secure booking with Swift Ride.`}
        />
        <meta
          name="keywords"
          content={`${vehicle.brand} ${vehicle.name} rental, vehicle booking, Swift Ride booking, ${vehicle.type} rental`}
        />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm mb-6">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-primary"
              >
                <i className="fas fa-arrow-left mr-2"></i> Back
              </button>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">Booking</span>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative h-64 md:h-80">
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h1 className="text-3xl font-bold text-white">
                    {vehicle.brand} {vehicle.name}
                  </h1>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                    <span>{vehicle.location}</span>
                  </div>

                  <div className="flex items-center">
                    <i className="fas fa-users text-primary mr-2"></i>
                    <span>{vehicle.seatingCapacity} Seats</span>
                  </div>

                  <div className="flex items-center">
                    <i className="fas fa-tag text-primary mr-2"></i>
                    <span>
                      {vehicle.type.charAt(0).toUpperCase() +
                        vehicle.type.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing Options */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Rental Options</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Rental Plan
                      </label>
                      <div className="relative">
                        <select
                          name="rentalPlan"
                          value={formData.rentalPlan}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="12hour">12 Hour</option>
                          <option value="2day">2 Day</option>
                          <option value="3day">3 Day</option>
                          <option value="1week">1 Week</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Driver Option
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="driverOption"
                            value="with"
                            checked={formData.withDriver}
                            onChange={handleDriverChange}
                            className="text-primary focus:ring-primary"
                          />
                          <span>With Driver</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="driverOption"
                            value="without"
                            checked={!formData.withDriver}
                            onChange={handleDriverChange}
                            className="text-primary focus:ring-primary"
                          />
                          <span>Without Driver</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Price Breakdown
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>
                        Base Price (
                        {formData.rentalPlan === "12hour"
                          ? "12 Hours"
                          : formData.rentalPlan === "2day"
                          ? "2 Days"
                          : "3 Days"}
                        )
                      </span>
                      <span>
                        PKR{" "}
                        {calculatePrice(
                          vehicle.type.toLowerCase() as
                            | "car"
                            | "bus"
                            | "minibus"
                            | "coaster",
                          formData.rentalPlan as RentalPlan,
                          false
                        ).toLocaleString()}
                      </span>
                    </div>

                    {formData.withDriver && (
                      <div className="flex justify-between">
                        <span>Driver Fee</span>
                        <span>
                          + PKR{" "}
                          {(
                            calculateTotalPrice() -
                            calculatePrice(
                              vehicle.type.toLowerCase() as
                                | "car"
                                | "bus"
                                | "minibus"
                                | "coaster",
                              formData.rentalPlan as RentalPlan,
                              false
                            )
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-gray-300 pt-3 flex justify-between font-bold">
                      <span>
                        {enableSharedRide ? "Total (for both riders)" : "Total"}
                      </span>
                      <span className="text-primary text-xl">
                        PKR {calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>

                    {enableSharedRide && (
                      <div className="bg-blue-50 p-3 rounded border border-blue-100">
                        <div className="flex justify-between text-blue-800 font-medium">
                          <span>Your share (50%):</span>
                          <span>PKR {getPricePerRider().toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          The total cost will be split equally between both
                          riders
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Complete Your Booking</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Personal Information */}
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, "");
                        if (value.length > 4)
                          value = value.slice(0, 4) + "-" + value.slice(4, 11);
                        else value = value.slice(0, 4);
                        setFormData((prev) => ({ ...prev, phone: value }));
                      }}
                      inputMode="numeric"
                      pattern="03[0-9]{2}-[0-9]{7}"
                      maxLength={12}
                      minLength={12}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>

                  {/* Shared Ride Option - Only for supported vehicles */}
                  {isSharedRideSupported && (
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Ride Sharing
                      </label>
                      <div className="flex items-center space-x-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enableSharedRide}
                            onChange={handleSharedRideToggle}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-200 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            Enable Ride Share
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Location Information */}
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="pickupLocation"
                    >
                      Pickup Location
                    </label>
                    <select
                      id="pickupLocation"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Pickup Location</option>
                      {majorCities.map((city) => (
                        <option key={`pickup-${city}`} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="dropLocation"
                    >
                      Drop-off Location
                    </label>
                    <select
                      id="dropLocation"
                      name="dropLocation"
                      value={formData.dropLocation}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Drop-off Location</option>
                      {majorCities.map((city) => (
                        <option key={`dropoff-${city}`} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date and Time - Change to dropdown for time */}
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="pickupDate"
                    >
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      id="pickupDate"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="pickupTime"
                    >
                      Pickup Time
                    </label>
                    <select
                      id="pickupTime"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Pickup Time</option>
                      {timeOptions.map((time) => (
                        <option key={`pickup-time-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Return Date and Time (read-only) */}
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="returnDate"
                    >
                      Return Date
                    </label>
                    <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      min={
                        formData.pickupDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      required
                      disabled
                    />
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="returnTime"
                    >
                      Return Time
                    </label>
                    <select
                      id="returnTime"
                      name="returnTime"
                      value={formData.returnTime}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      disabled
                    >
                      <option value="">Select Return Time</option>
                      {timeOptions.map((time) => (
                        <option key={`return-time-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Shared Rider Fields - Show when shared ride is enabled */}
                {enableSharedRide && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-3">
                      Co-rider Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="coRiderName"
                        >
                          Co-rider Name
                        </label>
                        <input
                          type="text"
                          id="coRiderName"
                          name="name"
                          value={sharedRiderInfo.name}
                          onChange={handleSharedRiderChange}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="coRiderPhone"
                        >
                          Co-rider Phone
                        </label>
                        <input
                          type="tel"
                          id="coRiderPhone"
                          name="phone"
                          value={sharedRiderInfo.phone}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9]/g, "");
                            if (value.length > 4)
                              value =
                                value.slice(0, 4) + "-" + value.slice(4, 11);
                            else value = value.slice(0, 4);
                            setSharedRiderInfo((prev) => ({
                              ...prev,
                              phone: value,
                            }));
                          }}
                          inputMode="numeric"
                          pattern="03[0-9]{2}-[0-9]{7}"
                          maxLength={12}
                          minLength={12}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                          placeholder="03XX-XXXXXXX"
                        />
                      </div>
                      <div className="md:col-span-2 mb-4">
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="coRiderEmail"
                        >
                          Co-rider Email (Optional)
                        </label>
                        <input
                          type="email"
                          id="coRiderEmail"
                          name="email"
                          value={sharedRiderInfo.email}
                          onChange={handleSharedRiderChange}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-sm text-blue-600 mt-2">
                          The total cost will be split equally (50%) between
                          both riders. Both will receive booking confirmation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="notes">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full md:w-auto md:px-12 py-3 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm & Proceed to Payment
                        <i className="fas fa-arrow-right ml-2"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={handlePaymentComplete}
        totalAmount={calculateTotalPrice()}
        bookingDetails={{
          vehicleName: `${vehicle?.brand} ${vehicle?.name}`,
          pickupDate: formData.pickupDate,
          returnDate: formData.returnDate,
          pickupLocation: formData.pickupLocation,
          dropLocation: formData.dropLocation,
        }}
      />

      <Footer />
    </>
  );
};

export default BookingPage;
