
class MyRectangle extends CGFobject {
	/**
	 * /**
	 * MyRectangle
	 * @constructor 
	 * @param {CGFscene} scene - Reference to MyScene object
	 * @param {string} id id of primitive
	 * @param {float} x1 Coord x of first edge
	 * @param {float} x2 Coord x of second edge 
	 * @param {float} y1 Coord y of first edge
	 * @param {float} y2 Coord y on second edge
	 */
	constructor(scene, id, x1, x2, y1, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.u_length = 1;
		this.v_length = 1;

		this.initBuffers();
	}
	
	/**
	 * Initiate Rectangle buffers, vertices, indeces and normals and textcoords
	 */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {vec3} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
	/**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * @param {Array} coords - Array of texture coordinates
     */
	changeTexCoords(u,v){
		if(u == this.u_length && v == this.v_length)
            return;
		for(var a = 0;a < this.texCoords.length/2;a++){
			this.texCoords[2*a] = this.texCoords[2*a] * this.u_length / u ;
			this.texCoords[2*a+1] = this.texCoords[2*a+1] * this.v_length / v ;
		}
		this.u_length = u;
		this.v_length = v;
		this.updateTexCoordsGLBuffers();
	}
	    /**
	 * Display object in scene
	 */
	display(){
        this.enableNormalViz();
        super.display();
    }
}

