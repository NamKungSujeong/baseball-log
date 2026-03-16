"use client";

/**
 * 토스트 훅 — 현재는 console 기반.
 * sonner / react-hot-toast 도입 시 이 파일만 교체하면 됨.
 *
 * 예) sonner 도입:
 *   import { toast as sonnerToast } from "sonner";
 *   export function useToast() {
 *     return (message: string, type: "error" | "success") =>
 *       sonnerToast[type](message);
 *   }
 */
export function useToast() {
  return (message: string, type: "error" | "success") => {
    if (type === "error") {
      console.error("[Toast Error]", message);
    } else {
      console.log("[Toast Success]", message);
    }
  };
}
