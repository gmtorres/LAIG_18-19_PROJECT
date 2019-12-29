class MyPatch extends CGFobject{
    /**
     * @constructor
     * @param {CGFscene} scene Reference tp scene object
     * @param {string} id Id of primitive
     * @param {int} npointsU Number of control points in the u axis
     * @param {int} npointsV Number of control points in the V axis
     * @param {int} npartsU Number of parts in the U axis
     * @param {int} npartsV Number of parts in the V axis
     * @param {int} controlPoints Control Points, number equal to nPointsU * nPointsV
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
    
    enablePickable(){
        this.scene.registerForPick(this.uniqueID,this);
    }
    disablePickable(){
        this.scene.clearPickRegistration();
    }
}