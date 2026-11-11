
import { useEffect, useState } from "react";

function smallHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36); // a-z,0-9
}

function getSmallDeviceId() {
  const userAgent = navigator.userAgent;
  const res = `${screen.width}x${screen.height}`;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const pr = window.devicePixelRatio;

  const raw = `${userAgent}|${res}|${tz}|${pr}`;
  return smallHash(raw);
}

export const useGetDevice = () => {
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const id = getSmallDeviceId();
    setDeviceId(id);
  }, []);

  return deviceId;
};
