import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Killer",
  description: "Home application for Killer organizers and players",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}