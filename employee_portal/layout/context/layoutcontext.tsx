"use client";
import React, { useState, createContext, useRef } from "react";
import {
  LayoutState,
  ChildContainerProps,
  LayoutConfig,
  LayoutContextProps,
} from "@/types";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import LoadingDialog from "@/component/layout/LoadingDialog";
export const LayoutContext = createContext({} as LayoutContextProps);
import { SessionProvider } from "next-auth/react";

export const LayoutProvider = ({ children }: ChildContainerProps) => {
  const toastRef = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    ripple: false,
    inputStyle: "outlined",
    menuMode: "static",
    colorScheme: "light",
    theme: "lara-light-indigo",
    scale: 12,
  });

  const [layoutState, setLayoutState] = useState<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  });

  const onMenuToggle = () => {
    if (isOverlay()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        overlayMenuActive: !prevLayoutState.overlayMenuActive,
      }));
    }

    if (isDesktop()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive,
      }));
    } else {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
      }));
    }
  };

  const showProfileSidebar = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: !prevLayoutState.profileSidebarVisible,
    }));
  };

  const isOverlay = () => {
    return layoutConfig.menuMode === "overlay";
  };

  const isDesktop = () => {
    return window.innerWidth > 991;
  };

  const value: LayoutContextProps = {
    layoutConfig,
    setLayoutConfig,
    layoutState,
    setLayoutState,
    onMenuToggle,
    showProfileSidebar,
    toastRef,
    setLayoutLoading: setVisible,
  };

  return (
    // <SessionProvider session={session}>
      <LayoutContext.Provider value={value}>
        <Toast ref={toastRef} />
        <ConfirmDialog />
        <LoadingDialog visible={visible} setVisible={setVisible} />
        {children}
      </LayoutContext.Provider>
    // </SessionProvider>
  );
};
