import { PATHNAMES } from "@/constants/pathnames";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-6">Dynamic Form System</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-medium mb-2">Add Applications</h3>
            <p className="text-muted-foreground mb-4">Add new applications to the system.</p>
            <Link to={PATHNAMES.DYNAMIC_FORM_DEMO} className="text-primary hover:text-primary/80">
              Add Applications &rarr;
            </Link>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-medium mb-2">View Applications</h3>
            <p className="text-muted-foreground mb-4">
              Access all submitted applications with advanced filtering, sorting, and column customization.
            </p>
            <Link to={PATHNAMES.APPLICATIONS} className="text-primary hover:text-primary/80">
              View Applications &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
