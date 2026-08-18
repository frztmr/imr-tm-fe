
//dummy? 
import { Grid3x3, FileText, Plane, Bookmark } from "lucide-react"; // or wherever your icons come from

//dummy
type TabKey = "posts" | "articles" | "trips" | "saved";

interface TabConfig {
  k: TabKey;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

interface ProfileTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  className?: string;
}

//dummy
const tabsConfig: readonly TabConfig[] = [
  { k: "posts", label: "Posts", Icon: Grid3x3 },
  { k: "articles", label: "Articles", Icon: FileText },
  { k: "trips", label: "Trips", Icon: Plane },
  { k: "saved", label: "Tagged", Icon: Bookmark },
] as const;

export function ProfileTabs({ 
  activeTab, 
  onTabChange, 
  className = "" 
}: ProfileTabsProps) {
  return (
    <div className={`mb-3 grid grid-cols-4 border-y ${className}`}>
      {tabsConfig.map(({ k, label, Icon }) => (
        <button
          key={k}
          onClick={() => onTabChange(k)}
          className={`
            flex items-center justify-center gap-1.5 
            py-3 text-[11px] font-semibold uppercase tracking-wider 
            transition sm:gap-2 sm:text-xs
            ${activeTab === k 
              ? "border-t-2 border-foreground text-foreground -mt-px" 
              : "text-muted-foreground"
            }
          `}
        >
          <Icon className="h-4 w-4" /> {label}
        </button>
      ))}
    </div>
  );
}