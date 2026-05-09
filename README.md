## How to Run

1. Clone the repository
```bash
git clone https://github.com/LiClement0216/konva-react-app.git
cd konva-react-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open the app
- Visit the URL printed in your terminal (typically `http://localhost:5173/` for Vite).


## Problem Statement
  A simple graphic editor with basic geometrc elements

## Methodology
  To get a better understanding of the project, perplexity is used. It is asked to provide information on:
  -How web graphic editor is built in general (algorithms and framworks)
  -Suggestion on workflow and project structure
  -React Konva Stage + Layer + Transformer setup pattern
  -Using useImage hook for image loading
  -Stage.toDataURL configuration for export
  -Potential bugs and issues

  Based on the suggestion, **react-konva** framework is deployed.

  ### Structure:
  **App.tsx** renders SidePanel.tsx(tools) and CanvasStage.tsx(canvas)
    and handles states, storing existing object array of existing geometric element passed to children components.
    States:
    -shapes: array of shape objects (rect, ellipse, line, text, image)
    -selectedId: id of the currently selected shape
    -backgroundColor, canvasWidth, canvasHeight
    -A stageRef for export

  **CanvasStage.tsx** defines types of each geometric elements
    and renders the objects with the object array received as props.

  **[Element]Shape.tsx** define transformers of the specific type of elements and set reference to attach to objects.

  **SidePanel.tsx** receives handlers and states as props,
    and renders tools and the corresponding handlers to edit objects.

  ### Models
    -RectShape: type: 'rect', x, y, width, height, fill, strokeColor, strokeWidth, etc.
    -EllipseShape: type: 'ellipse', x, y, radiusX, radiusY, ...
    -LineShape: type: 'line', x, y, points, strokeColor, strokeWidth, ...
    -TextShape: type: 'text', x, y, text, fontSize, fontFamily, fill, fillColor, ...
    -ImageShape: type: 'image', x, y, width, height, imageUrl, lockAspect, opacity.

    Each types has a dedicated React component ([Element]Shape.tsx) that provides
      -Selection (onClick/onTap + selectedId)
      -Dragging (draggable + onDragEnd updating x, y)
      -Transformations (Transformer + onTransformEnd updating width, height, rotation)

    Specific tools on editing each type of elements:
      -Color selection
      -Stroke Color selection
      -Stroke Width selection
      -Numerical size editor
      -Shadow toggler
      -Opacity slider for ImageShape
      -Lock aspect ratio checkbox for ImageShape
      -Nodes adding and editing for LineShape by Group
      -Z-index Layering by changing object array sequence
      -Double click object to pull to top
      -Fix Ellipse to be Circle when pressing Ctrl during resizing

    Global tools:
      -Canvas size
      -Canvas fiiling color
      -Export canvas as PNG

## Evaluation
  Manually created and edited the elements to verify:
    -Transformer is attached to each objects
    -Mathmatics are working, by testing each rescaling ,rotations and drags
    -Resize handles are working
    -Tools in SidePanel are working
    -Nodes editing of LineShape is working, especially the coordinate system on Group 

  Manually created an image with the app by:
    -Adding all elements and testing each tools
    -Export the resultant image (canvas (3).png)

## Existing Problems
  -Shadow offset/color editing not provided
  -No freehand drawing
  -No undo/redo
  -No multiselect
  -Export limitations
  -No mobile device optimization
  -No keyboard shortcut for deleting objects etc.