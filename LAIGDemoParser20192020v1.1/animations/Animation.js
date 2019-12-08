class Animation{
    constructor(scene){
        if (this.constructor === Animation) {
            throw new TypeError('Abstract class "Animation" cannot be instantiated directly.'); 
        }
        if (this.update === undefined) {
            throw new TypeError('Classes extending the Animation abstract class should implement \'update\' function');
        }
        if (this.apply === undefined) {
            throw new TypeError('Classes extending the Animation abstract class should implement \'apply\' function');
        }
        this.applicationMatrix = scene;
    }
}


/*class Animation{

    constructor(scene){
        this.appMatrix = scene;
        this.helpMatrix = mat4.create();
        this.keyframes = [];
    }

    diff(arr1,arr2,d){
        var temp = [];
        for(var a = 0; a < arr1.length;a++){
            temp.push(arr1[a] + (arr2[a] - arr1[a]) * d);
        }
        return temp;
    }


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

    apply(){
        this.appMatrix.multMatrix(this.helpMatrix);
    }

}
*/