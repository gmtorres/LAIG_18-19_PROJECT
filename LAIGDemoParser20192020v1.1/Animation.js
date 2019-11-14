class Animation{

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

    sigmoid(x,d,b){
        return (d-b)/(1 + Math.exp(-x*5)) + b;
    }

    diff_sig(arr1,arr2,d){

        var temp = [];
        for(var i = 0; i < arr1.length;i++){
            var res = this.sigmoid((d * 2 -1)  , arr2[i],arr1[i]);
            temp.push(res);
        }
        return temp;
    }

    sine(x,d,b){
        return 0.5*(Math.sin((x-0.5)*Math.PI)+1)*(d-b)+b;
    }
    
    diff_sin(arr1,arr2,d){
        var temp = [];
        for(var i = 0; i < arr1.length;i++){
            var res = this.sine(d , arr2[i],arr1[i]);
            temp.push(res);
        }
        return temp;
    }

    update(time){ //atualizar o seu estado em função do tempo
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
    apply(){ // aplicar a transformação sobre a matriz de transformações da cena quando adequado
        this.appMatrix.multMatrix(this.helpMatrix);
    }

}