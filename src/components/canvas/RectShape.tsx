import { Rect, Transformer } from 'react-konva';
import { useRef, useEffect } from 'react';
import type { RectShape } from './CanvasStage';

type RectShapeProps = {
  shape: RectShape;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (newAttrs: RectShape) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
};

export function RectShape({ shape, isSelected, onSelect, onChange, bringToFront, sendToBack }: RectShapeProps) {
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
      <Rect
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

          const newWidth = node.width() * scaleX;
          const newHeight = node.height() * scaleY;

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight,
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}