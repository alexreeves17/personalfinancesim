import { MouseEvent } from 'react';

interface Point {
  x: number;
  y: number;
}

export function calculateAngle(center: Point, point: Point): number {
  const angle = Math.atan2(point.y - center.y, point.x - center.x);
  let degrees = (angle * 180 / Math.PI + 90) % 360;
  if (degrees < 0) degrees += 360;
  return degrees;
}

export function calculatePercentage(degrees: number): number {
  return Math.round((degrees / 360) * 100);
}

export function getMousePosition(e: MouseEvent<SVGElement>): Point {
  const svg = e.currentTarget;
  const rect = svg.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

export function getCenter(svg: SVGElement): Point {
  const rect = svg.getBoundingClientRect();
  return {
    x: rect.width / 2,
    y: rect.height / 2
  };
}