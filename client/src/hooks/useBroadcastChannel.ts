import { useEffect, useRef } from "react";

const CHANNEL_NAME = "quiz-broadcast-v1";

export function useBroadcastChannel(onMessage: (data: any) => void) {
  const bcRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bcRef.current = new BroadcastChannel(CHANNEL_NAME);
      bcRef.current.onmessage = (e) => {
        onMessage(e.data);
      };
    }

    return () => {
      if (bcRef.current) {
        bcRef.current.close();
      }
    };
  }, [onMessage]);

  const postMessage = (data: any) => {
    if (bcRef.current) {
      bcRef.current.postMessage(data);
    }
  };

  return { postMessage };
}
