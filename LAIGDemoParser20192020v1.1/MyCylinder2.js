class MyCylinder2 extends CGFobject {
	constructor(scene, id, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.dU = 1/npartsU;
        this.dV = 1/npartsV;    

        this.initBuffers();
    }
    initBuffers(){
        var vertices = [	// U = 0
            [ // V = 0..1;
                [ 1, 1.5, 0, 1 ],
                [ 1, -1.5, 0, 1 ]
            ],
            // U = 1
            [ // V = 0..1
                [ 1, 1.5, 4/3, 1 ],
                [ 1, - 1.5, 4/3, 1  ]							 
            ],
            [ // V = 0..1
                [ -1, 1.5, 4/3, 1 ],
                [ -1, - 1.5, 4/3, 1  ]							 
            ],
            // U = 2
            [ // V = 0..1							 
                [ -1, 1.5, 0, 1 ],
                [ -1, -1.5, 0, 1 ],
            ],  
        ];
        var nurbsSurface = new CGFnurbsSurface(3, 1, vertices);
        this.obj1 = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface );
        vertices = [	// U = 0

            [ // V = 0..1							 
                [ -1, 1.5, 0, 1 ],
                [ -1, -1.5, 0, 1 ],
            ],  
            // U = 1
            [ // V = 0..1
                [ -1, 1.5, -4/3, 1 ],
                [ -1, - 1.5, -4/3, 1  ]							 
            ],
            [ // V = 0..1
                [ 1, 1.5, -4/3, 1 ],
                [ 1, - 1.5, -4/3, 1  ]							 
            ],
            [ // V = 0..1;
                [ 1, 1.5, 0, 1 ],
                [ 1, -1.5, 0, 1 ]
            ],
            // U = 2
        ];
        var nurbsSurface = new CGFnurbsSurface(3, 1, vertices);
        this.obj2 = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface );

    }
    display(){
        this.obj1.display();
        this.obj2.display();
    }

    changeTexCoords(u,v){
		
	}

}