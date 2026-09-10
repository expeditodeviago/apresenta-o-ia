import { useState, useRef, useCallback, useEffect } from 'react';

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3.0;

export function usePanZoom(initialZoom: number = 0.85) {
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    zoom: initialZoom,
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startVx: number; startVy: number }>({
    x: 0,
    y: 0,
    startVx: 0,
    startVy: 0,
  });

  const animFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth cubic-ease camera animation to target coordinates & zoom
  const animateTo = useCallback(
    (targetVx: number, targetVy: number, targetZoom: number, durationMs: number = 650) => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const startTime = performance.now();
      const startX = viewport.x;
      const startY = viewport.y;
      const startZoom = viewport.zoom;

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = easeOutCubic(progress);

        const currentX = startX + (targetVx - startX) * eased;
        const currentY = startY + (targetVy - startY) * eased;
        const currentZoom = startZoom + (targetZoom - startZoom) * eased;

        setViewport({
          x: currentX,
          y: currentY,
          zoom: currentZoom,
        });

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [viewport]
  );

  // Focus on world coordinates (x, y) with specified zoom level
  const focusOnCoordinates = useCallback(
    (worldX: number, worldY: number, targetZoom: number = 1.15) => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      const targetVx = screenW / 2 - worldX * targetZoom;
      const targetVy = screenH / 2 - worldY * targetZoom;

      animateTo(targetVx, targetVy, targetZoom, 700);
    },
    [animateTo]
  );

  // Fit all elements in overview (default center around 1600, 850 for blackboard)
  const fitOverview = useCallback(
    (centerX: number = 1600, centerY: number = 850) => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const overviewZoom = Math.max(0.28, Math.min(0.65, (screenW - 100) / 3300));

      const targetVx = screenW / 2 - centerX * overviewZoom;
      const targetVy = screenH / 2 - centerY * overviewZoom;

      animateTo(targetVx, targetVy, overviewZoom, 750);
    },
    [animateTo]
  );

  // Reset to 100% (1.0 zoom) centered on current screen center
  const resetZoom100 = useCallback(() => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const currentCenterX = (screenW / 2 - viewport.x) / viewport.zoom;
    const currentCenterY = (screenH / 2 - viewport.y) / viewport.zoom;

    const targetVx = screenW / 2 - currentCenterX * 1.0;
    const targetVy = screenH / 2 - currentCenterY * 1.0;

    animateTo(targetVx, targetVy, 1.0, 400);
  }, [viewport, animateTo]);

  // Zoom In button
  const zoomIn = useCallback(() => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const newZoom = Math.min(MAX_ZOOM, viewport.zoom * 1.25);
    const worldX = (screenW / 2 - viewport.x) / viewport.zoom;
    const worldY = (screenH / 2 - viewport.y) / viewport.zoom;
    const newVx = screenW / 2 - worldX * newZoom;
    const newVy = screenH / 2 - worldY * newZoom;
    animateTo(newVx, newVy, newZoom, 250);
  }, [viewport, animateTo]);

  // Zoom Out button
  const zoomOut = useCallback(() => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const newZoom = Math.max(MIN_ZOOM, viewport.zoom / 1.25);
    const worldX = (screenW / 2 - viewport.x) / viewport.zoom;
    const worldY = (screenH / 2 - viewport.y) / viewport.zoom;
    const newVx = screenW / 2 - worldX * newZoom;
    const newVy = screenH / 2 - worldY * newZoom;
    animateTo(newVx, newVy, newZoom, 250);
  }, [viewport, animateTo]);

  // Mouse pan initiation on blackboard surface
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return;

    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea') ||
      target.closest('.no-pan')
    ) {
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startVx: viewport.x,
      startVy: viewport.y,
    };
  }, [viewport]);

  // Global mousemove and mouseup listeners to prevent stutter or lost tracking
  useEffect(() => {
    if (!isDragging) return;

    const onGlobalMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      setViewport((prev) => ({
        ...prev,
        x: dragStartRef.current.startVx + dx,
        y: dragStartRef.current.startVy + dy,
      }));
    };

    const onGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onGlobalMouseMove);
    window.addEventListener('mouseup', onGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove);
      window.removeEventListener('mouseup', onGlobalMouseUp);
    };
  }, [isDragging]);

  // Wheel zoom centered at cursor with non-passive listener
  const applyWheelZoom = useCallback((e: WheelEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.closest('.allow-scroll')) {
      return;
    }

    e.preventDefault();

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    setViewport((currentVp) => {
      const zoomDelta = e.deltaY < 0 ? 1.12 : 0.89;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentVp.zoom * zoomDelta));
      if (newZoom === currentVp.zoom) return currentVp;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const worldX = (mouseX - currentVp.x) / currentVp.zoom;
      const worldY = (mouseY - currentVp.y) / currentVp.zoom;

      const newVx = mouseX - worldX * newZoom;
      const newVy = mouseY - worldY * newZoom;

      return {
        x: newVx,
        y: newVy,
        zoom: newZoom,
      };
    });
  }, []);

  // Connect wheel listener to window/container reliably
  useEffect(() => {
    const handleWindowWheel = (e: WheelEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (el.contains(e.target as Node) || e.target === el) {
        applyWheelZoom(e);
      }
    };

    window.addEventListener('wheel', handleWindowWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWindowWheel);
  }, [applyWheelZoom]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    viewport,
    setViewport,
    isDragging,
    handleMouseDown,
    focusOnCoordinates,
    fitOverview,
    resetZoom100,
    zoomIn,
    zoomOut,
    animateTo,
  };
}
