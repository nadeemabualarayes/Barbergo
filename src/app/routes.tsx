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

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
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
]);
