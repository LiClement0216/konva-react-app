import { useState } from 'react';
import { CanvasStage } from './components/canvas/CanvasStage';
import type { Shape } from './components/canvas/CanvasStage';
import { SidePanel } from './components/canvas/SidePanel';
import { useRef } from 'react';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import './App.css'

const initialShapes: Shape[] = [
  //Hardcoded initial shapes for testing,removed after implementing the add shape feature
  /*{
    id: 'rect-1',
    type: 'rect',
    x: 20,
    y: 50,
    width: 100,
    height: 100,
    fill: 'blue',
    rotation: 0,
    shadowColor: "black",
    shadowBlur: 10,
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 0.5,
    strokeColor: 'black',
    strokeWidth: 0,
  },
  {
    id: 'circle-1',
    type: 'circle',
    x: 200,
    y: 100,
    radius: 50,
    fill: 'green',
    rotation: 0,
    shadowColor: "black",
    shadowBlur: 10,
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 0.5,
    strokeColor: 'black',
    strokeWidth: 0,
  },
  {
    id: 'ellipse-1',
    type: 'ellipse',
    x: 200,
    y: 100,
    radiusX: 50,
    radiusY: 50,
    fill: 'green',
    rotation: 0,
    shadowColor: "black",
    shadowBlur: 10,
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 0.5,
    strokeColor: 'black',
    strokeWidth: 0,
  },
  {
    id: 'line-1',
    type: 'line',
    x: 240,
    y: 0,
    points: [20, 50, 120, 150],
    strokeColor: 'black',
    strokeWidth: 2,
    fill: '',
    rotation: 0,
    shadowColor: "black",
    shadowBlur: 10,
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 0.5,
  },
  {
    id: 'text-1',
    type: 'text',
    x: 300,
    y: 50,
    text: 'Hello, Konva!',
    fontSize: 24,
    fontFamily: 'Arial',
    fill: 'black',
    rotation: 0,
    shadowColor: "black",
    shadowBlur: 10,
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 0.5,
    width: undefined,
    align: 'left',
    fillColor: 'black',
  },*/
];

function App() {
  const [shapes, setShapes] = useState<Shape[]>(initialShapes);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [canvasWidthLogical, setCanvasWidthLogical] = useState(800);
  const [canvasHeightLogical, setCanvasHeightLogical] = useState(600);
  
  const stageRef = useRef<KonvaStage | null>(null);
  
  const bringToFront = (id: string) => {
    setShapes(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      const clone = [...prev];
      const [item] = clone.splice(idx, 1);
      clone.push(item);
      return clone;
    });
  };

  const sendToBack = (id: string) => {
    setShapes(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      const clone = [...prev];
      const [item] = clone.splice(idx, 1);
      clone.unshift(item);
      return clone;
    });
  };

  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 2,
    });
    downloadURI(dataURL, 'canvas.png');
  };

  return (
    <div className="editor-app">
      <SidePanel
        shapes={shapes}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setShapes={setShapes}
        bringToFront={bringToFront}
        sendToBack={sendToBack}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        canvasWidth={canvasWidthLogical}
        canvasHeight={canvasHeightLogical}
        setCanvasWidth={setCanvasWidthLogical}
        setCanvasHeight={setCanvasHeightLogical}
        onExport={handleExport}
      />

      <div className="canvas-wrapper">
        <CanvasStage
          canvasWidth={canvasWidthLogical}
          canvasHeight={canvasHeightLogical}
          shapes={shapes}
          onChangeShapes={setShapes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          bringToFront={bringToFront}
          sendToBack={sendToBack}
          backgroundColor={backgroundColor}
          stageRef={stageRef}
        />
      </div>
    </div>
  );
}

export default App
