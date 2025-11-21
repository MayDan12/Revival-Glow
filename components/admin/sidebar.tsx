"use client";

import type React from "react";
import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  ChevronDown,
  Home,
  ShoppingCart,
  Package,
  FileText,
  Database,
  Globe,
  Mail,
  Calendar,
  ImageIcon,
  Zap,
  Code,
  Layers,
  Monitor,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  UserPlus,
  UserX,
  Lock,
  Key,
  Eye,
  Bell,
  MessageSquare,
  Camera,
  Headphones,
  Play,
  Bookmark,
  Tag,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Plus,
  Minus,
  Check,
  Star,
  Map,
  Truck,
  Clock,
  Timer,
  DollarSign,
  TrendingDown,
  Puzzle,
  PlusCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type MenuState = "full" | "collapsed" | "hidden";

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  isNew?: boolean;
  children?: SubMenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<any>;
  badge?: string;
  isNew?: boolean;
  children?: SubMenuItem[];
}

interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
}

const menuData: MenuSection[] = [
  //   {
  //     id: "overview",
  //     label: "Overview",
  //     items: [
  //       {
  //         id: "dashboard",
  //         label: "Dashboard",
  //         href: "/dashboard",
  //         icon: Home,
  //         badge: "3",
  //         children: [
  //           {
  //             id: "analytics",
  //             label: "Analytics",
  //             href: "/dashboard/analytics",
  //             icon: BarChart2,
  //           },
  //           {
  //             id: "reports",
  //             label: "Reports",
  //             href: "/dashboard/reports",
  //             icon: FileText,
  //             children: [
  //               {
  //                 id: "sales-reports",
  //                 label: "Sales Reports",
  //                 href: "/dashboard/reports/sales",
  //                 icon: TrendingUp,
  //               },
  //               {
  //                 id: "user-reports",
  //                 label: "User Reports",
  //                 href: "/dashboard/reports/users",
  //                 icon: Users2,
  //               },
  //               {
  //                 id: "financial-reports",
  //                 label: "Financial Reports",
  //                 href: "/dashboard/reports/financial",
  //                 icon: DollarSign,
  //               },
  //             ],
  //           },
  //           {
  //             id: "real-time",
  //             label: "Real-time",
  //             href: "/dashboard/realtime",
  //             icon: Activity,
  //             isNew: true,
  //           },
  //         ],
  //       },
  //       {
  //         id: "analytics",
  //         label: "Analytics",
  //         href: "/analytics",
  //         icon: BarChart2,
  //         children: [
  //           {
  //             id: "overview",
  //             label: "Overview",
  //             href: "/analytics/overview",
  //             icon: PieChart,
  //           },
  //           {
  //             id: "performance",
  //             label: "Performance",
  //             href: "/analytics/performance",
  //             icon: TrendingUp,
  //           },
  //           {
  //             id: "audience",
  //             label: "Audience",
  //             href: "/analytics/audience",
  //             icon: Target,
  //           },
  //         ],
  //       },
  //       {
  //         id: "organization",
  //         label: "Organization",
  //         href: "/organization",
  //         icon: Building2,
  //       },
  //       {
  //         id: "projects",
  //         label: "Projects",
  //         href: "/projects",
  //         icon: Folder,
  //         badge: "12",
  //       },
  //     ],
  //   },
  {
    id: "ecommerce",
    label: "E-commerce",
    items: [
      {
        id: "products",
        label: "Products",
        href: "/products",
        icon: Package,
        children: [
          {
            id: "add-products",
            label: "Add Products",
            href: "/admin/products/new",
            icon: PlusCircleIcon,
          },
          {
            id: "all-products",
            label: "All Products",
            href: "/admin/products",
            icon: Package,
          },
          // {
          //   id: "categories",
          //   label: "Categories",
          //   href: "/admin/products/categories",
          //   icon: Tag,
          //   children: [
          //     {
          //       id: "electronics",
          //       label: "Electronics",
          //       href: "/products/categories/electronics",
          //       icon: Monitor,
          //     },
          //     {
          //       id: "clothing",
          //       label: "Clothing",
          //       href: "/products/categories/clothing",
          //       icon: ShoppingCart,
          //     },
          //     {
          //       id: "books",
          //       label: "Books",
          //       href: "/products/categories/books",
          //       icon: FileText,
          //     },
          //   ],
          // },
        ],
      },
      {
        id: "orders",
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        badge: "5",
        children: [
          {
            id: "all-orders",
            label: "All Orders",
            href: "/admin/orders",
            icon: ShoppingCart,
          },
          // {
          //   id: "pending",
          //   label: "Pending",
          //   href: "/admin/orders/pending",
          //   icon: Clock,
          //   badge: "3",
          // },
          // {
          //   id: "processing",
          //   label: "Processing",
          //   href: "/admin/orders/processing",
          //   icon: Timer,
          // },
          {
            id: "shipped",
            label: "Shipped",
            href: "/admin/orders/shipped",
            icon: Truck,
          },
          {
            id: "delivered",
            label: "Delivered",
            href: "/admin/orders/delivered",
            icon: Check,
          },
        ],
      },
      {
        id: "customers",
        label: "Customers",
        href: "/admin/customers",
        icon: Users2,
        children: [
          {
            id: "all-customers",
            label: "All Customers",
            href: "/admin/customers",
            icon: Users2,
          },
          // {
          //   id: "segments",
          //   label: "Segments",
          //   href: "/admin/customers/segments",
          //   icon: Filter,
          //   children: [
          //     {
          //       id: "vip",
          //       label: "VIP Customers",
          //       href: "/admin/customers/segments/vip",
          //       icon: Star,
          //     },
          //     {
          //       id: "new",
          //       label: "New Customers",
          //       href: "/admin/customers/segments/new",
          //       icon: UserPlus,
          //     },
          //     {
          //       id: "inactive",
          //       label: "Inactive",
          //       href: "/admin/customers/segments/inactive",
          //       icon: UserX,
          //     },
          //   ],
          // },
          {
            id: "reviews",
            label: "Customer Reviews",
            href: "/admin/customers/reviews",
            icon: MessageSquare,
          },
        ],
      },
      {
        id: "inventory",
        label: "Inventory",
        href: "/admin/inventory",
        icon: Database,
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        id: "transactions",
        label: "Transactions",
        href: "/transactions",
        icon: Wallet,
        children: [
          {
            id: "all-transactions",
            label: "All Transactions",
            href: "/transactions/all",
            icon: Wallet,
          },
          {
            id: "income",
            label: "Income",
            href: "/transactions/income",
            icon: TrendingUp,
          },
          {
            id: "expenses",
            label: "Expenses",
            href: "/transactions/expenses",
            icon: TrendingDown,
          },
        ],
      },
      {
        id: "invoices",
        label: "Invoices",
        href: "/invoices",
        icon: Receipt,
        badge: "2",
      },
      {
        id: "payments",
        label: "Payments",
        href: "/payments",
        icon: CreditCard,
        children: [
          {
            id: "payment-methods",
            label: "Payment Methods",
            href: "/payments/methods",
            icon: CreditCard,
          },
          {
            id: "payment-history",
            label: "Payment History",
            href: "/payments/history",
            icon: Clock,
          },
          {
            id: "refunds",
            label: "Refunds",
            href: "/payments/refunds",
            icon: Minus,
          },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuState, setMenuState] = useState<MenuState>("full");
  const [isHovered, setIsHovered] = useState(false);
  const [previousDesktopState, setPreviousDesktopState] =
    useState<MenuState>("full");
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Cycle through menu states: full -> collapsed -> hidden -> full
  const toggleMenuState = () => {
    setMenuState((prev) => {
      switch (prev) {
        case "full":
          return "collapsed";
        case "collapsed":
          return "hidden";
        case "hidden":
          return "full";
        default:
          return "full";
      }
    });
  };

  // Function to set menu state from theme customizer
  const setMenuStateFromCustomizer = (state: MenuState) => {
    if (!isMobile) {
      setMenuState(state);
    }
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint
      setIsMobile(!isDesktop);

      if (!isDesktop) {
        // On mobile/tablet, save current desktop state and set to hidden
        if (menuState !== "hidden") {
          setPreviousDesktopState(menuState);
          setMenuState("hidden");
        }
      } else {
        // On desktop, restore previous state if coming from mobile
        if (menuState === "hidden" && previousDesktopState !== "hidden") {
          setMenuState(previousDesktopState);
        }
      }
    };

    // Check on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [menuState, previousDesktopState]);

  // Export functions to window for TopNav and ThemeCustomizer to access
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).toggleMenuState = toggleMenuState;
      (window as any).menuState = menuState;
      (window as any).isHovered = isHovered;
      (window as any).isMobile = isMobile;
      (window as any).setIsMobileMenuOpen = setIsMobileMenuOpen;
      (window as any).isMobileMenuOpen = isMobileMenuOpen;
      (window as any).setMenuStateFromCustomizer = setMenuStateFromCustomizer;
    }
  }, [menuState, isHovered, isMobile, isMobileMenuOpen]);

  function handleNavigation() {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  function NavItem({
    item,
    level = 0,
    parentId = "",
  }: {
    item: MenuItem | SubMenuItem;
    level?: number;
    parentId?: string;
  }) {
    const itemId = `${parentId}-${item.id}`;
    const isExpanded = expandedItems.has(itemId);
    const hasChildren = item.children && item.children.length > 0;
    const showText =
      menuState === "full" ||
      (menuState === "collapsed" && isHovered) ||
      (isMobile && isMobileMenuOpen);
    const showExpandIcon = hasChildren && showText;

    const paddingLeft =
      level === 0 ? "px-3" : level === 1 ? "pl-8 pr-3" : "pl-12 pr-3";

    const content = (
      <div
        className={cn(
          "flex items-center py-2 text-sm rounded-md transition-colors sidebar-menu-item hover:bg-gray-50 dark:hover:bg-[#1F1F23] relative group cursor-pointer",
          paddingLeft
        )}
        onClick={() => {
          if (hasChildren) {
            toggleExpanded(itemId);
          } else if (item.href) {
            // Navigate to the href
            window.location.href = item.href;
            handleNavigation();
          }
        }}
        title={
          menuState === "collapsed" && !isHovered && !isMobile
            ? item.label
            : undefined
        }
      >
        <item.icon className="h-4 w-4 flex-shrink-0 sidebar-menu-icon" />

        {showText && (
          <>
            <span className="ml-3 flex-1 transition-opacity duration-200 sidebar-menu-text">
              {item.label}
            </span>

            {/* Badges and indicators */}
            <div className="flex items-center space-x-1">
              {item.isNew && (
                <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  New
                </span>
              )}
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {item.badge}
                </span>
              )}
              {showExpandIcon && (
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    isExpanded ? "rotate-180" : "rotate-0"
                  )}
                />
              )}
            </div>
          </>
        )}

        {/* Tooltip for collapsed state when not hovered and not mobile */}
        {menuState === "collapsed" && !isHovered && !isMobile && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.label}
            {item.badge && (
              <span className="ml-1 text-blue-300">({item.badge})</span>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div>
        {item.href && !hasChildren ? (
          <Link href={item.href}>{content}</Link>
        ) : (
          content
        )}
        {hasChildren && isExpanded && showText && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                level={level + 1}
                parentId={itemId}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Calculate sidebar width - expand when collapsed and hovered, or full width on mobile
  const getSidebarWidth = () => {
    if (isMobile) {
      return "w-64"; // Always full width on mobile
    }
    if (menuState === "collapsed" && isHovered) {
      return "w-64"; // Expand to full width when hovered
    }
    return menuState === "collapsed" ? "w-16" : "w-64";
  };

  // Show text if menu is full OR if collapsed and hovered OR on mobile
  const showText =
    menuState === "full" ||
    (menuState === "collapsed" && isHovered) ||
    (isMobile && isMobileMenuOpen);

  // On mobile, show sidebar as overlay when isMobileMenuOpen is true
  if (isMobile) {
    return (
      <>
        {/* Mobile sidebar overlay */}
        <nav
          className={`
            fixed inset-y-0 left-0 z-[70] w-64 bg-background 
            border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
              <Link
                href="https://cmsfullform.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full"
              >
                <Image
                  src="/revivalglows.png"
                  alt="Revival Glow"
                  width={40}
                  height={40}
                  className="flex-shrink-0"
                />
                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                  Revival Glow
                </span>
              </Link>
            </div>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
              style={{
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE and Edge */,
              }}
            >
              <div className="space-y-6">
                {menuData.map((section) => (
                  <div key={section.id}>
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label">
                      {section.label}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavItem
                          key={item.id}
                          item={item}
                          parentId={section.id}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
              <div className="space-y-1">
                <NavItem
                  item={{
                    id: "settings",
                    label: "Settings",
                    href: "/settings",
                    icon: Settings,
                  }}
                />
                <NavItem
                  item={{
                    id: "help",
                    label: "Help",
                    href: "/help",
                    icon: HelpCircle,
                  }}
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile overlay backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[65]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <nav
      className={`
        fixed inset-y-0 left-0 z-[60] bg-background 
        border-r border-gray-200 transition-all duration-300 ease-in-out
        ${menuState === "hidden" ? "w-0 border-r-0" : getSidebarWidth()}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        overflow: menuState === "hidden" ? "hidden" : "visible",
      }}
    >
      {menuState !== "hidden" && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
            {showText ? (
              <Link
                href="https://cmsfullform.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full"
              >
                <Image
                  src="/revivalglows.png"
                  alt="Revival Glow"
                  width={40}
                  height={40}
                  className="flex-shrink-0 hidden dark:block"
                />
                <Image
                  src="/revivalglows.png"
                  alt="Revival Glow"
                  width={40}
                  height={40}
                  className="flex-shrink-0 block dark:hidden"
                />

                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white transition-opacity duration-200">
                  Revival Glow
                </span>
              </Link>
            ) : (
              <div className="flex justify-center w-full">
                <img
                  src="https://cmsfullform.com/themes/cmsfullform/Backend/Assets/favicon/apple-icon-60x60.png"
                  alt="CMSFullForm"
                  width={32}
                  height={32}
                  className="flex-shrink-0 hidden dark:block"
                />
                <img
                  src="https://cmsfullform.com/themes/cmsfullform/Backend/Assets/favicon/apple-icon-60x60.png"
                  alt="CMSFullForm"
                  width={32}
                  height={32}
                  className="flex-shrink-0 block dark:hidden"
                />
              </div>
            )}
          </div>

          <div
            className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
          >
            <div className="space-y-6">
              {menuData.map((section) => (
                <div key={section.id}>
                  {showText && (
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label transition-opacity duration-200">
                      {section.label}
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem
                        key={item.id}
                        item={item}
                        parentId={section.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem
                item={{
                  id: "settings",
                  label: "Settings",
                  href: "/settings",
                  icon: Settings,
                }}
              />
              <NavItem
                item={{
                  id: "help",
                  label: "Help",
                  href: "/help",
                  icon: HelpCircle,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
