# 🚗 Swift Ride - Online Vehicle Reservation System

> A modern, full-featured web application for booking cars, buses, minibuses, and coasters online. Designed for both customers and administrators, it offers a seamless, secure, and user-friendly experience for vehicle rental and management.

---

## 📋 Table of Contents
- [✨ Features](#-features)
- [📧 User Email Notifications](#-user-email-notifications)
- [📁 Folder Structure](#-folder-structure)
- [🛠️ Technologies Used](#️-technologies-used)
- [⚙️ Setup & Installation](#️-setup--installation)
- [📖 Usage Guide](#-usage-guide)
- [🔐 Authentication Flow](#-authentication-flow)
- [👨‍💼 Admin Features](#-admin-features)
- [🔗 API & Integrations](#-api--integrations)
- [🎨 Special UI/UX Features](#-special-uiux-features)
- [🤝 Contribution Guidelines](#-contribution-guidelines)
- [❓ FAQ & Support](#-faq--support)
- [📄 License](#-license)

---

## ✨ Features

### 👤 User Features
- **🚗 Browse Vehicles:** Explore a wide range of cars, buses, minibuses, and coasters with detailed information, images, and specifications.
- **🔍 Advanced Filtering:** Filter vehicles by type, brand, location, price range, seating capacity, features, and availability.
- **⏰ Flexible Rental Plans:** Choose from 12-hour, 2-day, 3-day, or 1-week rental plans to suit your needs.
- **👨‍💼 Professional Drivers:** Option to book with or without a professional, vetted driver.
- **💰 Transparent Pricing:** See clear, upfront pricing with no hidden fees. Premium pricing applies for luxury brands.
- **💳 Online Booking & Payment:** Complete your booking and payment securely online in a step-by-step process.
- **📋 Booking Management:** View, manage, and cancel your bookings from your personal dashboard.
- **⚙️ Account Management:** Update your profile, change your password, and manage your account settings.
- **🔑 Password Recovery:** Easily reset your password with email-based OTP verification.
- **💬 24/7 Support:** Access instant help via the built-in chat widget or contact support.
- **📧 Newsletter Subscription:** Subscribe to receive the latest offers and updates.
- **📨 Email Notifications:** Receive important updates and confirmations directly to your email (see below for details).
- **📚 Booking History:** Access your complete booking history for reference and rebooking.
- **📱 Responsive Design:** Enjoy a seamless experience on desktop, tablet, and mobile devices.
- **♿ Accessibility:** Designed with accessibility best practices for all users.

### 👨‍💼 Admin Features
- **📊 Dashboard Overview:** Stats for users, bookings, vehicles, revenue.
- **👥 Manage Users:** Add, search, filter, and manage users.
- **📋 Manage Bookings:** View and manage all bookings.
- **🚗 Manage Vehicles:** Add, edit, filter vehicles by type, status, and location.

---

## 📧 User Email Notifications

Users receive timely email notifications for key actions, including:

| 📧 Email Type | 📝 Description |
|---------------|----------------|
| **🎉 Signup Confirmation** | Welcome email upon successful registration |
| **✅ Booking Confirmation** | Email with booking details after a successful reservation |
| **✅ Booking Cancellation** | Notification when a booking is cancelled |
| **🔑 Forgot Password** | Email with instructions and OTP for password reset |
| **🔐 OTP Verification** | Email containing a one-time password for secure verification |
| **📰 Newsletter Subscription** | Confirmation email upon subscribing to the newsletter |
| **✅ Password Reset Confirmation** | Notification when your password has been successfully reset |
| **📨 Other Transactional Emails** | Any other important updates related to your account or bookings |

---

## 📁 Folder Structure

```
📦 src/
├── 🧩 components/          # Reusable UI and feature components
│   ├── 👨‍💼 Admin/         # Admin dashboard components
│   └── 🎨 ui/              # UI primitives (buttons, dialogs, sidebar, etc.)
├── 🔄 contexts/            # React context for user state
├── 📊 data/                # Static/mock data
├── 🪝 hooks/               # Custom React hooks
├── 📄 pages/               # Main app pages (Home, About, Booking, Admin, etc.)
├── 📝 types/               # TypeScript types/interfaces
└── 🛠️ utils/               # Utility functions (axios, pricing, etc.)
📁 public/                  # Static assets and HTML
```

---

## 🛠️ Technologies Used

| 🏗️ Category | 🛠️ Technology | 📝 Description |
|-------------|----------------|----------------|
| **⚡ Build Tool** | [Vite](https://vitejs.dev/) | Fast build tool and dev server |
| **⚛️ UI Library** | [React](https://react.dev/) | Modern UI library |
| **🔒 Type Safety** | [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| **🎨 UI Components** | [shadcn/ui](https://ui.shadcn.com/) | Beautiful, accessible components |
| **🎯 Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **🛣️ Routing** | [React Router](https://reactrouter.com/) | Client-side routing |
| **📡 Data Fetching** | [React Query](https://tanstack.com/query/latest) | Data fetching and caching |
| **🌐 HTTP Client** | [Axios](https://axios-http.com/) | Promise-based HTTP requests |

---

## ⚙️ Setup & Installation

### 🚀 Quick Start

1. **📥 Clone the repository:**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **📦 Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **⚙️ Configure environment variables:**
   ```bash
   # Copy .env.example to .env and set VITE_API_URL if using a custom backend
   cp .env.example .env
   ```

4. **▶️ Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **🌐 Open in your browser:**
   - Visit [http://localhost:5173](http://localhost:5173) (default)

---

## 📖 Usage Guide

### 🚗 Booking a Vehicle

1. **🔍 Browse** vehicles by type, brand, location, price, and features
2. **✅ Select** a vehicle and rental plan (12-hour, 2-day, 3-day, or 1-week)
3. **📝 Fill in** booking details (pickup/drop, dates, driver option, etc.)
4. **💳 Proceed to payment** via secure modal
5. **📋 Manage bookings** from your dashboard

### 👨‍💼 Admin Dashboard
- Access via `/admin` (admin login required)
- View stats, manage users, bookings, and vehicles

---

## 🔐 Authentication Flow

| 🔄 Step | 📝 Description |
|---------|----------------|
| **📝 Signup** | Register with name, email, password, and CNIC (13 digits). Receive a confirmation email |
| **🔑 Login** | Email and password; JWT stored in localStorage |
| **🔑 Forgot Password** | Request reset, receive OTP via email |
| **🔐 OTP Verification** | Enter OTP to verify |
| **✅ Reset Password** | Set a new password after OTP verification. Receive confirmation email |

---

## 👨‍💼 Admin Features

- **📊 Dashboard Overview:** Stats for users, bookings, vehicles, revenue
- **👥 Manage Users:** Add, search, filter, and manage users
- **📋 Manage Bookings:** View and manage all bookings
- **🚗 Manage Vehicles:** Add, edit, filter vehicles by type, status, and location

---

## 🔗 API & Integrations

- **🌐 Backend API:** All data (auth, bookings, vehicles, users) via REST API (`VITE_API_URL`, default: https://swift-ride-server.vercel.app/api)
- **📡 Axios:** HTTP requests with JWT token management and error handling
- **📰 Newsletter:** Subscribe via footer (API endpoint)

---

## 🎨 Special UI/UX Features

- **💬 Chat Widget:** Built-in support chat with automated responses for common queries
- **🔔 Notifications:** Toast notifications for actions (success, error, info)
- **📱 Responsive Design:** Mobile-friendly, fully responsive UI
- **📋 Sidebar Navigation:** For user and admin dashboards
- **♿ Accessibility:** Semantic HTML and ARIA labels

---

## 🤝 Contribution Guidelines

1. **🍴 Fork** the repository and create your branch from `main`
2. **📦 Install** dependencies and make your changes
3. **✅ Ensure** code is linted and tested
4. **📤 Submit** a pull request with a clear description

---

## ❓ FAQ & Support

| ❓ Question | 💡 Answer |
|-------------|-----------|
| **🐛 How do I report a bug or request a feature?** | Open an issue or contact the project maintainers |
| **🌐 How do I connect a custom domain?** | Go to Project > Settings > Domains in Lovable and follow the instructions |
| **📞 Who do I contact for support?** | Use the chat widget or email contactswiftride@gmail.com |

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ by the Swift Ride Team**

[![GitHub stars](https://img.shields.io/github/stars/your-repo/swift-ride?style=social)](https://github.com/your-repo/swift-ride)
[![GitHub forks](https://img.shields.io/github/forks/your-repo/swift-ride?style=social)](https://github.com/your-repo/swift-ride)
[![GitHub issues](https://img.shields.io/github/issues/your-repo/swift-ride)](https://github.com/your-repo/swift-ride/issues)

</div>
