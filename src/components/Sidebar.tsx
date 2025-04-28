import { useState } from "react";
import icon from "../assets/icon-nobg.png";
import { X, Mail, Sparkles, Settings } from "lucide-react";

const Sidebar = ({ onClose }: { onClose: () => void }) => {
  const [activeItem, setActiveItem] = useState<string>("Message");
  const menuItems = [
    {
      label: "Message",
      icon: <Mail strokeWidth={1.5} size={20} />,
    },
    {
      label: "Job Applier",
      icon: <Sparkles strokeWidth={1.5} size={20} />,
    },
    {
      label: "Settings",
      icon: <Settings strokeWidth={1.5} size={20} />,
    },
  ];

  return (
    <div className="h-full w-full bg-black/20 fixed top-0 left-0 z-10 p-2">
      <div className="w-4/5 max-w-[350px] h-full bg-white rounded-lg">
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src={icon} alt="icon" className="w-8 h-8" />
            <p className="text-lg font-bold">Assistant</p>
          </div>

          <X size={24} strokeWidth={2} onClick={onClose} />
        </div>

        <div className="flex flex-col gap-2 p-2">
          {menuItems.map((item) => (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                activeItem === item.label ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveItem(item.label)}
            >
              {item.icon}
              <p className="font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
