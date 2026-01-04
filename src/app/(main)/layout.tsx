import { AuthProvider } from "@/hooks/use-auth";
import { MusicProvider } from "@/hooks/use-music";
import { UnifiedNav } from "@/components/layout/unified-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <MusicProvider>
        <div className="min-h-screen bg-background pb-[52px]">
          {children}
          <UnifiedNav />
        </div>
      </MusicProvider>
    </AuthProvider>
  );
}
