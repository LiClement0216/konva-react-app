import type { Shape } from './CanvasStage';
import '../../App.css'
import './SidePanel.css'

type SidePanelProps = {
  shapes: Shape[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  canvasWidth: number;
  canvasHeight: number;
  setCanvasWidth: (width: number) => void;
  setCanvasHeight: (height: number) => void;
  onExport?: () => void;
};

export function SidePanel({ 
  shapes, 
  selectedId, 
  setSelectedId, 
  setShapes, 
  bringToFront, 
  sendToBack, 
  backgroundColor, 
  setBackgroundColor, 
  canvasWidth, 
  canvasHeight, 
  setCanvasWidth, 
  setCanvasHeight,
  onExport,
}: SidePanelProps) {
  const selectedShape = shapes.find(s => s.id === selectedId) ?? null;

  const addShape = (type: Shape['type']) => {
  const id = crypto.randomUUID();

  let newShape: Shape;

  if (type === 'rect') {
    newShape = {
      id,
      type: 'rect',
      x: 50,
      y: 50,
      width: 120,
      height: 80,
      fill: 'orange',
      rotation: 0,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.5,
      strokeColor: 'black',
      strokeWidth: 0,
    };
  } 
  else if (type === 'ellipse') {
    newShape = {
      id,
      type: 'ellipse',
      x: 200,
      y: 100,
      radiusX: 60,
      radiusY: 40,
      fill: 'green',
      rotation: 0,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.5,
      strokeColor: 'black',
      strokeWidth: 0,
    };
  } 
  else if (type === 'line') {
    newShape = {
      id,
      type: 'line',
      x: 100,
      y: 100,
      points: [0, 0, 150, 0],
      strokeColor: 'black',
      strokeWidth: 2,
      fill: '',
      rotation: 0,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.5,
    };
  } 
  else {
    newShape = {
      id,
      type: 'text',
      x: 100,
      y: 100,
      text: 'New text',
      fontSize: 20,
      fontFamily: 'Arial',
      fill: 'black',
      rotation: 0,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.5,
      width: undefined,
      align: 'left',
      fillColor: 'black',
    };
  }

  setShapes(prev => [...prev, newShape]);
    setSelectedId(id);
  };

  const updateShape = (partial: Partial<Shape>) => {
    if (!selectedId) return;
    setShapes(prev =>
        prev.map(s => (s.id === selectedId ? { ...s, ...partial } as Shape : s))
    );
  };

  const deleteShape = () => {
    if (!selectedId) return;
    setShapes(prev => prev.filter(s => s.id !== selectedId));
    setSelectedId(null);
  };

  const currentFillColor =
    selectedShape?.type === 'text'
    ? selectedShape.fillColor
    : selectedShape?.type === 'line'
    ? selectedShape.strokeColor ?? '#000000'
    : selectedShape?.fill ?? '#000000';


  const currentStrokeColor = selectedShape?.strokeColor ?? '#000000';
  const currentStrokeWidth = selectedShape?.strokeWidth ?? 0;


  const handleColorChange = (color: string) => {
    if (!selectedShape) return;
    setShapes(prev =>
      prev.map(shape => {
        if (shape.id === selectedShape.id) {
          if (shape.type === 'text') {
            return { ...shape, fillColor: color };
          } else if (shape.type === 'line') {
            return { ...shape, strokeColor: color };
          } else {
            return { ...shape, fill: color };
          }
        }
        return shape;
      })
    );
  };

  const handleStrokeColorChange = (color: string) => {
    if (!selectedShape) return;
    setShapes(prev =>
      prev.map(shape => {
        if (shape.id === selectedShape.id) {
          if (shape.type === 'line') {
            return { ...shape, strokeColor: color };
          } else {
            return { ...shape, strokeColor: color };
          }
        }
        return shape;
      })
    );
  };

  const handleStrokeWidthChange = (width: number) => {
    if (!selectedShape) return;
    setShapes(prev =>
      prev.map(shape => {
        if (shape.id === selectedShape.id) {
          return { ...shape, strokeWidth: width };
        }
        return shape;
      })
    );
  };

  const handleToggleShadow = (enabled: boolean) => {
    if (!selectedShape) return;
    setShapes(prev =>
      prev.map(shape => {
        if (shape.id === selectedShape.id) {
          if (enabled) {
            return {
              ...shape,
              shadowColor: 'black',
              shadowBlur: 10,
              shadowOffset: { x: 0, y: 0 },
              shadowOpacity: 0.5,
            };
          } else {
            return {
              ...shape,
              shadowBlur: 0,
            };
          }
        }
        return shape;
      })
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;

      const img = new window.Image();
      img.onload = () => {
        const naturalWidth = img.width || 200;
        const naturalHeight = img.height || 200;

        const id = crypto.randomUUID();
        const newShape: Shape = {
          id,
          type: 'image',
          x: 100,
          y: 100,
          width: naturalWidth,
          height: naturalHeight,
          fill: '',
          rotation: 0,
          imageUrl: src,
          lockAspect: true,
          opacity: 1,
        };

        setShapes(prev => [...prev, newShape]);
        setSelectedId(id);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="side-panel">
      <h2 className="side-panel__title">Graphic Editor</h2>

      <div className="side-panel__section side-panel__section--tight">
        <div>Canvas size:</div>
        <label>Width: </label>
        <input
          type="number"
          value={canvasWidth}
          onChange={(e) => setCanvasWidth(Number(e.target.value))}
          min={1}
        />
        <br />
        <label>Height: </label>
        <input
          type="number"
          value={canvasHeight}
          onChange={(e) => setCanvasHeight(Number(e.target.value))}
          min={1}
        />
      </div>

      <div className="side-panel__section">
        <label>Background color: </label>
        <input
          type="color"
          value={backgroundColor}
          onChange={e => setBackgroundColor(e.target.value)}
        />
      </div>

      <div className="side-panel__section">
        <button onClick={() => onExport && onExport()}>
          Export canvas as PNG
        </button>
      </div>

      <div className="side-panel__section">
        <label>Upload image: </label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <div className="side-panel__section">
        <button onClick={() => addShape('rect')}>Rect</button>
        <button onClick={() => addShape('ellipse')}>Ellipse</button>
        <button onClick={() => addShape('line')}>Line</button>
        <button onClick={() => addShape('text')}>Text</button>
      </div>

      {selectedShape && (
        <div style={{ marginTop: 18 }}>
          <div>Selected: {selectedShape.type}</div>

          {selectedShape.type !== 'text' &&
            selectedShape.type !== 'image' && (
              <div className="side-panel__section">
                <label>Toggle shadow</label>
                <br />
                <button onClick={() => handleToggleShadow(true)}>
                  Enable Shadow
                </button>
                <button onClick={() => handleToggleShadow(false)}>
                  Disable Shadow
                </button>
              </div>
            )}

          {selectedShape.type !== 'image' && (
            <div className="side-panel__section">
              <label>Color: </label>
              <input
                type="color"
                value={currentFillColor}
                onChange={e => handleColorChange(e.target.value)}
              />
            </div>
          )}

          {selectedShape.type !== 'text' &&
            selectedShape.type !== 'line' &&
            selectedShape.type !== 'image' && (
              <div className="side-panel__section">
                <label>Stroke color: </label>
                <input
                  type="color"
                  value={currentStrokeColor}
                  onChange={e => handleStrokeColorChange(e.target.value)}
                />
              </div>
            )}

          {selectedShape.type !== 'text' &&
            selectedShape.type !== 'image' && (
              <div className="side-panel__section">
                <label>Stroke width: </label>
                <input
                  type="number"
                  value={currentStrokeWidth}
                  min={0}
                  onChange={e =>
                    handleStrokeWidthChange(Number(e.target.value))
                  }
                />
              </div>
            )}

          {selectedShape.type === 'rect' && (
            <div className="side-panel__section">
              <div>Size:</div>
              <label>Width: </label>
              <input
                type="number"
                min={1}
                value={selectedShape.width}
                onChange={e =>
                  updateShape({ width: Number(e.target.value) } as Shape)
                }
              />
              <br />
              <label>Height: </label>
              <input
                type="number"
                min={1}
                value={selectedShape.height}
                onChange={e =>
                  updateShape({ height: Number(e.target.value) } as Shape)
                }
              />
            </div>
          )}

          {selectedShape.type === 'image' && (
            <div className="side-panel__section">
              <div>Size:</div>
              <label>Width: </label>
              <input
                type="number"
                min={1}
                value={selectedShape.width}
                onChange={e => {
                  const newWidth = Number(e.target.value);
                  if (selectedShape.lockAspect) {
                    const ratio =
                      selectedShape.width / selectedShape.height || 1;
                    const newHeight = Math.round(newWidth / ratio);
                    updateShape({
                      width: newWidth,
                      height: newHeight,
                    } as Shape);
                  } else {
                    updateShape({ width: newWidth } as Shape);
                  }
                }}
              />
              <br />
              <label>Height: </label>
              <input
                type="number"
                min={1}
                value={selectedShape.height}
                onChange={e => {
                  const newHeight = Number(e.target.value);
                  if (selectedShape.lockAspect) {
                    const ratio =
                      selectedShape.width / selectedShape.height || 1;
                    const newWidth = Math.round(newHeight * ratio);
                    updateShape({
                      width: newWidth,
                      height: newHeight,
                    } as Shape);
                  } else {
                    updateShape({ height: newHeight } as Shape);
                  }
                }}
              />
            </div>
          )}

          {selectedShape?.type === 'image' && (
            <div className="side-panel__section">
              <label>
                <input
                  type="checkbox"
                  checked={selectedShape.lockAspect ?? true}
                  onChange={e =>
                    updateShape({
                      lockAspect: e.target.checked,
                    } as Shape)
                  }
                />
                {' '}Lock aspect ratio
              </label>
            </div>
          )}

          {selectedShape?.type === 'image' && (
            <div className="side-panel__section">
              <div>Opacity:</div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={selectedShape.opacity ?? 1}
                onChange={e =>
                  updateShape({
                    opacity: Number(e.target.value),
                  } as Shape)
                }
              />
              <input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={selectedShape.opacity ?? 1}
                onChange={e =>
                  updateShape({
                    opacity: Number(e.target.value),
                  } as Shape)
                }
                className="side-panel__opacity-number"
              />
            </div>
          )}

          {selectedShape.type === 'ellipse' && (
            <div className="side-panel__section">
              <div>Ellipse radii:</div>
              <label>Radius X: </label>
              <input
                type="number"
                min={1}
                value={selectedShape.radiusX}
                onChange={e =>
                  updateShape({
                    radiusX: Number(e.target.value),
                  } as Shape)
                }
              />
              <br />
              <label>Radius Y: </label>
              <input
                type="number"
                min={1}
                value={selectedShape.radiusY}
                onChange={e =>
                  updateShape({
                    radiusY: Number(e.target.value),
                  } as Shape)
                }
              />
            </div>
          )}

          {selectedShape.type === 'text' && (
            <div className="side-panel__section">
              <div>Text content:</div>
              <textarea
                value={selectedShape.text}
                onChange={e =>
                  updateShape({ text: e.target.value })
                }
                className="side-panel__textarea"
              />
              <div style={{ marginTop: 8 }}>
                <label>Font size: </label>
                <input
                  type="number"
                  min={8}
                  max={200}
                  value={selectedShape.fontSize}
                  onChange={e =>
                    updateShape({
                      fontSize: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}

          {selectedShape && (
            <div className="side-panel__button-row">
              <button onClick={() => bringToFront(selectedShape.id)}>
                Bring to front
              </button>
              <button onClick={() => sendToBack(selectedShape.id)}>
                Send to back
              </button>
            </div>
          )}

          {selectedShape && (
            <div className="side-panel__button-row">
              <button onClick={() => deleteShape()}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}