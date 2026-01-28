import type { Metadata } from "next";
import "./globals.css";
import { SimpleHeader } from "@/components/SimpleHeader";
import { UserProvider } from "@/contexts/UserContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "FIELD Assist - Kennisplatform voor gemeenten",
  description: "Het kennisplatform dat operationele kennis van Fielders bij gemeenten ontsluit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-white">
        <UserProvider>
          <ProjectProvider>
            <ChatProvider>
              <ToastProvider>
                <SimpleHeader />
                <main>{children}</main>
                <ToastContainer />
              </ToastProvider>
            </ChatProvider>
          </ProjectProvider>
        </UserProvider>
      </body>
    </html>
  );
}
