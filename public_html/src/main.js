import { Shader } from './shader.js';
import { Mesh } from './mesh.js';
import { Primitives } from './primitives.js';
import { Camera } from './camera.js';
import { Texture } from './texture.js';
import { Object3D } from './object3d.js';
import { ObjLoader } from './loader.js';
import { Skybox } from './skybox.js';
import GUI from '../libs/lil-gui.module.min.js';

const { mat4 } = glMatrix;

const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

if (!gl) alert("No WebGL 2.0!");

function fixScreen() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', fixScreen);
fixScreen();

let texMode = false; 
let spinVal = 0;   
let dir = 1;          

window.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
        texMode = !texMode;
    }
    if (e.key === 'c' || e.key === 'C') {
        dir *= -1; 
    }
});

const vsSource = `#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aTexCoord;
layout(location = 2) in vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uViewProjection;
out vec3 vNormal;
out vec3 vFragPos;
out vec2 vTexCoord;
void main() {
    vTexCoord = aTexCoord;
    vNormal = mat3(transpose(inverse(uModel))) * aNormal;
    vFragPos = vec3(uModel * vec4(aPosition, 1.0));
    gl_Position = uViewProjection * vec4(vFragPos, 1.0);
}
`;

const fsSource = `#version 300 es
precision mediump float;
in vec3 vNormal;
in vec3 vFragPos;
in vec2 vTexCoord;
uniform sampler2D uSampler;
uniform vec3 uLightPos;
uniform vec3 uViewPos;
uniform float uAmbientStrength;
uniform float uSpecularStrength;
uniform bool uIsSun; 
uniform bool uUseTexture;    
uniform vec3 uBaseColor;     
out vec4 fragColor;
void main() {
    vec3 objectColor;
    if (uUseTexture) {
        objectColor = texture(uSampler, vTexCoord).rgb;
    } else {
        objectColor = uBaseColor;
    }
    vec3 ambient = uAmbientStrength * vec3(1.0, 1.0, 1.0);
    float attenuation = 1.0; 
    if (!uIsSun) {
        float distance = length(uLightPos - vFragPos);
        float constant = 1.0;
        float linear = 0.09;
        float quadratic = 0.032;
        attenuation = 1.0 / (constant + linear * distance + quadratic * distance * distance);
    }
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0, 1.0, 1.0);
    vec3 viewDir = normalize(uViewPos - vFragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = uSpecularStrength * spec * vec3(1.0, 1.0, 1.0);
    diffuse *= attenuation;
    specular *= attenuation;
    vec3 result = (ambient + diffuse + specular) * objectColor;
    fragColor = vec4(result, 1.0);
}
`;

const myShader = new Shader(gl, vsSource, fsSource);
const myCam = new Camera(canvas, [1.5, 2, 8]); 
const boxImg = new Texture(gl, 'assets/box.jpg'); 
const sky = new Skybox(gl);

const objList = [];

function setObjVars(o) {
    o.scVal = 1.0;
    
    o.manualY = Math.random() * 6.28; 
    
    return o;
}

const d1 = Primitives.createCube();
const o1 = setObjVars(new Object3D(new Mesh(gl, d1.vertices, d1.uvs, d1.normals, d1.indices), boxImg, [-3, 0, 0]));
objList.push(o1);

const d2 = Primitives.createSphere(0.7, 30, 30);
const o2 = setObjVars(new Object3D(new Mesh(gl, d2.vertices, d2.uvs, d2.normals, d2.indices), boxImg, [0, 0, 0]));
objList.push(o2);

const d3 = Primitives.createCylinder(0.5, 1.5, 30);
const o3 = setObjVars(new Object3D(new Mesh(gl, d3.vertices, d3.uvs, d3.normals, d3.indices), boxImg, [3, 0, 0]));
objList.push(o3);

const d4 = Primitives.createHexagon(0.6, 1.5);
const o4 = setObjVars(new Object3D(new Mesh(gl, d4.vertices, d4.uvs, d4.normals, d4.indices), boxImg, [6, 0, 0]));
objList.push(o4);

const myGui = new GUI();
const conf = {
    lx: 2.0, ly: 5.0, lz: 4.0,
    amb: 0.2, spec: 0.5,
    isSun: false,
    
    selId: 3, 
    
    px: 6.0, py: 0.0, pz: 0.0,
    rx: 0.0, ry: 0.0, rz: 0.0,
    sc: 1.0,

    autoSpin: true,
    miniMap: true,
    
    addModel: async () => {
        try {
            console.log("Loading...");
            const d = await ObjLoader.load(gl, 'assets/cube.obj');
            
            const n = setObjVars(new Object3D(d, boxImg, [1.5, 3, 0]));
            
            objList.push(n);
            
            updateSel();
            conf.selId = objList.length - 1; 
            syncGui(n);
            console.log("Done");
        } catch (e) {
            console.error(e);
            alert("File error: assets/cube.obj");
        }
    }
};

function syncGui(o) {
    conf.px = o.position[0];
    conf.py = o.position[1];
    conf.pz = o.position[2];
    
    conf.rx = o.rotation[0];
    conf.ry = o.manualY; 
    conf.rz = o.rotation[2];
    
    if (o.scVal === undefined) o.scVal = 1.0;
    conf.sc = o.scVal; 
    
    myGui.controllersRecursive().forEach(c => c.updateDisplay());
}

const f1 = myGui.addFolder('Light Setup');
f1.add(conf, 'lx', -10, 10);
f1.add(conf, 'ly', -10, 10);
f1.add(conf, 'lz', -10, 10);
f1.add(conf, 'amb', 0, 1).name('Ambient');
f1.add(conf, 'spec', 0, 1).name('Specular');
f1.add(conf, 'isSun').name('Sun Light');

const f2 = myGui.addFolder('Object Edit');
let selCtrl = f2.add(conf, 'selId', 0, objList.length - 1, 1).name('Obj ID').listen();

selCtrl.onChange((v) => {
    const s = objList[Math.floor(v)];
    if(s) syncGui(s);
});

function updateSel() {
    selCtrl.max(objList.length - 1);
    selCtrl.updateDisplay();
}

f2.add(conf, 'px', -10, 10).name('Pos X').listen();
f2.add(conf, 'py', -5, 10).name('Pos Y').listen();
f2.add(conf, 'pz', -10, 10).name('Pos Z').listen();
f2.add(conf, 'rx', 0, 6.28).name('Rot X').listen();
f2.add(conf, 'ry', 0, 6.28).name('Rot Y').listen(); 
f2.add(conf, 'rz', 0, 6.28).name('Rot Z').listen();
f2.add(conf, 'sc', 0.1, 5.0).name('Size').listen();

const f3 = myGui.addFolder('General');
f3.add(conf, 'autoSpin').name('Auto Spin');
f3.add(conf, 'miniMap').name('Mini Map');
f3.add(conf, 'addModel').name('Load OBJ');

const u1 = myShader.getUniformLocation("uViewProjection");
const u2 = myShader.getUniformLocation("uLightPos");
const u3 = myShader.getUniformLocation("uViewPos");
const u4 = myShader.getUniformLocation("uAmbientStrength");
const u5 = myShader.getUniformLocation("uSpecularStrength");
const u6 = myShader.getUniformLocation("uSampler");
const u7 = gl.getUniformLocation(myShader.program, "uUseTexture");
const u8 = gl.getUniformLocation(myShader.program, "uBaseColor");
const pMat = mat4.create();

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.SCISSOR_TEST);

function doDraw(vMat, isMap = false) {
    if (isMap) mat4.perspective(pMat, 60 * Math.PI / 180, 1, 0.1, 100.0);
    else mat4.perspective(pMat, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100.0);

    sky.draw(vMat, pMat);
    myShader.use();
    
    gl.uniform1i(u7, texMode ? 1 : 0); 
    gl.uniform3f(u8, 1.0, 0.0, 0.0); 
    
    const vp = mat4.create();
    mat4.multiply(vp, pMat, vMat);
    gl.uniformMatrix4fv(u1, false, vp);
    
    gl.uniform3f(u2, conf.lx, conf.ly, conf.lz);
    gl.uniform1f(u4, conf.amb);
    gl.uniform1f(u5, conf.spec);
    gl.uniform1i(u6, 0);
    
    const us = gl.getUniformLocation(myShader.program, "uIsSun");
    gl.uniform1i(us, conf.isSun ? 1 : 0);

    if (isMap) gl.uniform3fv(u3, [0, 10, 0]);
    else gl.uniform3fv(u3, myCam.position);

    if (conf.autoSpin && !isMap) {
        spinVal += 0.01 * dir;
    }

    objList.forEach((o, i) => {
        const act = (i === Math.floor(conf.selId));
        
        if (o.scVal === undefined) o.scVal = 1.0;
        if (o.manualY === undefined) o.manualY = 0.0;

        if (act) {
            o.position[0] = conf.px;
            o.position[1] = conf.py;
            o.position[2] = conf.pz;
            
            o.rotation[0] = conf.rx;
            o.rotation[2] = conf.rz;
            
            o.scVal = conf.sc;
            o.manualY = conf.ry;
        } 

        o.rotation[1] = o.manualY + spinVal;

        o.update();
        
        mat4.scale(o.modelMatrix, o.modelMatrix, [o.scVal, o.scVal, o.scVal]);
        o.draw(myShader);
    });
}

function animLoop() {
    myCam.update();
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.scissor(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    doDraw(myCam.getViewMatrix(), false);
    
    if (conf.miniMap) {
        const s = 300;
        const x = 20; 
        const y = canvas.height - s - 20;
        gl.viewport(x, y, s, s);
        gl.scissor(x, y, s, s);
        gl.clear(gl.DEPTH_BUFFER_BIT); 
        
        const top = mat4.create();
        mat4.lookAt(top, [1.5, 10.0, 0], [1.5, 0, 0], [0, 0, -1]);
        doDraw(top, true);
    }
    requestAnimationFrame(animLoop);
}
animLoop();