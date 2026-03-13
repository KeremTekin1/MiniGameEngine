export class Skybox {
    constructor(gl) {
        this.gl = gl;
        
        const vsSource = `#version 300 es
        layout(location = 0) in vec3 aPosition;
        out vec3 vTexCoord;
        uniform mat4 uView;
        uniform mat4 uProjection;
        void main() {
            vTexCoord = aPosition;
            // Görüş matrisindeki pozisyonu (hareketi) sıfırlayacağız, sadece dönüş kalacak
            vec4 pos = uProjection * uView * vec4(aPosition, 1.0);
            // xyww hilesi: Derinliği (Z) her zaman en uzak (1.0) yapar.
            gl_Position = pos.xyww; 
        }
        `;

        const fsSource = `#version 300 es
        precision mediump float;
        in vec3 vTexCoord;
        out vec4 fragColor;
        uniform samplerCube uSkybox;
        void main() {
            fragColor = texture(uSkybox, vTexCoord);
        }
        `;

        this.program = this.createProgram(vsSource, fsSource);
        
        const vertices = new Float32Array([
            -1,  1, -1,  -1, -1, -1,   1, -1, -1,   1, -1, -1,   1,  1, -1,  -1,  1, -1,
            -1, -1,  1,  -1, -1, -1,  -1,  1, -1,  -1,  1, -1,  -1,  1,  1,  -1, -1,  1,
             1, -1, -1,   1, -1,  1,   1,  1,  1,   1,  1,  1,   1,  1, -1,   1, -1, -1,
            -1, -1,  1,  -1,  1,  1,   1,  1,  1,   1,  1,  1,   1, -1,  1,  -1, -1,  1,
            -1,  1, -1,   1,  1, -1,   1,  1,  1,   1,  1,  1,  -1,  1,  1,  -1,  1, -1,
            -1, -1, -1,  -1, -1,  1,   1, -1, -1,   1, -1, -1,  -1, -1,  1,   1, -1,  1
        ]);

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        const faces = [
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: 'assets/skybox/right.jpg' },
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: 'assets/skybox/left.jpg' },
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: 'assets/skybox/top.jpg' },
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: 'assets/skybox/bottom.jpg' },
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: 'assets/skybox/front.jpg' },
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: 'assets/skybox/back.jpg' }
        ];

        faces.forEach(face => {
            gl.texImage2D(face.target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([50, 50, 100, 255]));

            const image = new Image();
            image.src = face.url;
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                gl.texImage2D(face.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            };
        });
        
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        this.uViewLoc = gl.getUniformLocation(this.program, "uView");
        this.uProjLoc = gl.getUniformLocation(this.program, "uProjection");
    }

    draw(viewMatrix, projectionMatrix) {
        const gl = this.gl;
        gl.useProgram(this.program);

        const view = new Float32Array(viewMatrix);
        view[12] = 0; view[13] = 0; view[14] = 0;

        gl.uniformMatrix4fv(this.uViewLoc, false, view);
        gl.uniformMatrix4fv(this.uProjLoc, false, projectionMatrix);

        gl.bindVertexArray(this.vao);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        
        gl.depthFunc(gl.LEQUAL);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        gl.depthFunc(gl.LESS);
    }

    createProgram(vs, fs) {
        const gl = this.gl;
        const createShader = (type, src) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };
        const program = gl.createProgram();
        gl.attachShader(program, createShader(gl.VERTEX_SHADER, vs));
        gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(program);
        return program;
    }
}