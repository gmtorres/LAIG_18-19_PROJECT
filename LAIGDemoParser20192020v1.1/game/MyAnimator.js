class MyAnimator{
    constructor(orchestrator,gameSequence){
        this.orchestrator = orchestrator;
        this.gameSequence = gameSequence;
        this.currentGameMovement = null;
        this.animationStartTime = null;
    }
    
    reset(){
        this.gameSequence.reset();
    }

    start(){
        this.currentGameMovement = this.gameSequence.next();
    }

    update(time){
        if(this.currentGameMovement != null){
            if(this.currentGameMovement.animate(time - this.animationStartTime ) == false){
                this.currentGameMovement.piece.animated = false;
                this.currentGameMovement = null;
            }
        }
        if(this.currentGameMovement == null){
            this.currentGameMovement = this.gameSequence.next();
            if(this.currentGameMovement == null){
                return false;
            }else{
                this.currentGameMovement.piece.animated = true;
                this.animationStartTime = time;
            }
        }
        return true;
    }
    display(){
        this.orchestrator.scene.pushMatrix();
        if(this.currentGameMovement != null){
            this.currentGameMovement.display();
        }
        this.orchestrator.scene.popMatrix();
    }

}