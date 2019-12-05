class MyGameOrchestrator{

    constructor(filename,scene){
        this.scene = scene;
        scene.gameOrchestrator = this;
        this.gameSequence  = new MyGameSequence();
        this.animator = new MyAnimator(this,this.gameSequence);
        this.gameBoard = new MyGameBoard(this);
        this.theme = new MySceneGraph(filename,scene);
        this.prolog = null; //new MyPrologInterface(...);

    }

    getScene(){
        return this.scene;
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */){ 
            if (results != null && results.length> 0) { // any results?
                for (var i=0; i< results.length; i++) { 
                    var obj= pickResults[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId= pickResults[i][1] // get id
                        this.OnObjectSelected(obj, uniqueId);
                    }
                } // clear results
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    onObjectSelected(obj, id) {
        if(obj instanceof MyPiece){
            // do something with id knowing it is a piece
        }else if(obj instanceof MyTile){
            // do something with id knowing it is a tile
        }else {
            // error ? 
        }
    }

    update(time){
        this.animator.update(time);
    }
    display(){

        this.theme.displayScene();
        this.gameBoard.display();
        this.animator.display();

    }

}