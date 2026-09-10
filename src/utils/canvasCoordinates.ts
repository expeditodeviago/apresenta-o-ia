// src/utils/canvasCoordinates.ts
export const getCanvasCoordinates = (
  e: React.MouseEvent<HTMLCanvasElement> | MouseEvent | React.PointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
  pan: { x: number; y: number },
  zoom: number
) => {
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;

  return {
    x: (screenX - pan.x) / zoom,
    y: (screenY - pan.y) / zoom,
  };
};
