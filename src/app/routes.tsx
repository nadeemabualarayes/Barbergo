import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { Appointments } from "./components/Appointments";
import { Barbers } from "./components/Barbers";
import { Services } from "./components/Services";
import { Customers } from "./components/Customers";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { Login } from "./components/Login";
import { NotFound } from "./components/NotFound";
import { Landing } from "./components/Landing";

// Customer Portal
import { CustomerLogin } from "./components/customer/CustomerLogin";
import { CustomerSignup } from "./components/customer/CustomerSignup";
import { CustomerRoot } from "./components/customer/CustomerRoot";
import { CustomerHome } from "./components/customer/CustomerHome";
import { SelectServicesPage } from "./components/customer/SelectServicesPage";
import { SelectBarberPage } from "./components/customer/SelectBarberPage";
import { SelectTimePage } from "./components/customer/SelectTimePage";
import { BookingConfirmation } from "./components/customer/BookingConfirmation";

// Barber Portal
import { BarberLogin } from "./components/barber/BarberLogin";
import { BarberRoot } from "./components/barber/BarberRoot";
import { BarberDashboard } from "./components/barber/BarberDashboard";

export const router = createBrowserRouter([
  // Landing Page
  {
    path: "/",
    Component: Landing,
  },
  
  // Admin Portal
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/admin",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "appointments", Component: Appointments },
      { path: "barbers", Component: Barbers },
      { path: "services", Component: Services },
      { path: "customers", Component: Customers },
      { path: "analytics", Component: Analytics },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
  
  // Customer Portal
  {
    path: "/customer/login",
    Component: CustomerLogin,
  },
  {
    path: "/customer/signup",
    Component: CustomerSignup,
  },
  {
    path: "/customer",
    Component: CustomerRoot,
    children: [
      { path: "home", Component: CustomerHome },
      { path: "book", Component: SelectServicesPage },
      { path: "book/select-barber", Component: SelectBarberPage },
      { path: "book/select-time", Component: SelectTimePage },
      { path: "book/confirm", Component: BookingConfirmation },
      { path: "*", Component: NotFound },
    ],
  },
  
  // Barber Portal
  {
    path: "/barber/login",
    Component: BarberLogin,
  },
  {
    path: "/barber",
    Component: BarberRoot,
    children: [
      { path: "dashboard", Component: BarberDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);