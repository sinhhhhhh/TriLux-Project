import Footer from "./components/Footer/page";
import Header from "./components/Header/page";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="header">
          <Header />
        </div>
        <div className="center-container">{children}</div>
        <div className="footer">
          <Footer />
        </div>
      </body>
    </html>
  );
}
