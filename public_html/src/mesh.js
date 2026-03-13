export class Mesh {
    constructor(gl, vertices, uvs, normals, indices) {
        this.gl = gl;
        this.indexCount = indices.length;

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        const uvBo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        const nBo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(2);

        const ebo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
    }

    draw(shader) {
        const gl = this.gl;
        shader.use();
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}