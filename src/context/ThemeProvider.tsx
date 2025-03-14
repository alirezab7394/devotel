import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure that component is mounted on client-side only to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Force a re-render after mounting to ensure theme is properly applied
    const timer = setTimeout(() => {
      setMounted((state) => state);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem
      attribute="class"
      enableColorScheme
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
