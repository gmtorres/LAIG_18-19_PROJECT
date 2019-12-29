/**
 * MyCylinder
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {string} id ID of the cylinder 
 * @param {float} r1 - Base radius
 * @param {float} r2 - Top radius
 * @param {float} h - Height
 * @param {int} sl - Number of slices
 * @param {int} st - Number of stacks
 */
class MyCylinder extends CGFobject {
    constructor(scene, id, r1,r2,h, sl, st) {
        super(scene);
        this.r1 = r1;
        this.r2 = r2;
        this.h = h;
        this.sl = sl;
        this.st = st+1;

        this.dp = 2 * Math.PI / sl;
        this.dh = h / (this.st-1);

        this.u_length = 1;
		this.v_length = 1;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];

		//Counter-clockwise reference of vertices
		this.indices = [];

		//Facing Z positive
        this.normals = [];

        this.texCoords = [];

        //change of radius with height
        var dr = (this.r2 - this.r1) / (this.st-1);

        //vertices
        for(var stacks = 0, height = 0 , r = this.r1; stacks < this.st; stacks+=1 , height += this.dh , r+=dr){
            for(var slices = 0,thetha = 0; slices <= this.sl; slices+=1 , thetha+= this.dp){
                this.vertices.push(r* Math.cos(thetha),r* Math.sin(thetha), height );
                this.normals.push(Math.cos(thetha),Math.sin(thetha),-(this.r2 - this.r1)/this.h);
                this.texCoords.push(thetha/(2*Math.PI + this.dp),height/this.h);
            }
        }

        //indices
        for(var a = 0; a < this.st-1 ; a++){
            for(var b = 0; b <= this.sl ; b++){
                this.indices.push(a * (this.sl+1) + b , a * (this.sl+1) + (b + 1) % (this.sl+1) , (a+1) * (this.sl+1) + b);
                this.indices.push((a+1) * (this.sl+1) + b , a * (this.sl+1) + (b + 1) % (this.sl+1) , (a+1) * (this.sl+1) + (b + 1) % (this.sl+1) ); 
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
     * Updates the texture coordinates of the object
     * @param {float} u 
     * @param {float} v 
     */
    changeTexCoords(u,v){
		for(var a = 0;a < this.texCoords.length/2;a++){
			this.texCoords[2*a] = this.texCoords[2*a] * this.u_length / u ;
			this.texCoords[2*a+1] = this.texCoords[2*a+1] * this.v_length / v ;
		}
		this.u_length = u;
		this.v_length = v;
		this.updateTexCoordsGLBuffers();
	}

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

