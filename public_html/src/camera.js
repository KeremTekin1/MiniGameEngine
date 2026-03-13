const { vec3, mat4 } = glMatrix;

export class Camera {
    constructor(canvas, position = [0, 0, 3]) {
        this.position = vec3.fromValues(...position);
        this.front = vec3.fromValues(0, 0, -1);
        this.up = vec3.fromValues(0, 1, 0);
        this.right = vec3.create();

        this.yaw = -90;
        this.pitch = 0;

        this.speed = 0.1;
        this.sensitivity = 0.2;

        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        this.isDragging = false;
        canvas.addEventListener('mousedown', () => this.isDragging = true);
        window.addEventListener('mouseup', () => this.isDragging = false);
        window.addEventListener('mousemove', (e) => this.handleMouse(e));

        this.updateVectors();
    }

    handleMouse(e) {
        if (!this.isDragging) return;

        this.yaw += e.movementX * this.sensitivity;
        this.pitch -= e.movementY * this.sensitivity;

        if (this.pitch > 89.0) this.pitch = 89.0;
        if (this.pitch < -89.0) this.pitch = -89.0;

        this.updateVectors();
    }

    updateVectors() {
        const toRad = (deg) => deg * Math.PI / 180;

        const front = vec3.create();
        front[0] = Math.cos(toRad(this.yaw)) * Math.cos(toRad(this.pitch));
        front[1] = Math.sin(toRad(this.pitch));
        front[2] = Math.sin(toRad(this.yaw)) * Math.cos(toRad(this.pitch));
        
        vec3.normalize(this.front, front);
        
        vec3.cross(this.right, this.front, [0, 1, 0]);
        vec3.normalize(this.right, this.right);
        
        vec3.cross(this.up, this.right, this.front);
        vec3.normalize(this.up, this.up);
    }

    update() {
        const speed = this.speed;

        if (this.keys['KeyW']) vec3.scaleAndAdd(this.position, this.position, this.front, speed);
        if (this.keys['KeyS']) vec3.scaleAndAdd(this.position, this.position, this.front, -speed);
        
        if (this.keys['KeyA']) vec3.scaleAndAdd(this.position, this.position, this.right, -speed);
        if (this.keys['KeyD']) vec3.scaleAndAdd(this.position, this.position, this.right, speed);

        if (this.keys['Space']) vec3.scaleAndAdd(this.position, this.position, [0, 1, 0], speed);
        if (this.keys['ShiftLeft']) vec3.scaleAndAdd(this.position, this.position, [0, 1, 0], -speed);
    }

    getViewMatrix() {
        const target = vec3.create();
        vec3.add(target, this.position, this.front);
        
        const view = mat4.create();
        mat4.lookAt(view, this.position, target, this.up);
        return view;
    }
}