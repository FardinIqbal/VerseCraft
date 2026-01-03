import { AuthProvider } from "@/hooks/use-auth";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FloatingControls } from "@/components/ui/floating-controls";
import { MusicPlayer } from "@/components/ui/music-player";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <MusicPlayer />
        <FloatingControls />
        {children}
        <MobileNav />
      </div>
    </AuthProvider>
  );
}
