"use client";

import { usePathname } from "next/navigation";
import {
  type LucideIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu className="mt-2 group-data-[collapsible=icon]:space-y-3">
        {projects.map((item) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={`h-12 transition-all
                group-data-[collapsible=icon]:h-11
                group-data-[collapsible=icon]:w-11
                group-data-[collapsible=icon]:p-0
                group-data-[collapsible=icon]:mx-auto
                group-data-[collapsible=icon]:flex
                group-data-[collapsible=icon]:items-center
                group-data-[collapsible=icon]:justify-center
                group-data-[collapsible=icon]:border-0
                group-data-[collapsible=icon]:rounded-md
                ${
                  isActive
                    ? "text-blue-500 font-semibold border-l-4 border-blue-500 pl-4 rounded-l-none group-data-[collapsible=icon]:bg-blue-50 group-data-[collapsible=icon]:border-blue-500"
                    : "hover:text-blue-600 group-data-[collapsible=icon]:hover:bg-accent"
                }`}
              >
                <a href={item.url} className="flex items-center gap-3 w-full">
                  <item.icon
                    className={[
                      "shrink-0 transition-all",
                      "group-data-[collapsible=icon]:size-5",
                      isActive
                        ? "text-blue-500"
                        : "text-muted-foreground hover:text-blue-600",
                    ].join(" ")}
                  />
                  <span className="font-medium group-data-[collapsible=icon]:hidden">
                    {item.name}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}