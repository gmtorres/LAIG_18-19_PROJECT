class KeyframeAnimation extends Animation{
    /**
     * 
     * @param {CGFscene} scene Reference to MyScene
     * @param {float} inst Time instance where the Key frame begins
     * @param {vec3} trans Translation transformation
     * @param {vec3} rota  Rotation transformation
     * @param {vec3} scl   Scale transformation
     */
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