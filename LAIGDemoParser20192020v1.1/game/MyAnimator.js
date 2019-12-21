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
    replay(){
        this.gameSequence.replay();
    }

    start(){
        this.currentGameMovement = this.gameSequence.next();
    }

    update(time){
        if(this.currentGameMovement != null){
            if(this.currentGameMovement.animate(time - this.animationStartTime ) == false){
                this.currentGameMovement.setPiecesAnimated(false);
                this.currentGameMovement = null;
                this.orchestrator.animating = false;;
            }
        }
        if(this.currentGameMovement == null){
            this.currentGameMovement = this.gameSequence.next();
            if(this.currentGameMovement == null){
                return false;
            }else{
                //this.currentGameMovement.setPiecesAnimated(true);
                this.animationStartTime = time;
                this.orchestrator.animating = true;
            }
        }
        return true;
    }
    display(){
        if(this.currentGameMovement != null){
            this.orchestrator.scene.pushMatrix();
            this.currentGameMovement.display();
            this.orchestrator.scene.popMatrix();
        }
    }

}