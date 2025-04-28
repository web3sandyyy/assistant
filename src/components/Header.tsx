import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { AnimatePresence } from "framer-motion";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div>
      <Menu size={24} strokeWidth={2} onClick={() => setIsSidebarOpen(true)} />

      <AnimatePresence>
        {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Header;
