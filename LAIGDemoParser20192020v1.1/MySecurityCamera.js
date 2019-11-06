class MySecurityCamera extends CGFobject{

    constructor(scene,id){
        super(scene);
        this.rect = new MyRectangle(scene,id,-0.5,0.5,-0.5,0.5);
    }
    display(){
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,1,0);
        this.rect.display();
        this.scene.popMatrix();

    }


}