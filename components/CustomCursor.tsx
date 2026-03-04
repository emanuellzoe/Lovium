"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    };

    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    animate();

    const interactables = document.querySelectorAll("a, button");
    const onEnter = () => {
      cursor.style.width = "20px";
      cursor.style.height = "20px";
      cursor.style.background = "white";
      ring.style.width = "56px";
      ring.style.height = "56px";
    };
    const onLeave = () => {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      cursor.style.background = "var(--crimson-glow)";
      ring.style.width = "36px";
      ring.style.height = "36px";
    };

    interactables.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-3 h-3 bg-crimson-glow rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background] duration-200 mix-blend-screen hidden md:block"
      />
      <div
        ref={ringRef}
        className="fixed w-9 h-9 border-[1.5px] border-[rgba(192,57,43,0.5)] rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[transform,width,height] duration-150 ease-out hidden md:block"
      />
    </>
  );
}
