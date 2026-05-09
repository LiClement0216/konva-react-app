import { Text, Transformer, Group } from 'react-konva';
import { useRef, useEffect } from 'react';
import type { Konva } from 'konva/lib/_FullInternals';
import type { TextShape } from './CanvasStage';

type TextShapeProps = {
  shape: TextShape;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (next: TextShape) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
};

export function TextShape({ shape, isSelected, onSelect, onChange, bringToFront, sendToBack }: TextShapeProps) {
  const textRef = useRef<Konva.Text | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shape]);

  return (
    <>
      <Text
        ref={textRef}
        x={shape.x}
        y={shape.y}
        text={shape.text}
        fontSize={shape.fontSize}
        fill={shape.fillColor}
        draggable
        onClick={() => onSelect(shape.id)}
        onDragEnd={(e) => onChange({ ...shape, x: e.target.x(), y: e.target.y() })}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onSelect(shape.id);
          bringToFront(shape.id);
        }}
        onTransformEnd={(e) => {
          const node = textRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            fontSize: shape.fontSize * scaleY,
            width: (shape.width ?? node.width()) * scaleX,
          });

          node.scaleX(1);
          node.scaleY(1);
        }}
      />

      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}