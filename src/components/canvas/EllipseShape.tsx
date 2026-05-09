import { Ellipse, Transformer } from 'react-konva';
import { useRef, useEffect } from 'react';
import type { EllipseShape } from './CanvasStage';

type EllipseShapeProps = {
  shape: EllipseShape;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (newAttrs: EllipseShape) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
};



export function EllipseShape({ shape, isSelected, onSelect, onChange, bringToFront, sendToBack }: EllipseShapeProps) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const isCtrlPressedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        isCtrlPressedRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        isCtrlPressedRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);
    
  return (
    <>
      <Ellipse
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

          let newRadiusX = shape.radiusX * scaleX;
          let newRadiusY = shape.radiusY * scaleY;

          const evt = e.evt as MouseEvent;
          const isCtrl = evt.ctrlKey || evt.metaKey;
          if (isCtrl) {
            const avg = (newRadiusX + newRadiusY) / 2;
            newRadiusX = avg;
            newRadiusY = avg;
          }

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            radiusX: newRadiusX,
            radiusY: newRadiusY,
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && <Transformer
        ref={trRef}
        boundBoxFunc={(oldBox, newBox) => {
          if (!isCtrlPressedRef.current) {
            return newBox;
          }

          const sizeChangeX = newBox.width / oldBox.width;
          const sizeChangeY = newBox.height / oldBox.height;
          const scale = (sizeChangeX + sizeChangeY) / 2;

          const newSize = oldBox.width * scale;

          return {
            ...newBox,
            width: newSize,
            height: newSize,
          };
        }}
      />}
    </>
  );
}