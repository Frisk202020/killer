import type { Metadata } from "next";
import "./globals.css";
import { ICONS } from "@/db/data";

export const metadata: Metadata = {
  title: "Killer",
  description: "Home application for Killer organizers and players",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href={"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=" + ICONS.join(",")}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}