import { Circle, Transformer } from 'react-konva';
import { useRef, useEffect } from 'react';
import type { CircleShape } from './CanvasStage';

type CircleShapeProps = {
  shape: CircleShape;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (newAttrs: CircleShape) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
};

export function CircleShape({ shape, isSelected, onSelect, onChange, bringToFront, sendToBack }: CircleShapeProps) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);
    
  return (
    <>
      <Circle
        ref={shapeRef}
        {...shape}
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        shadowColor={shape.shadowColor}
        shadowBlur={shape.shadowBlur}
        shadowOffset={shape.shadowOffset}
        shadowOpacity={shape.shadowOpacity}
        draggable
        onClick={() => onSelect(shape.id)}
        onDragEnd={(e) => {
          onChange({
            ...shape,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onSelect(shape.id);
          bringToFront(shape.id);
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          const scale = (scaleX + scaleY) / 2;
          const newRadius = shape.radius * scale;

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            radius: newRadius,
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}