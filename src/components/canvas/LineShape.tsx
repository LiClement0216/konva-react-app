import { Line, Transformer, Circle, Group } from 'react-konva';
import { useRef, useEffect, type JSX } from 'react';
import type { LineShape } from './CanvasStage';
import type { Konva } from 'konva/lib/_FullInternals';

type LineShapeProps = {
  shape: LineShape;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (newAttrs: LineShape) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
};

export function LineShape({ shape, isSelected, onSelect, onChange, bringToFront, sendToBack }: LineShapeProps) {
  const groupRef = useRef<Konva.Group | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shape]);

  const insertPointAtClosestSegment = (points: number[], x: number, y: number): number[] => {
    if (points.length < 4) {
      return [...points, x, y];
    }

    let closestSegmentIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < points.length - 3; i += 2) {
      const x1 = points[i];
      const y1 = points[i + 1];
      const x2 = points[i + 2];
      const y2 = points[i + 3];

      const distance = pointToSegmentDistance(x, y, x1, y1, x2, y2);
      if (distance < minDistance) {
        minDistance = distance;
        closestSegmentIndex = i;
      }
    }

    const newPoints = [...points];
    newPoints.splice(closestSegmentIndex + 2, 0, x, y);
    return newPoints;
  };

  const pointToSegmentDistance = (
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let nearestX: number;
    let nearestY: number;

    if (param < 0) {
      nearestX = x1;
      nearestY = y1;
    } else if (param > 1) {
      nearestX = x2;
      nearestY = y2;
    } else {
      nearestX = x1 + param * C;
      nearestY = y1 + param * D;
    }

    const dx = px - nearestX;
    const dy = py - nearestY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const vertexHandles = isSelected
    ? shape.points.reduce<JSX.Element[]>((acc, _, idx) => {
        if (idx % 2 !== 0) return acc;

        const localX = shape.points[idx];
        const localY = shape.points[idx + 1];

        acc.push(
          <Circle
            key={idx}
            x={localX}
            y={localY}
            radius={5}
            fill="white"
            stroke="black"
            draggable
            onMouseDown={(e) => {
              e.cancelBubble = true;
            }}
            onDragMove={(e) => {
              e.cancelBubble = true;

              const newLocalX = e.target.x();
              const newLocalY = e.target.y();

              const newPoints = [...shape.points];
              newPoints[idx] = newLocalX;
              newPoints[idx + 1] = newLocalY;

              onChange({ ...shape, points: newPoints });
            }}
            onDragEnd={(e) => {
              e.cancelBubble = true;
            }}
          />
        );
        return acc;
      }, [])
    : null;

  return (
    <>
      <Group
        ref={groupRef}
        x={shape.x}
        y={shape.y}
        rotation={shape.rotation}
        draggable
        onClick={() => onSelect(shape.id)}
        onDragEnd={(e) => {
          onChange({
            ...shape,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = groupRef.current;
          const tr = trRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          const newPoints = shape.points.map((p, idx) =>
            idx % 2 === 0 ? p * scaleX : p * scaleY
          );

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            points: newPoints,
            rotation: node.rotation(),
          });

          if (tr) {
            tr.nodes([node]);
            tr.forceUpdate();
            tr.getLayer()?.batchDraw();
          }
        }}
        onDblClick={(e) => {
          const stage = e.target.getStage();
          if (!stage || !groupRef.current) return;

          const pointerPos = stage.getPointerPosition();
          if (!pointerPos) return;

          const group = groupRef.current;
          const groupAbs = group.getAbsolutePosition();
          const localX = pointerPos.x - groupAbs.x;
          const localY = pointerPos.y - groupAbs.y;

          const newPoints = insertPointAtClosestSegment(shape.points, localX, localY);
          onChange({ ...shape, points: newPoints });

          bringToFront(shape.id);
        }}
      >
        <Line
          points={shape.points}
          stroke={shape.strokeColor}
          strokeWidth={shape.strokeWidth}
          shadowColor={shape.shadowColor}
          shadowBlur={shape.shadowBlur}
          shadowOffset={shape.shadowOffset}
          shadowOpacity={shape.shadowOpacity}
          hitStrokeWidth={20}
        />

        {vertexHandles}
      </Group>

      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}