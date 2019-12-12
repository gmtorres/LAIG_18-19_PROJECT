class MyGameOrchestrator {

    constructor(filename, scene) {
        this.scene = scene;
        scene.gameOrchestrator = this;
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(this, this.gameSequence);
        this.gameBoard = new MyGameBoard(this);
        this.theme = new MySceneGraph(filename, scene);
        this.prolog = null; //new MyPrologInterface(...);
        this.gameStates = {
            'Menu': 0,
            'Load Scene': 1,
            'Next Turn': 2,
            'Destination Piece Selection': 3,
            'Destination Tile Selection': 4,
            'Movement Animation': 5,
            'Evaluate Game End': 6,
            'End Game': 7,
        }
        this.state = 2;

        this.currenPlayer = 1;
        this.currentTurn = 0;

        this.selectedPiece = null;
        this.selectedTile = null;

    }


    getScene() {
        return this.scene;
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */) {
            if (results != null && results.length > 0) { // any results?
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = results[i][1] // get id
                        this.OnObjectSelected(obj, uniqueId);
                    }
                } // clear results
                results.splice(0, results.length);
            }
        }
    }

    OnObjectSelected(obj, id) {
        if (obj instanceof MyPiece) {
            // do something with id knowing it is a piece
            if(this.state == this.gameStates['Destination Piece Selection']){
                
                this.selectedPiece = obj;

            }



        } else if (obj instanceof MyTile) {
            // do something with id knowing it is a tile

            if(this.state == this.gameStates['Destination Tile Selection']){
                
                this.selectedTile = obj;

            }


        } else {
            // error ?
            console.log("error");
            this.selectedPiece = null;
            this.selectedTile = null;

            this.state = this.gameStates['Destination Piece Selection'];
        }
    }

    orchestrate() {
        //manage picks
        this.managePick(false,this.scene.pickResults);
        //clear ids from objs
        this.scene.clearPickRegistration();

        switch (this.state) {
            case this.gameStates['Next Turn']:

                if(this.currentTurn == 2){
                    this.currenPlayer = (this.currenPlayer)%2 + 1;
                    this.currentTurn = 1;

                }else{
                    this.currentTurn++;
                }

                //impedir que o jogador escolhaa s peças do adversario
                if(this.currenPlayer == 1){
                    this.gameBoard.setPlayerSelectable(1,true);
                    this.gameBoard.setPlayerSelectable(2,false);
                }else if(this.currenPlayer == 2){
                    this.gameBoard.setPlayerSelectable(1,false);
                    this.gameBoard.setPlayerSelectable(2,true);
                }

                this.selectedPiece = null;
                this.selectedTile = null;

                this.state = this.gameStates['Destination Piece Selection'];
                
                break;
            case this.gameStates['Destination Piece Selection']:
                if(this.selectedPiece != null){
                    //deixar de selecionar peças
                    this.gameBoard.setPlayerSelectable(1,false);
                    this.gameBoard.setPlayerSelectable(2,false);
                    //tiles ftw
                    this.gameBoard.setTilesSelectable(true);
                    this.state = this.gameStates['Destination Tile Selection'];
                }
                break;
            case this.gameStates['Destination Tile Selection']:
                if(this.selectedTile != null){
                    this.gameBoard.setTilesSelectable(false);

                    this.state = this.gameStates['Movement Animation'];
                }
                break;
            case this.gameStates['Movement Animation']:
                
                this.state = this.gameStates['Evaluate Game End'];
                this.gameBoard.movePiece(this.selectedPiece , this.selectedPiece.getTile() , this.selectedTile );
                break;
            case this.gameStates['Evaluate Game End']:
                this.state = this.gameStates['Next Turn'];
                break;

            default:
                break;
        }

    }



    update(time) {
        this.animator.update(time);
    }
    display() {

        this.theme.displayScene();
        this.gameBoard.display();
        this.animator.display();

    }

}