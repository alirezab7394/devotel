import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import { PATHNAMES } from "@/constants/pathnames";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold">Dynamic Form System</div>
              <div className="flex items-center space-x-4">
                <ul className="flex space-x-4">
                  <li>
                    <Link
                      to={PATHNAMES.HOME}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={PATHNAMES.DYNAMIC_FORM_DEMO}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Form Demo
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={PATHNAMES.APPLICATIONS}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Applications
                    </Link>
                  </li>
                </ul>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>

        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
          <div className="container mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            BUILD BY ALIREZA7394@GMAIL.COM &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
