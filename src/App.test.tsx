import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";

// Mock the components that use Router
vi.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: () => <div>Mocked Route</div>,
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(document.body.textContent).toContain("Dynamic Form System");
  });
});
