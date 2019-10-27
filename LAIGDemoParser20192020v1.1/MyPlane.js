
class MyPlane extends CGFobject {
	constructor(scene, id, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.dU = 1/npartsU;
        this.dV = 1/npartsV;    

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
    }

}