const { mat4, vec3 } = glMatrix;

export class Object3D {
    constructor(mesh, texture, position = [0, 0, 0]) {
        this.mesh = mesh;
        this.texture = texture;
        
        this.position = vec3.fromValues(...position);
        this.rotation = vec3.create();
        this.scale = vec3.fromValues(1, 1, 1);
        
        this.modelMatrix = mat4.create();
    }

    update() {
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
    }

    draw(shader) {
        if (this.texture) {
            this.texture.use(0);
        }
        
        const uModelLoc = shader.getUniformLocation("uModel");
        shader.gl.uniformMatrix4fv(uModelLoc, false, this.modelMatrix);
        this.mesh.draw(shader);
    }
}