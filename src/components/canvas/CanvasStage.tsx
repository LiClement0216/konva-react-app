import { Stage, Layer, Rect } from 'react-konva'
import { RectShape } from './RectShape';
import { CircleShape } from './CircleShape';
import { EllipseShape } from './EllipseShape';
import { LineShape } from './LineShape';
import { TextShape } from './TextShape';
import { ImageShape } from './ImageShape';
import { useRef } from 'react';

export type ShapeType = 'rect' | 'circle' | 'ellipse' | 'line' | 'text'| 'image';

    interface ShapeBase {
        id: string;
        type: ShapeType;
        x: number;
        y: number;
        fill: string;
        rotation: number;
        shadowColor?: string;
        shadowBlur?: number;
        shadowOffset?: { x: number; y: number };
        shadowOpacity?: number;
        strokeColor?: string;
        strokeWidth?: number;
    }

    export interface RectShape extends ShapeBase {
        type: 'rect';
        width: number;
        height: number;
        }

    export interface CircleShape extends ShapeBase {
        type: 'circle';
        radius: number;
    }

    export interface EllipseShape extends ShapeBase {
        type: 'ellipse';
        radiusX: number;
        radiusY: number;
    }

    export interface LineShape extends ShapeBase {
        type: 'line';
        points: number[];
        strokeColor: string;
        strokeWidth: number;
    }

    export interface TextShape extends ShapeBase {
        type: 'text';
        x: number;
        y: number;
        text: string;
        fontSize: number;
        fontFamily: string;
        fill: string;
        width?: number;
        align?: 'left' | 'center' | 'right';
        fillColor: string;
    }

    export interface ImageShape extends ShapeBase {
      type: 'image';
      imageUrl: string;
      width: number;
      height: number;
      lockAspect?: boolean;
      opacity?: number;
    }

    export type Shape = 
    RectShape | 
    CircleShape | 
    EllipseShape | 
    LineShape | 
    TextShape | 
    ImageShape;

    type CanvasStageProps = {
        canvasWidth: number;
        canvasHeight: number;
        shapes: Shape[];
        onChangeShapes: (newShapes: Shape[]) => void;
        selectedId: string | null;
        onSelect: (id: string | null) => void;
        bringToFront: (id: string) => void;
        sendToBack: (id: string) => void;
        backgroundColor: string;
        stageRef?: React.RefObject<any>;
    };

export function CanvasStage({
  canvasWidth,
  canvasHeight,
  shapes,
  onChangeShapes,
  selectedId,
  onSelect,
  bringToFront,
  sendToBack,
  backgroundColor,
  stageRef,
}: CanvasStageProps) {

  return (
    <Stage
      ref={stageRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) {
          onSelect(null);
        }
      }}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={canvasWidth}
          height={canvasHeight}
          fill={backgroundColor}
          listening={false}
        />

        {shapes.map((shape, i) => {
          switch (shape.type) {
            case 'rect':
              return (
                <RectShape
                  key={shape.id}
                  shape={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={onSelect}
                  onChange={(newAttrs) => {
                    const newShapes = shapes.slice();
                    newShapes[i] = newAttrs;
                    onChangeShapes(newShapes);
                  }}
                  bringToFront={bringToFront}
                  sendToBack={sendToBack}
                />
              );
            case 'circle':
              return (
                <CircleShape
                  key={shape.id}
                  shape={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={onSelect}
                  onChange={(newAttrs) => {
                    const newShapes = shapes.slice();
                    newShapes[i] = newAttrs;
                    onChangeShapes(newShapes);
                  }}
                  bringToFront={bringToFront}
                  sendToBack={sendToBack}
                />
              );
            case 'ellipse':
              return (
                <EllipseShape
                  key={shape.id}
                  shape={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={onSelect}
                  onChange={(newAttrs) => {
                    const newShapes = shapes.slice();
                    newShapes[i] = newAttrs;
                    onChangeShapes(newShapes);
                  }}
                  bringToFront={bringToFront}
                  sendToBack={sendToBack}
                />
              );
            case 'line':
              return (
                <LineShape
                  key={shape.id}
                  shape={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={onSelect}
                  onChange={(newAttrs) => {
                    const newShapes = shapes.slice();
                    newShapes[i] = newAttrs;
                    onChangeShapes(newShapes);
                  }}
                  bringToFront={bringToFront}
                  sendToBack={sendToBack}
                />
              );
            case 'text':
              return (
                <TextShape
                  key={shape.id}
                  shape={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={onSelect}
                  onChange={(newAttrs) => {
                    const newShapes = shapes.slice();
                    newShapes[i] = newAttrs;
                    onChangeShapes(newShapes);
                  }}
                  bringToFront={bringToFront}
                  sendToBack={sendToBack}
                />
              );
            case 'image':
            return (
              <ImageShape
                key={shape.id}
                shape={shape}
                isSelected={shape.id === selectedId}
                onSelect={onSelect}
                onChange={(newAttrs) => {
                  const newShapes = shapes.slice();
                  newShapes[i] = newAttrs;
                  onChangeShapes(newShapes);
                }}
              />
            );
          }
        })}
      </Layer>
    </Stage>
  );
}