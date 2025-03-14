import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "../test/test-utils";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";

// Mock the next-themes module
vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("ThemeToggle", () => {
  it("renders the theme toggle button", () => {
    // Mock the useTheme hook
    const mockSetTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it("toggles from light to dark theme when clicked", () => {
    // Mock the useTheme hook for light theme
    const mockSetTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole("button", { name: /toggle theme/i });

    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("toggles from dark to light theme when clicked", () => {
    // Mock the useTheme hook for dark theme
    const mockSetTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole("button", { name: /toggle theme/i });

    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
