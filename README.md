# ⚙️ WebGL Mini Game Engine

A browser-based 3D mini game engine developed using WebGL2, JavaScript, and HTML.

## 🕹️ Project Overview

This project is a lightweight WebGL mini game engine created as part of an academic graphics programming project. 
It demonstrates the fundamental components of a simple 3D engine, including camera systems, shader management, primitive mesh generation, texture loading, skybox rendering, and OBJ model loading.

## 🛠️ Technologies

* WebGL2
* JavaScript (ES6 Modules)
* HTML5
* GLSL (Shaders)
* glMatrix
* lil-gui

## ✨ Features

* Camera movement and mouse look
* Shader-based rendering pipeline
* Primitive mesh generation & OBJ model loading
* Texture support & Skybox rendering
* Object transform & lighting controls
* Rotation toggle & Mini map support
* GUI panel for interactive parameters

## 📁 Project Structure

The project is organized as follows:

* `public_html/`
  * `assets/`: Contains resources like `box.jpg`, `cube.obj`, and the `skybox/` image suite.
  * `libs/`: External libraries (`gl-matrix-min.js`, `lil-gui.module.min.js`).
  * `src/`: Core engine source code.
  * `index.html`: Main entry point.
* `package.json`, `Gruntfile.js`, `gulpfile.js`: Build and package configuration.

## 🧩 Engine Components

The engine is divided into modular source files located in the `src/` directory:

* `camera.js` - Camera movement and view control
* `loader.js` - OBJ model loader
* `mesh.js` - Mesh creation and rendering
* `object3d.js` - Transformable 3D object structure
* `primitives.js` - Primitive geometry generation
* `shader.js` - Shader creation and management
* `skybox.js` - Skybox rendering system
* `texture.js` - Texture loading and usage
* `main.js` - Main scene setup and rendering loop

## 🎮 Controls

* **W / A / S / D**: Move camera
* **Space**: Move upward
* **Shift**: Move downward
* **Mouse Drag**: Rotate camera
* **T**: Toggle texture mode
* **C**: Change rotation direction

## 🚀 How to Run

Because this project loads local assets such as textures, skybox images, and OBJ files, it must be run using a local server.

**Option 1: NetBeans** Run the project directly using the NetBeans IDE.

**Option 2: VS Code Live Server** Open `public_html/index.html` and launch it with the Live Server extension.

**Option 3: Python HTTP Server** Open your terminal, navigate to the `public_html` directory, and run:

```bash
python -m http.server 8000