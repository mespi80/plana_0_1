import { BottomNavigation } from "./bottom-navigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {children}
      <BottomNavigation />
    </div>
  );
} 