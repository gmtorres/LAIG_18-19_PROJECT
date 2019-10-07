/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1,y1,z1,x2,y2,z2,x3,y3,z3) {
		super(scene);
		this.p1 = [x1,y1,z1];
		this.p2 = [x2,y2,z2];
		this.p3 = [x3,y3,z3];

		this.initBuffers();

		this.u_length = 1;
		this.v_length = 1;
	}
	
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
			0, 1,
			a, 1,
			1-c*Math.cos(alpha), 1 - c*Math.sin(alpha)
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
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
	display(){
        //this.enableNormalViz();
        super.display();
    }
}

