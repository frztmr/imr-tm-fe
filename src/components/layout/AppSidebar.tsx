import { Package, Warehouse, Users, BarChart3, ArrowLeftRight, Calendar } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import LoadingOverlay from "@/components/ui/loadingOverlay";
import Axios from "@/config/axios";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import ThemeToggle from "@/config/ThemeToggle";

//   Map string icon names (from DB) to actual imported components
const IconMap: Record<string, any> = {
  Package,
  Warehouse,
  Users,
  BarChart3,
  ArrowLeftRight,
  Calendar,
};

const backupItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "profile", url: "/profile", icon: Users }, 
];

export function AppSidebar() {

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { state } = useSidebar();
  const location = useLocation();
  // const currentPath = location.pathname;

  const getNavCls = ({ isActive }: { isActive: boolean }) => isActive ?
    "bg-muted text-primary font-medium" :
    "hover:bg-muted/50";

  console.log('loading', loading)


  useEffect(() => {

    setLoading(true)


    // use database to store menu. 
    // so everyone can costumized per person. 

    // here axios to make HTTP request to backend
    Axios.get("/ui/side_menu")
      .then((res) => {

        // 🧠 Convert each DB row to use existing icon components
        const mapped = res.data.rows.map((item: any) => ({
          ...item,
          icon: IconMap[item.icon] || BarChart3, // fallback icon if not found
        }));

        setItems(mapped);
        setLoading(false)

      })
      .catch((err) => {

        console.error("getMenuList Error:", err);
        setItems(backupItems);
        setLoading(false)

      });


  }, []);

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Your App, Miaw</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ThemeToggle />
              {loading && <LoadingOverlay />}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
