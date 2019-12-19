class LinearAnimation extends Animation{
    constructor(scene,transf1,transf2){
        super(scene);
        this.translate1 = transf1.translate;
        this.rotate1 = transf1.rotate;
        this.scale1 = transf1.scale;
        this.instant1 = transf1.instant;
        this.translate2 = transf2.translate;
        this.rotate2 = transf2.rotate;
        this.scale2 = transf2.scale;
        this.instant2 = transf2.instant;

        this.helpMatrix = mat4.create();
    }

    linear(arr1,arr2,d){
        var temp = [];
        for(var a = 0; a < arr1.length;a++){
            temp.push(arr1[a] + (arr2[a] - arr1[a]) * d);
        }
        return temp;
    }

    update(time){
        if(time > this.instant2 || time < this.instant1)
            return false;
        this.helpMatrix = mat4.create();
        if(this.instant1 >= this.instant2){
            mat4.translate(this.helpMatrix,this.helpMatrix,this.translate1);
            mat4.rotate(this.helpMatrix,this.helpMatrix,this.rotate1[0],[1,0,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,this.rotate1[1],[0,1,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,this.rotate1[2],[0,0,1]);
            mat4.scale(this.helpMatrix,this.helpMatrix,this.scale1);
        }else{
            var delta = 1 - (this.instant2 - time) / (this.instant2 - this.instant1);
            var translate = this.linear(this.translate1,this.translate2,delta);
            var rotate = this.linear(this.rotate1,this.rotate2,delta);
            var scale = this.linear(this.scale1,this.scale2,delta);
            mat4.translate(this.helpMatrix,this.helpMatrix,translate);
            mat4.rotate(this.helpMatrix,this.helpMatrix,rotate[0],[1,0,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,rotate[1],[0,1,0]);
            mat4.rotate(this.helpMatrix,this.helpMatrix,rotate[2],[0,0,1]);
            mat4.scale(this.helpMatrix,this.helpMatrix,scale);
        }
        return true;
        //return this.helpMatrix;
    }
    apply(){
        this.applicationMatrix.multMatrix(this.helpMatrix);
    }
    
}