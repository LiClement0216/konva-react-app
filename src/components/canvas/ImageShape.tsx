import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import type { ImageShape as ImageShapeType } from './CanvasStage';
import { useRef, useEffect } from 'react';

type Props = {
  shape: ImageShapeType;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onChange: (newAttrs: ImageShapeType) => void;
};

export function ImageShape({ shape, isSelected, onSelect, onChange }: Props) {
  const [img] = useImage(shape.imageUrl);
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
      <KonvaImage
        ref={shapeRef}
        image={img}
        opacity={shape.opacity ?? 1}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rotation={shape.rotation}
        draggable
        onClick={() => onSelect(shape.id)}
        onTap={() => onSelect(shape.id)}
        onDragEnd={(e) =>
          onChange({
            ...shape,
            x: e.target.x(),
            y: e.target.y(),
          })
        }
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          const baseWidth = node.width();
          const baseHeight = node.height();
          const ratio = baseWidth / baseHeight || 1;

          let newWidth = baseWidth * scaleX;
          let newHeight = baseHeight * scaleY;

          if (shape.lockAspect) {
            const deltaWidth = Math.abs(newWidth - baseWidth);
            const deltaHeight = Math.abs(newHeight - baseHeight);

            if (deltaWidth > deltaHeight) {
              newHeight = newWidth / ratio;
            } else {
              newWidth = newHeight * ratio;
            }
          }

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