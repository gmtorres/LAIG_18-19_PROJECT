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
    
    /**
     * @override
     * Function overrided to do anything, the calcualtion of the vectors is done in the Animation itself
     * @param {*} time Current time
     */
    update(time){
    }

    /**
     * @override
     * Function overrided to do anything, the application of the transformation is done in the Animation itself
     * @param {*} time Current time
     */
    apply(){
    }

}