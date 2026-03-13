\# WebGL Mini Game Engine



A browser-based 3D mini game engine developed using WebGL2, JavaScript, and HTML.



\## 🎮 Project Overview



This project is a lightweight WebGL mini game engine created as part of an academic graphics programming project.



It demonstrates the fundamental components of a simple 3D engine, including camera systems, shader management, primitive mesh generation, texture loading, skybox rendering, and OBJ model loading. The engine is structured in a modular way to separate rendering logic, object management, and scene control.



\## 🛠 Technologies



\- WebGL2

\- JavaScript (ES6 Modules)

\- HTML5

\- GLSL (Shaders)

\- glMatrix

\- lil-gui



\## ✨ Features



\- Camera movement and mouse look

\- Shader-based rendering pipeline

\- Primitive mesh generation

\- Texture support

\- Skybox rendering

\- OBJ model loading

\- Object transform controls

\- Lighting controls

\- Rotation toggle

\- Mini map support

\- GUI panel for interactive parameters



\## 📁 Project Structure



```text

MiniGameEngine/

├── public\_html/

│   ├── assets/

│   │   ├── box.jpg

│   │   ├── cube.obj

│   │   └── skybox/

│   │       ├── back.jpg

│   │       ├── bottom.jpg

│   │       ├── front.jpg

│   │       ├── left.jpg

│   │       ├── right.jpg

│   │       └── top.jpg

│   ├── libs/

│   │   ├── gl-matrix-min.js

│   │   └── lil-gui.module.min.js

│   ├── src/

│   │   ├── camera.js

│   │   ├── loader.js

│   │   ├── main.js

│   │   ├── mesh.js

│   │   ├── object3d.js

│   │   ├── primitives.js

│   │   ├── shader.js

│   │   ├── skybox.js

│   │   └── texture.js

│   └── index.html

├── package.json

├── Gruntfile.js

├── gulpfile.js

└── README.md

text```

📦 Libraries

The project uses the following external libraries:



glMatrix – vector and matrix operations



lil-gui – graphical user interface for engine controls



These libraries are located in the public\_html/libs directory.



🖼 Assets

The public\_html/assets folder contains resources used in the project:



box.jpg – texture file used on objects



cube.obj – sample 3D model



skybox/ – six images used for environment skybox rendering



🎯 Engine Components

The engine is divided into modular source files:



camera.js → camera movement and view control



loader.js → OBJ model loader



mesh.js → mesh creation and rendering



object3d.js → transformable 3D object structure



primitives.js → primitive geometry generation



shader.js → shader creation and management



skybox.js → skybox rendering system



texture.js → texture loading and usage



main.js → main scene setup and rendering loop



🎮 Controls

W / A / S / D → Move camera



Space → Move upward



Shift → Move downward



Mouse Drag → Rotate camera



T → Toggle texture mode



C → Change rotation direction



🚀 How to Run

Because this project loads assets such as textures, skybox images, and OBJ files, it should be run using a local server.



Option 1: NetBeans

Run the project directly using NetBeans.



Option 2: VS Code Live Server

Open public\_html/index.html with the Live Server extension.



Option 3: Python HTTP Server

Run the following command inside the public\_html directory:



python -m http.server 8000

Then open:



http://localhost:8000

🎓 Academic Context

This project was developed as part of a university graphics / game engine coursework project.

It focuses on fundamental concepts of real-time 3D rendering, scene management, and interactive graphics programming using WebGL.



👤 Author

Kerem Tekin





