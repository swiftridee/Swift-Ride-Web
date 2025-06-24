# Swift-Ride-Web

## Overview

Swift-Ride-Web is the main user-facing web application for the Swift Ride platform. It allows users to browse, book, and manage rides, view vehicle options, manage their profiles, and interact with the platform's services in a modern, responsive interface.

---

## Tech Stack

- **Frontend Framework:** React 18 (with TypeScript)
- **Build Tool:** Vite
- **UI Library:** shadcn-ui (built on top of Radix UI)
- **Styling:** Tailwind CSS, PostCSS, CSS Modules
- **State Management:** React Context, React Query (TanStack Query)
- **Form Handling:** React Hook Form, Zod (validation)
- **Charts & Analytics:** Recharts
- **Routing:** React Router DOM v6
- **Other Libraries:**  
  - Axios (API requests)
  - Lucide React (icons)
  - Embla Carousel (carousels)
  - Date-fns (date utilities)
  - Sonner (notifications/toasts)
  - Radix UI Primitives (dialogs, popovers, etc.)
  - uuid (unique IDs)
  - react-helmet (SEO management)

---

## Features & Pages

### Public Pages

- **Home (`/`):**  
  Landing page with platform introduction, features, and call-to-action.

- **About (`/about`):**  
  Information about Swift Ride, mission, and team.

- **Contact (`/contact`):**  
  Contact form for user inquiries and support.

- **Login (`/login`):**  
  User authentication with form validation and error handling.

- **Signup (`/signup`):**  
  New user registration with validation.

- **Forgot Password (`/forgot-password`):**  
  Password reset workflow for users.

- **Privacy Policy (`/privacy`):**  
  Details on user data privacy and platform policies.

- **Terms & Conditions (`/terms`):**  
  Platform usage terms and legal information.

### User Pages

- **Profile (`/profile`):**  
  View and edit user profile, manage personal information, and view booking history.

- **Settings (`/settings`):**  
  Manage account settings, preferences, and notifications.

- **Booking Page (`/booking`):**  
  Book a ride, select vehicle type, pickup/drop-off, and see pricing.

- **Booking Details (`/booking/:id`):**  
  View details of a specific booking, including status, vehicle, and driver info.

### Vehicle Pages

- **Cars (`/cars`), Buses (`/buses`), MiniBuses (`/minibuses`), Coasters (`/coasters`):**  
  Browse available vehicles by type, view details, and select for booking.

### Admin Pages

- **Admin Dashboard (`/admin/dashboard`):**  
  (If enabled) Admin interface for managing platform data and viewing statistics.

### Other

- **Not Found (`*`):**  
  Custom 404 page for undefined routes.

---

## UI Components

- **Reusable UI:**  
  Cards, tables, dialogs, popovers, tooltips, accordions, tabs, carousels, toasts, and more.
- **Responsive Design:**  
  Fully responsive for desktop, tablet, and mobile.
- **Dark Mode:**  
  Supported via Tailwind and shadcn-ui.

---

## Getting Started

```sh
# Clone the repository
git clone https://github.com/swiftridee/Swift-Ride-Web.git
cd Swift-Ride-Web

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## Folder Structure

```
src/
  components/    # Reusable UI components
  contexts/      # React context providers
  data/          # Static data and mock data
  hooks/         # Custom React hooks
  lib/           # Utility functions
  pages/         # Page components (public, user, admin)
  types/         # TypeScript types
  utils/         # API utilities (e.g., axios)
  index.css      # Tailwind and global styles
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License.
