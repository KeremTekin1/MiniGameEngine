export class Shader {
    constructor(gl, vertexSource, fragmentSource) {
        this.gl = gl;
        this.program = this.createProgram(vertexSource, fragmentSource);
    }

    createProgram(vSource, fSource) {
        const gl = this.gl;
        
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fSource);

        if (!vertexShader || !fragmentShader) return null;

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Shader Program Link Hatası:", gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader Derleme Hatası:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    use() {
        if (this.program) {
            this.gl.useProgram(this.program);
        }
    }
    
    getUniformLocation(name) {
        return this.gl.getUniformLocation(this.program, name);
    }
    
    getAttribLocation(name) {
        return this.gl.getAttribLocation(this.program, name);
    }
}