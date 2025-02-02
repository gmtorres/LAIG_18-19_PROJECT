/**
 * MyTorus
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} r1 - Outer radius
 * @param {float} r2 - Inner radius
 * @param {int} sl - Number of loops
 * @param {int} lp - Number of slices
 */
class MyTorus extends CGFobject {
    constructor(scene, id, r1,r2, sl, lp) {
        super(scene);
        this.r1 = r1;
        this.r2 = r2;
        this.sl = sl;
        this.lp = lp;

        this.dp = 2 * Math.PI / sl;
        this.dt = 2 * Math.PI / lp;

        this.u_length = 1;
		this.v_length = 1;

        this.initBuffers();
    }

    /**
	 * Initiate Torus buffers, vertices, indeces and normals and textcoords
	 */
    initBuffers() {
        this.vertices = [];

		//Counter-clockwise reference of vertices
		this.indices = [];

		//Facing Z positive
        this.normals = [];

        this.texCoords = [];

        var s1 = this.sl + 1;
        var l1 = this.lp + 1;
        
        for(var phi = 0,slices = 0; slices < s1 ; phi+=this.dp,slices+=1){
            for(var thetha = 0 + Math.PI, loops = 0; loops<l1; thetha+= this.dt,loops+=1){
                var R = (this.r1 + this.r2 * Math.cos(thetha));

                var nx = Math.cos(phi)*Math.cos(thetha);
                var ny = Math.sin(phi)*Math.cos(thetha);
                var nz = Math.sin(thetha);
                
                this.normals.push(nx,ny,nz);//TODO:: Check if normals are correct calculated
                this.vertices.push(R*Math.cos(phi),R*Math.sin(phi),this.r2 * Math.sin(thetha));  

                this.texCoords.push(slices/(s1), loops/(l1));

                this.indices.push(slices*(l1)+ (loops + 1) % (l1),slices*(l1)+ loops , ((slices+1)%(s1))*(l1)+ loops);
                this.indices.push(slices*(l1)+ (loops + 1) % (l1),((slices+1)%(s1))*(l1)+ loops,((slices+1)%(s1))*(l1)+ (loops + 1) % (l1));
                

            }
        }

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
    enablePickable(){
        this.scene.registerForPick(this.uniqueID,this);
    }
    disablePickable(){
        this.scene.clearPickRegistration();
    }
}

