/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param r - Radius
 * @param sl - Number of slices
 * @param st - Number of stacks
 */
class MySphere extends CGFobject {
    constructor(scene, id, r, sl, st) {
        super(scene);
        this.r = r;
        this.sl = sl;
        this.st = st;

        this.dp = 2 * Math.PI / sl;
        this.dt = Math.PI / (2 * st);

        this.u_length = 1;
		this.v_length = 1;

        this.initBuffers();
    }

    /**
	 * Initiate Sphere buffers, vertices, indeces and normals and textcoords
	 */
    initBuffers() {

        this.vertices = [];

		//Counter-clockwise reference of vertices
		this.indices = [];

		//Facing Z positive
        this.normals = [];

        this.texCoords = [];
    
        for (var phi = 0, slice = 0; slice < this.sl + 1; phi += this.dp , slice+=1) {
            //for (var thetha = Math.PI/2 - this.dt, stack = 0; thetha > -Math.PI/2; thetha -= this.dt , stack+=1) {
            for(var stack = 0 , thetha = Math.PI/2 ; stack < 2*this.st+1; thetha -= this.dt , stack+=1){
                var ct = Math.cos(thetha);
                var cp = Math.cos(phi);
                var st = Math.sin(thetha);
                var sp = Math.sin(phi);

                var nx = ct * cp;
                var ny = ct * sp;
                var nz = st;
                this.vertices.push(this.r * nx, this.r * ny, this.r * nz);
                this.normals.push(nx, ny, nz);

                this.texCoords.push(slice/(this.sl + 1) , stack / (2*this.st+1));

            }
        }

        for(var a = 0; a < this.sl ; a++){
            for(var b = 0; b <= (2*this.st-1); b++){
                this.indices.push(a * (2*this.st+1) + b , a * (2*this.st+1) + b + 1,(((a+1)%(this.sl+1)) * (2*this.st+1)) + b);
                this.indices.push( (((a+1)%(this.sl+1)) * (2*this.st+1)) + b , a * (2*this.st+1) + b + 1, (((a+1)%(this.sl+1)) * (2*this.st+1)) + b + 1 );
            }
        }

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
    /**
	 * Changes the object texCoords
	 * @param {*} u Lenght in u axis
	 * @param {*} v Length in v axis
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
}

