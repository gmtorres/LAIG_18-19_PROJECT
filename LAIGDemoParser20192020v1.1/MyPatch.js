class MyPatch extends CGFobject{
    constructor(scene, id,npointsU,npointsV, npartsU, npartsV,controlPoints) {
        super(scene);
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;

        this.initBuffers();
    }
    initBuffers(){

        var nurbsSurface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface );
    }
    display(){
        this.obj.display();
    }
    changeTexCoords(u,v){
		
	}               
}