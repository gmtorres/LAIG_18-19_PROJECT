class KeyframeAnimation extends Animation{

    constructor(scene){
        super(scene);
        this.keyframes = [];
        this.helpMatrix = mat4.create();
        this.currentAnimation = null;
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
        let transf1 = {
            translate : sequence.prev.translate,
            scale     : sequence.prev.scale,
            rotate    : sequence.prev.rotate,
            instant   : sequence.prev.instant 
        };

        let transf2 = {
            translate : sequence.next.translate,
            scale     : sequence.next.scale,
            rotate    : sequence.next.rotate,
            instant   : sequence.next.instant 
        };
        this.currentAnimation = new LinearAnimation(this.applicationMatrix,transf1,transf2);
        this.currentAnimation.update(time);
    }

    apply(){
        this.currentAnimation.apply();
    }

}

class KeyFrame{
    constructor(inst, trans, rota , scl,type){
        this.instant = inst;
        this.translate = trans;
        this.rotate = rota;
        this.scale = scl;
    }
}