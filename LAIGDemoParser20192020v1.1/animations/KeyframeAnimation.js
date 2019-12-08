class KeyframeAnimation extends Animation{

    constructor(scene){
        super(scene);
        this.keyframes = [];
        this.helpMatrix = mat4.create();
    }
    addKeyFrame(keyFrame){
        this.keyframes.push(keyFrame);
    }
    getKeyframes(time,sequence){
        sequence.prev = new KeyFrame(0,[0,0,0],[0,0,0],[1,1,1]);
        sequence.next = this.keyframes[0];

        for(var i = 0; i < this.keyframes.length; i++){
            if(this.keyframes[i].instant <= time && this.keyframes[i].instant >= sequence.prev.instant)
            sequence.prev = this.keyframes[i];
            else if(this.keyframes[i].instant > time && (this.keyframes[i].instant <sequence.next.instant || sequence.next.instant < time))
            sequence.next = this.keyframes[i];
        }
    }
    
    update(time){
        let sequence = {prev : null, next : null };
        this.getKeyframes(time,sequence);
        let animation = new LinearAnimation(this.aplicationMatrix,sequence.prev,sequence.next);
        this.helpMatrix = animation.update(time);
    }

    apply(){
        this.applicationMatrix.multMatrix(this.helpMatrix);
    }

}

class KeyFrame{
    constructor(inst, trans, rota , scl,type){
        this.instant = inst;
        this.transate = trans;
        this.rotate = rota;
        this.scale = scl;
    }
}