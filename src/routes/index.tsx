import { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Applications from "@/pages/Applications";
import DynamicFormDemo from "@/pages/DynamicFormPage";
import { PATHNAMES } from "@/constants/pathnames";

// Define all application routes
const routes: RouteObject[] = [
  {
    path: PATHNAMES.HOME,
    element: <Home />,
  },
  {
    path: PATHNAMES.DYNAMIC_FORM_DEMO,
    element: <DynamicFormDemo />,
  },
  {
    path: PATHNAMES.APPLICATIONS,
    element: <Applications />,
  },
];

export default routes;
