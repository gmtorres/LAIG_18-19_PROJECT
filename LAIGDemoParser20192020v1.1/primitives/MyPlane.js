
class MyPlane extends CGFobject {
    /**
     * @constructor
     * @param {CGFScene} scene Reference to Scene object
     * @param {string} id Id of primitive
     * @param {int} npartsU Number of parts in the U axis
     * @param {int} npartsV Number of parts in the V axis
     */
	constructor(scene, id, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.dU = 1/npartsU;
        this.dV = 1/npartsV;    
        this.id = id;
        this.u_length = 1;
		this.v_length = 1;

        this.initBuffers();
    }
    /**
	 * Initiate Plane buffers, vertices, indeces and normals and textcoords
	 */
    initBuffers(){
        var vertices = [
            [
                [-0.5, 0, -0.5,1],	//0
			    [+0.5, 0, -0.5,1]	//1
            ],
            [
                [-0.5, 0, +0.5,1],	//2
                [+0.5, 0, +0.5,1],	//3
            ]
        ];


        var nurbsSurface = new CGFnurbsSurface(1, 1, vertices);
        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface );
    }
    /**
	 * Display object in scene
	 */
    display(){
        this.obj.display();
        this.obj.enableNormalViz();
    }
    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * Does not work in nurbs surface
     * @param {vec3} coords - Array of texture coordinates
     */
    changeTexCoords(u,v){
		if(u == this.u_length && v == this.v_length)
            return;
		for(var a = 0;a < this.obj.texCoords.length/2;a++){
			this.obj.texCoords[2*a] = this.obj.texCoords[2*a] * this.u_length / u ;
			this.obj.texCoords[2*a+1] = this.obj.texCoords[2*a+1] * this.v_length / v ;
		}
		this.u_length = u;
		this.v_length = v;
		this.updateTexCoordsGLBuffers();
	}

}