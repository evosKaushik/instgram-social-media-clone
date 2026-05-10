import {
  FiUser,
  FiBell,
  FiLock,
  FiUsers,
  FiSlash,
  FiMapPin,
  FiSend,
  FiAtSign,
  FiMessageCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "How you use Instagram",
    items: [
      { icon: FiUser, label: "Edit Profile", active: true, to: "/account/edit" },
      { icon: FiBell, label: "Notifications", to: "/notifications" },
    ],
  },
  {
    title: "Who can see your content",
    items: [
      { icon: FiLock, label: "Account privacy", to: "/account/privacy" },
      { icon: FiUsers, label: "Close Friends", to: "/account/close-friends" },
      { icon: FiSlash, label: "Blocked", to: "/account/blocked" },
      {
        icon: FiMapPin,
        label: "Story and location",
        to: "/account/story-location",
      },
    ],
  },
  {
    title: "How others can interact with you",
    items: [
      {
        icon: FiSend,
        label: "Messages and story replies",
        to: "/account/messages",
      },
      { icon: FiAtSign, label: "Tags and mentions", to: "/account/tags" },
      { icon: FiMessageCircle, label: "Comments", to: "/account/comments" },
    ],
  },
];

export default function AccountSidebar() {
  return (
    <div className="h-screen w-full xs:w-28 sm:w-[320px] bg-black border-r border-white/10 overflow-y-auto custom-scroll">
      <div className="p-4">
        {/* Top Button */}
        <button className="w-full flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 transition rounded-2xl px-4 py-4 mb-6">
          <FiUser className="text-2xl text-white" />
          <span className="text-white font-medium">Teen Account settings</span>
        </button>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm text-zinc-500 mb-3 px-2">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      to={item.to}
                      key={item.label}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition border
                      
                      ${
                        item.active
                          ? "bg-zinc-800 border-blue-500"
                          : "border-transparent hover:bg-zinc-900"
                      }
                      `}
                    >
                      <Icon className="text-2xl text-white shrink-0" />

                      <span className="text-white text-[15px] font-medium">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
