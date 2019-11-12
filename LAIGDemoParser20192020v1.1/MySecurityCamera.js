class MySecurityCamera extends CGFobject{

    constructor(scene,id){
        super(scene);
        this.rect = new MyRectangle(scene,id,-0.5,0.5,-0.5,0.5);
    }
    display(){

        this.rect.display();

    }


}