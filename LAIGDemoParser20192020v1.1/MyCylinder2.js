
class MyCylinder2 extends CGFobject {
    /**
     * 
     * @param {CGFscene} scene Reference to MyScene 
     * @param {string} id ID of the cylinder  
     * @param {int} npartsU Number of parts of the U axis 
     * @param {int} npartsV  Number of parts of the V axis
     */
    constructor(scene, id, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.dU = 1/npartsU;
        this.dV = 1/npartsV;    

        this.initBuffers();
    }
    /**
     * Initializes all the buffers, coordinates and texture
     */
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
        this.obj1 = new CGFnurbsObject(this.scene, Math.round(this.npartsU/2), Math.round(this.npartsV/2), nurbsSurface );
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
        this.obj2 = new CGFnurbsObject(this.scene, Math.round(this.npartsU/2), Math.round(this.npartsV/2), nurbsSurface );

    }
    /**
     * Displays the object
     */
    display(){
        this.obj1.display();
        this.obj2.display();
    }
    /**
     * Usually it updates the texture coordinates, since this object uses nurbs to be defined , the texture coordinates ar automatically calcuted. Even though it's empty and not doing anything, the display in MyScene still calls for it as it is needed for other objects.  
     * @param {*} u 
     * @param {*} v 
     */
    changeTexCoords(u,v){
		
	}

}