import { AuthProvider } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header />
        <main className="max-w-2xl mx-auto pb-20 md:pb-8">{children}</main>
        <MobileNav />
      </div>
    </AuthProvider>
  );
}
