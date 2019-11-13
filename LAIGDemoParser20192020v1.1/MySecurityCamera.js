class MySecurityCamera extends CGFobject{

    constructor(scene,id){
        super(scene);
        this.rect = new MyRectangle(scene,id,-0.5,0.5,-0.5,0.5);
    }
    display(){
        this.scene.setActiveShader(this.scene.securityCameraShader);
        this.scene.textureRTT.bind(0);
        this.scene.securityCameraRecordingTexture.bind(1);
        this.scene.securityCameraShader.setUniformsValues({timeFactor: this.scene.time * 1000 });
        this.rect.display();

        this.scene.setActiveShader(this.scene.defaultShader);   
    }


}