"use client";

import { useContext } from "react";
import { saveToken } from "./action";
import { messaging } from "./client";
import { getToken, onMessage } from "firebase/messaging";
import { LayoutContext } from "@/layout/context/layoutcontext";

export async function requestFcmToken() {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    const result = await saveToken(token);
    return token;
  } catch (err) {
    // console.error("Error getting FCM token:", err);
    return null;
  }
}

export function listenForForegroundMessages(toastRef: any) {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    toastRef.current.show({
      severity: "success",
      summary: payload.notification?.title,
      detail: payload.notification?.body,
    });
  });
}
