/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param r1 - Base radius
 * @param r2 - Top radius
 * @param h - Height
 * @param sl - Number of slices
 * @param st - Number of stacks
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
        this.dh = h / this.st;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];

		//Counter-clockwise reference of vertices
		this.indices = [];

		//Facing Z positive
        this.normals = [];

        //change of radius with height
        var dr = (this.r2 - this.r1) / (this.st-1);

        //vertices
        for(var stacks = 0, height = 0 , r = this.r1; stacks < this.st; stacks+=1 , height += this.dh , r+=dr){
            for(var slices = 0,thetha = 0; slices < this.sl; slices+=1 , thetha+= this.dp){
                this.vertices.push(r* Math.cos(thetha),r* Math.sin(thetha), height );
                this.normals.push(Math.cos(thetha),Math.sin(thetha),-dr)
            }
        }
        //indices
        for(var a = 0; a < this.st-1 ; a++){
            for(var b = 0; b < this.sl ; b++){
                this.indices.push(a * this.sl + b , a * this.sl + (b + 1) % this.sl , (a+1) * this.sl + b);
                this.indices.push((a+1) * this.sl + b , a * this.sl + (b + 1) % this.sl , (a+1) * this.sl + (b + 1) % this.sl );
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
    display(){
        this.enableNormalViz();
        super.display();
    }
}

