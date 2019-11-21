class Animation{
    /**
     * 
     * @param {CGFscene} scene Reference to MyScene
     */
    constructor(scene){
        this.appMatrix = scene;
        this.helpMatrix = mat4.create();
        this.keyframes = [];
    }

    /**
     * Calculates the position which is at d% of the distance between arr1 and arr2
     * 
     * @param {vec3} arr1 vec3 with the coordinates of the first position
     * @param {vec3} arr2 vec3 with the coordinates of the last position
     * @param {float} d percentage of the distance
     */
    diff(arr1,arr2,d){
        var temp = [];
        for(var a = 0; a < arr1.length;a++){
            temp.push(arr1[a] + (arr2[a] - arr1[a]) * d);
        }
        return temp;
    }

    /**
     * Updates the animation state given the current time
     * @param {int} time Current time relative to the begining of the start of the program
     */
    update(time){
        var previous = new KeyframeAnimation(this.helpMatrix,0,[0,0,0],[0,0,0],[1,1,1]);
        var next = this.keyframes[0];

        for(var i = 0; i < this.keyframes.length; i++){
            if(this.keyframes[i].instant <= time && this.keyframes[i].instant >= previous.instant)
                previous = this.keyframes[i];
            else if(this.keyframes[i].instant > time && (this.keyframes[i].instant <next.instant || next.instant < time))
                next = this.keyframes[i];
        }

        if(previous.instant >= next.instant){
            this.helpMatrix = mat4.create();
            mat4.translate(this.helpMatrix,this.helpMatrix,previous.transate);
            mat4.rotate(this.helpMatrix,this.helpMatrix,previous.rotate[0],[1,0,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,previous.rotate[1],[0,1,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,previous.rotate[2],[0,0,1]);
            mat4.scale(this.helpMatrix,this.helpMatrix,previous.scale);
        }else{
            var delta = 1 - (next.instant - time) / (next.instant - previous.instant);
            var transate = this.diff(previous.transate,next.transate,delta);
            var rotate = this.diff(previous.rotate,next.rotate,delta);
            var scale = this.diff(previous.scale,next.scale,delta);
            this.helpMatrix = mat4.create();
            mat4.translate(this.helpMatrix,this.helpMatrix,transate);
            mat4.rotate(this.helpMatrix,this.helpMatrix,rotate[0],[1,0,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,rotate[1],[0,1,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,rotate[2],[0,0,1]);
            mat4.scale(this.helpMatrix,this.helpMatrix,scale);
        }

    }

    /**
     * Applies the animation transformation matrix to the matrix scene
     */
    apply(){
        this.appMatrix.multMatrix(this.helpMatrix);
    }

}