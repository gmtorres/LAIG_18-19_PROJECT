class MyPatch extends CGFobject{
    /**
     * @constructor
     * @param {*} scene Reference tp scene object
     * @param {*} id Id of primitive
     * @param {*} npointsU Number of control points in the u axis
     * @param {*} npointsV Number of control points in the V axis
     * @param {*} npartsU Number of parts in the U axis
     * @param {*} npartsV Number of parts in the V axis
     * @param {*} controlPoints Control Points, number equal to nPointsU * nPointsV
     */
    constructor(scene, id,npointsU,npointsV, npartsU, npartsV,controlPoints) {
        super(scene);
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;

        this.initBuffers();
    }

    /**
	 * Initiate Patch buffers, vertices, indeces and normals and textcoords
	 */
    initBuffers(){

        var nurbsSurface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface );
    }


    /**
	 * Display object in scene
	 */
    display(){
        this.obj.display();
    }


    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * Does not work in nurbs surface
     * @param {Array} coords - Array of texture coordinates
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