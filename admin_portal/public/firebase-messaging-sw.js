importScripts(
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB4L_J3zXEeFoJgHqLphYA12cJhh-TlUuo",
  authDomain: "employee-attendance-30e1f.firebaseapp.com",
  projectId: "employee-attendance-30e1f",
  storageBucket: "employee-attendance-30e1f.firebasestorage.app",
  messagingSenderId: "652911853167",
  appId: "1:652911853167:web:750f86a46110b25964579a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/icon.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
