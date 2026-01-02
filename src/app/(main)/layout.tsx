import { AuthProvider } from "@/hooks/use-auth";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        {children}
        <MobileNav />
      </div>
    </AuthProvider>
  );
}
