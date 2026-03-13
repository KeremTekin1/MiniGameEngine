import { Mesh } from './mesh.js';

export class ObjLoader {
    static async load(gl, url) {
        const response = await fetch(url);
        const text = await response.text();

        const objPositions = [[0, 0, 0]];
        const objTexCoords = [[0, 0]];
        const objNormals = [[0, 0, 0]];

        const objVertexData = [
            objPositions,
            objTexCoords,
            objNormals
        ];

        let webglVertexData = [
            [],
            [],
            []
        ];

        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '' || line.startsWith('#')) continue;

            const elements = line.split(/\s+/);
            const type = elements.shift();

            if (type === 'v') {
                objPositions.push(elements.map(parseFloat));
            } else if (type === 'vn') {
                objNormals.push(elements.map(parseFloat));
            } else if (type === 'vt') {
                objTexCoords.push(elements.map(parseFloat));
            } else if (type === 'f') {
                const numTriangles = elements.length - 2;
                for (let tri = 0; tri < numTriangles; ++tri) {
                    this.addVertex(elements[0], objVertexData, webglVertexData);
                    this.addVertex(elements[tri + 1], objVertexData, webglVertexData);
                    this.addVertex(elements[tri + 2], objVertexData, webglVertexData);
                }
            }
        }

        const vertices = new Float32Array(webglVertexData[0]);
        const uvs = new Float32Array(webglVertexData[1]);
        const normals = new Float32Array(webglVertexData[2]);
        
        const indices = new Uint16Array(vertices.length / 3);
        for(let i=0; i<indices.length; i++) indices[i] = i;

        return new Mesh(gl, vertices, uvs, normals, indices);
    }

    static addVertex(vert, objVertexData, webglVertexData) {
        const ptn = vert.split('/');
      
        const pIdx = parseInt(ptn[0]);
        if (pIdx) webglVertexData[0].push(...objVertexData[0][pIdx]);

        const tIdx = parseInt(ptn[1]);
        if (tIdx) webglVertexData[1].push(...objVertexData[1][tIdx]);
        else webglVertexData[1].push(0, 0);

        const nIdx = parseInt(ptn[2]);
        if (nIdx) webglVertexData[2].push(...objVertexData[2][nIdx]);
        else webglVertexData[2].push(0, 1, 0);
    }
}