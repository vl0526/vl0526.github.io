import { useEffect } from "react";

interface UseAntiCheatProps {
  enabled: boolean;
  onStrike: (reason: string) => void;
  banned: boolean;
}

export function useAntiCheat({ enabled, onStrike, banned }: UseAntiCheatProps) {
  useEffect(() => {
    if (!enabled || banned) return;

    const onBlur = () => onStrike("Rời tab/ứng dụng");
    const onVis = () => {
      if (document.hidden) onStrike("Chuyển tab hoặc thu nhỏ");
    };
    const onContext = (e: Event) => {
      e.preventDefault();
      onStrike("Chuột phải");
    };
    const onKey = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const bad = (ctrl && ["c", "v", "f"].includes(e.key.toLowerCase()));
      if (bad) {
        e.preventDefault();
        onStrike("Tổ hợp phím bị cấm");
      }
    };

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKey);
    };
  }, [enabled, onStrike, banned]);
}
