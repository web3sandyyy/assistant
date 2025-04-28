import icon from "../assets/icon-nobg.png";
import { X, Mail, Sparkles, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = ({ onClose }: { onClose: () => void }) => {
  const location = useLocation();
  const menuItems = [
    {
      label: "Message",
      icon: <Mail strokeWidth={1.5} size={20} />,
      path: "/",
    },
    {
      label: "Job Applier",
      icon: <Sparkles strokeWidth={1.5} size={20} />,
      path: "/job-applier",
    },
    {
      label: "Settings",
      icon: <Settings strokeWidth={1.5} size={20} />,
      path: "/settings",
    },
  ];

  return (
    <motion.div
      className="h-full w-full bg-black/20 fixed top-0 left-0 z-10 p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      onClick={onClose}
    >
      <motion.div
        className="w-4/5 max-w-[350px] h-full bg-white rounded-lg"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src={icon} alt="icon" className="w-8 h-8" />
            <p className="text-lg font-bold">Assistant</p>
          </div>

          <X size={24} strokeWidth={2} onClick={onClose} />
        </div>

        <div className="flex flex-col gap-2 p-2">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.label}
              className={`flex items-center gap-2 p-3 rounded-md ${
                location.pathname === item.path ? "bg-gray-100" : ""
              }`}
              onClick={() => {
                onClose();
              }}
            >
              {item.icon}
              <p className="font-medium">{item.label}</p>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
