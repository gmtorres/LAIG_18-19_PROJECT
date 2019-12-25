class KeyframeAnimation extends Animation{

    constructor(scene,repeat){
        super(scene);
        this.keyframes = [];
        this.helpMatrix = mat4.create();
        this.currentAnimation = null;
        this.maxTime = 0;
        if(repeat == undefined)
            this.repeat = 1;
        else this.repeat = repeat;
    }
    addKeyFrame(keyFrame){
        this.keyframes.push(keyFrame);
        if(keyFrame.instant > this.maxTime){
            this.maxTime = keyFrame.instant;
        }
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

        if(this.repeat > 1){
            if(Math.floor(time / this.maxTime) == this.repeat){ 
                this.repeat = 0;
            }else
                time = time % this.maxTime;
        }else if(this.repeat == -1){
            time = time % this.maxTime;
        }

        let sequence = {prev : null, next : null};
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
        switch (sequence.next.type) {
            case 1:
                this.currentAnimation = new LinearAnimation(this.applicationMatrix,transf1,transf2);
                break;
        
            default:
                this.currentAnimation = new LinearAnimation(this.applicationMatrix,transf1,transf2);
                break;
        }
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
        if(type == undefined)
            this.type = 1;
        else this.type = type;
    }
}