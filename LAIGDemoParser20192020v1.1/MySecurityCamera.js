class MySecurityCamera extends CGFobject{
    /**
     * @constructor 
     * @param {*} scene Reference to MyScene Object
     * @param {*} id Id of SecurtityCamera to pass to rectangle
     */
    constructor(scene,id){
        super(scene);
        this.screen = new MyRectangle(scene,id,-0.5,0.5,-0.5,0.5);
    }
    /**
     * Display the security Camera on the Scene
     * Sets the securityCameraShader as the active shader, binds the appropriate textures and displays the securityCamera screen
     * Sets the active shader as the default one
     */
    display(){
        this.scene.setActiveShader(this.scene.securityCameraShader);
        this.scene.textureRTT.bind(0);
        this.scene.securityCameraRecordingTexture.bind(1);
        this.scene.securityCameraShader.setUniformsValues({timeFactor: this.scene.time * 1000 });
        this.screen.display();

        this.scene.setActiveShader(this.scene.defaultShader);   
    }


}