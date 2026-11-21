import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import MubornPage from "@/pages/MubornPage";
import DinozPage from "@/pages/DinozPage";
import SemokkeutPage from "@/pages/SemokkeutPage";
import TicketsPage from "@/pages/TicketsPage";
import CreativeTeamPage from "@/pages/CreativeTeamPage";
import GuidePage from "@/pages/GuidePage";
import PhotoboothPage from "@/pages/PhotoboothPage";
import AdminPage from "@/pages/AdminPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/muborn" element={<MubornPage />} />
          <Route path="/works/dinoz" element={<DinozPage />} />
          <Route path="/works/semokkeut" element={<SemokkeutPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/creative-team" element={<CreativeTeamPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/photobooth" element={<PhotoboothPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
