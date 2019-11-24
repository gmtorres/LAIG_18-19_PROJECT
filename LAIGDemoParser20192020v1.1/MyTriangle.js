
class MyTriangle extends CGFobject {
	/**
	 * 
	 * @param {CGFscene} scene Reference to MyScene object
	 * @param {string} id  Id of primitive
	 * @param {vec3} p1  Coords of point 1 of triangle
	 * @param {vec3} p2  Coords of point 2 of triangle
	 * @param {vec3} p3  Coords of point 3 of triangle
	 */
	constructor(scene, id, p1,p2,p3) {
		super(scene);
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;

		this.initBuffers();

		this.u_length = 1;
		this.v_length = 1;
	}

	/**
	 * Initiate Triangle buffers, vertices, indeces and normals and textcoords
	 */
	
	initBuffers() {
		this.vertices = this.p1.concat(this.p2.concat(this.p3));

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
        ];
        
        var v1 = [this.p1[0] - this.p2[0] ,this.p1[1] - this.p2[1] ,this.p1[2] - this.p2[2]];
        var v2 = [this.p1[0] - this.p3[0] ,this.p1[1] - this.p3[1] ,this.p1[2] - this.p3[2]];

        //cross product
        var a = v1[1] * v2[2] - v1[2] * v2[1];
        var b = -(v1[0] * v2[2] - v1[2] * v2[0]);
		var c = v1[0] * v2[1] - v1[1]*v2[0];
		
		var d = Math.sqrt(a*a+b*b+c*c);
		a/=d;
		b/=d;
		c/=d;

		//Facing Z positive
		this.normals = [
            a,b,c,
            a,b,c,
            a,b,c
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
        a = Math.sqrt(Math.pow(this.p1[0] - this.p2[0],2) + Math.pow(this.p1[1] - this.p2[1],2) + Math.pow(this.p1[2] - this.p2[2],2));
        b = Math.sqrt(Math.pow(this.p3[0] - this.p2[0],2) + Math.pow(this.p3[1] - this.p2[1],2) + Math.pow(this.p3[2] - this.p2[2],2));
		c = Math.sqrt(Math.pow(this.p1[0] - this.p3[0],2) + Math.pow(this.p1[1] - this.p3[1],2) + Math.pow(this.p1[2] - this.p3[2],2));
		var m = Math.max(a,b,c);
		a = a/m;
		b = b/m;
		c = c/m;
		var alpha = Math.acos((a*a-b*b+c*c)/(2*a*c));
		
		this.texCoords = [
			0, 2,
			2*a, 2,
			2*(1-c*Math.cos(alpha)),2*( 1 - c*Math.sin(alpha))
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
	 * Changes the object texCoords
	 * @param {float} u Lenght in u axis
	 * @param {float} v Length in v axis
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
        //this.enableNormalViz();
        super.display();
    }
}

