/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { AppTopbarRef } from "@/types";
import { LayoutContext } from "./context/layoutcontext";
import { signOut, useSession } from "next-auth/react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import refreshSession from "@/lib/utils";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const { data: session, update: updateSession } = useSession();
  const menuOverlayRef = useRef<any>(null);

  useEffect(() => {
    updateSession();
  }, []);

  const itemRenderer = (item: any) => (
    <div className="p-menuitem-content">
      <a className="flex align-items-center p-menuitem-link">
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
        {item.badge && <Badge className="ml-auto" value={item.badge} />}
        {item.shortcut && (
          <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
            {item.shortcut}
          </span>
        )}
      </a>
    </div>
  );
  let items = [
    {
      template: (item: any, options: any) => {
        return (
          <button
            onClick={(e) => options.onClick(e)}
            className={classNames(
              options.className,
              "w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
            )}
          >
            <div className="flex-column">
              <p className="font-bold">{session?.user.full_name}</p>
              <p className="text-sm">{session?.user.job_position}</p>
            </div>
          </button>
        );
      },
    },
    {
      separator: true,
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        signOut({ callbackUrl: "/auth/login" });
      },
      template: itemRenderer,
    },
  ];

  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <span>ADMIN PORTAL</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        <Menu model={items} popup ref={menuOverlayRef} id="popup_menu" />
        <button
          type="button"
          className="p-link layout-topbar-button"
          aria-controls="popup_menu_left"
          aria-haspopup
          onClick={(e) => menuOverlayRef.current.toggle(e)}
          //   onClick={() => {
          //     signOut({ callbackUrl: "/auth/login" });
          //   }}
        >
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
