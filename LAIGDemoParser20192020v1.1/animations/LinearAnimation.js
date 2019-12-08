class LinearAnimation extends Animation{
    constructor(scene,keyframe1,keyframe2){
        super(scene);
        this.keyframe1 = keyframe1;
        this.keyframe2 = keyframe2;
    }

    linear(arr1,arr2,d){
        var temp = [];
        for(var a = 0; a < arr1.length;a++){
            temp.push(arr1[a] + (arr2[a] - arr1[a]) * d);
        }
        return temp;
    }

    update(time){
        this.helpMatrix = mat4.create();
        if(this.keyframe1.instant >= this.keyframe2.instant){
            mat4.translate(this.helpMatrix,this.helpMatrix,this.keyframe1.transate);
            mat4.rotate(this.helpMatrix,this.helpMatrix,this.keyframe1.rotate[0],[1,0,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,this.keyframe1.rotate[1],[0,1,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,this.keyframe1.rotate[2],[0,0,1]);
            mat4.scale(this.helpMatrix,this.helpMatrix,this.keyframe1.scale);
        }else{
            var delta = 1 - (this.keyframe2.instant - time) / (this.keyframe2.instant - this.keyframe1.instant);
            var transate = this.linear(this.keyframe1.transate,this.keyframe2.transate,delta);
            var rotate = this.linear(this.keyframe1.rotate,this.keyframe2.rotate,delta);
            var scale = this.linear(this.keyframe1.scale,this.keyframe2.scale,delta);
            mat4.translate(this.helpMatrix,this.helpMatrix,transate);
            mat4.rotate(this.helpMatrix,this.helpMatrix,rotate[0],[1,0,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,rotate[1],[0,1,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,rotate[2],[0,0,1]);
            mat4.scale(this.helpMatrix,this.helpMatrix,scale);
        }
        return this.helpMatrix;
    }
    apply(){

    }
    
}