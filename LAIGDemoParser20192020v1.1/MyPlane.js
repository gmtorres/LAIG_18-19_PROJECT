
class MyPlane extends CGFobject {
	constructor(scene, id, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.dU = 1/npartsU;
        this.dV = 1/npartsV;    

        this.u_length = 1;
		this.v_length = 1;

        this.initBuffers();
    }
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
    display(){
        this.obj.display();
        this.obj.enableNormalViz();
    }

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