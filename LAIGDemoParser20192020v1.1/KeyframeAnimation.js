class KeyframeAnimation extends Animation{

    constructor(scene ,inst, trans, rota , scl){
        super(scene);
        this.instant = inst;
        this.transate = trans;
        this.rotate = rota;
        this.scale = scl;
    }

    update(time){
    }
    apply(){
    }

}