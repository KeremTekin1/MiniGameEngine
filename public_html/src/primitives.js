export class Primitives {
    
    static createCube() {
        const vertices = [
            -0.5, -0.5,  0.5,   0.5, -0.5,  0.5,   0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
             0.5, -0.5, -0.5,  -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,   0.5,  0.5, -0.5,
            -0.5,  0.5,  0.5,   0.5,  0.5,  0.5,   0.5,  0.5, -0.5,  -0.5,  0.5, -0.5,
            -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,   0.5, -0.5,  0.5,  -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,   0.5, -0.5, -0.5,   0.5,  0.5, -0.5,   0.5,  0.5,  0.5,
            -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5
        ];

        const uvs = [
            0, 0,  1, 0,  1, 1,  0, 1,
            0, 0,  1, 0,  1, 1,  0, 1,
            0, 0,  1, 0,  1, 1,  0, 1,
            0, 0,  1, 0,  1, 1,  0, 1,
            0, 0,  1, 0,  1, 1,  0, 1,
            0, 0,  1, 0,  1, 1,  0, 1
        ];

        const normals = [
            0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
            0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
            0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
            0,-1, 0,  0,-1, 0,  0,-1, 0,  0,-1, 0,
            1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
           -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
        ];

        const indices = [
             0,  1,  2,    0,  2,  3,
             4,  5,  6,    4,  6,  7,
             8,  9, 10,    8, 10, 11,
            12, 13, 14,   12, 14, 15,
            16, 17, 18,   16, 18, 19,
            20, 21, 22,   20, 22, 23
        ];

        return { vertices, uvs, normals, indices };
    }

    static createSphere(radius = 1.0, latBands = 30, longBands = 30) {
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        for (let lat = 0; lat <= latBands; lat++) {
            const theta = lat * Math.PI / latBands;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let long = 0; long <= longBands; long++) {
                const phi = long * 2 * Math.PI / longBands;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;

                const u = 1 - (long / longBands);
                const v = 1 - (lat / latBands);

                normals.push(x, y, z);
                uvs.push(u, v);
                vertices.push(radius * x, radius * y, radius * z);
            }
        }

        for (let lat = 0; lat < latBands; lat++) {
            for (let long = 0; long < longBands; long++) {
                const first = (lat * (longBands + 1)) + long;
                const second = first + longBands + 1;
                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        return { vertices, uvs, normals, indices };
    }

    static createCylinder(radius = 0.5, height = 2.0, segments = 32) {
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * 2 * Math.PI;
            const x = Math.cos(theta);
            const z = Math.sin(theta);
            const u = i / segments;

            vertices.push(x * radius, height / 2, z * radius);
            normals.push(x, 0, z);
            uvs.push(u, 1);

            vertices.push(x * radius, -height / 2, z * radius);
            normals.push(x, 0, z);
            uvs.push(u, 0);
        }

        for (let i = 0; i < segments; i++) {
            const top1 = i * 2;
            const bottom1 = i * 2 + 1;
            const top2 = top1 + 2;
            const bottom2 = bottom1 + 2;

            indices.push(top1, bottom1, top2);
            indices.push(bottom1, bottom2, top2);
        }

        const topCenterIndex = vertices.length / 3;
        
        vertices.push(0, height / 2, 0);
        normals.push(0, 1, 0);
        uvs.push(0.5, 0.5);

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * 2 * Math.PI;
            const x = Math.cos(theta);
            const z = Math.sin(theta);

            vertices.push(x * radius, height / 2, z * radius);
            normals.push(0, 1, 0);
            uvs.push((x * 0.5) + 0.5, (z * 0.5) + 0.5);
        }

        for (let i = 0; i < segments; i++) {
            indices.push(topCenterIndex, topCenterIndex + 1 + i, topCenterIndex + 1 + i + 1);
        }

        const bottomCenterIndex = vertices.length / 3;

        vertices.push(0, -height / 2, 0);
        normals.push(0, -1, 0);
        uvs.push(0.5, 0.5);

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * 2 * Math.PI;
            const x = Math.cos(theta);
            const z = Math.sin(theta);

            vertices.push(x * radius, -height / 2, z * radius);
            normals.push(0, -1, 0);
            uvs.push((x * 0.5) + 0.5, (z * 0.5) + 0.5);
        }

        for (let i = 0; i < segments; i++) {
            indices.push(bottomCenterIndex, bottomCenterIndex + 1 + i + 1, bottomCenterIndex + 1 + i);
        }

        return { vertices, uvs, normals, indices };
    }

    static createHexagon(radius = 0.6, height = 1.2) {
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];
        const sides = 6;

        for (let i = 0; i < sides; i++) {
            const theta1 = (i / sides) * 2 * Math.PI;
            const theta2 = ((i + 1) / sides) * 2 * Math.PI;

            const x1 = Math.cos(theta1) * radius;
            const z1 = Math.sin(theta1) * radius;
            const x2 = Math.cos(theta2) * radius;
            const z2 = Math.sin(theta2) * radius;

            const midTheta = (theta1 + theta2) / 2;
            const nx = Math.cos(midTheta);
            const nz = Math.sin(midTheta);

            vertices.push(x1, height/2, z1);   
            vertices.push(x2, height/2, z2);   
            vertices.push(x2, -height/2, z2);  
            vertices.push(x1, -height/2, z1);  

            normals.push(nx, 0, nz,  nx, 0, nz,  nx, 0, nz,  nx, 0, nz);
            uvs.push(0, 1,  1, 1,  1, 0,  0, 0);

            const base = i * 4;
            indices.push(base, base+1, base+2);
            indices.push(base, base+2, base+3);
        }

        let centerIdx = vertices.length / 3;
        
        vertices.push(0, height/2, 0);
        normals.push(0, 1, 0);
        uvs.push(0.5, 0.5);

        for (let i = 0; i <= sides; i++) {
            const theta = (i / sides) * 2 * Math.PI;
            vertices.push(Math.cos(theta)*radius, height/2, Math.sin(theta)*radius);
            normals.push(0, 1, 0);
            uvs.push((Math.cos(theta)*0.5)+0.5, (Math.sin(theta)*0.5)+0.5);
        }
        for (let i = 0; i < sides; i++) {
            indices.push(centerIdx, centerIdx+1+i, centerIdx+2+i);
        }

        centerIdx = vertices.length / 3;
        vertices.push(0, -height/2, 0);
        normals.push(0, -1, 0);
        uvs.push(0.5, 0.5);

        for (let i = 0; i <= sides; i++) {
            const theta = (i / sides) * 2 * Math.PI;
            vertices.push(Math.cos(theta)*radius, -height/2, Math.sin(theta)*radius);
            normals.push(0, -1, 0);
            uvs.push((Math.cos(theta)*0.5)+0.5, (Math.sin(theta)*0.5)+0.5);
        }
        for (let i = 0; i < sides; i++) {
            indices.push(centerIdx, centerIdx+2+i, centerIdx+1+i);
        }

        return { vertices, uvs, normals, indices };
    }
}