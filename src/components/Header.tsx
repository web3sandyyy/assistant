import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div >
      <Menu size={24} strokeWidth={2} onClick={() => setIsSidebarOpen(true)} />

      {isSidebarOpen && (
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Header;
