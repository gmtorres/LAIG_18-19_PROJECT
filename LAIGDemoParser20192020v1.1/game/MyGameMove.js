class MyGameMove{

    constructor(piece,origTile, destTile,removePiece){
        this.piece = piece;
        this.origTile = origTile; 
        this.destTile = destTile;
        this.gameBoardAfter;
        this.currentAnimation = null;
        if(removePiece == undefined)
            this.removePiece = false;
        else this.removePiece = removePiece;
    }

    diff(arr1,arr2){
        var temp = [];
        for(var a = 0; a < arr1.length;a++){
            temp.push(arr2[a] - arr1[a]);
        }
        return temp;
    }

    buildAnimation(){
        if(this.currentAnimation == null){
            let transf1 = {
                translate : [0,0,0],
                scale     : [1,1,1],
                rotate    : [0,0,0],
                instant   : 0 
            };

            let transf2 = {
                translate : this.diff(this.origTile.getPosition(),this.destTile.getPosition()),
                scale     : this.removePiece ? [0,0,0] : [1,1,1],
                rotate    : [0,0,0],
                instant   : 0.5
            };
            this.currentAnimation = new LinearAnimation(this.piece.orchestrator.getScene(),transf1,transf2);
            
        }
    }

    animate(time){
        //TODO
        this.buildAnimation();
        if(this.currentAnimation.update(time) == false){
            this.currentAnimation = null;
            return false;
        }
        return true;
    }

    display(){
        //TODO
        this.buildAnimation();
        if(this.currentAnimation == null){
            this.piece.display();
            return;
        }
        let scene = this.piece.orchestrator.getScene();
        let boardTranslation = this.piece.orchestrator.boardCoords;
        let pieceP = this.piece.getTile().getPiecePosition();
        let origP = this.origTile.getPosition();
        scene.pushMatrix();
        scene.translate(origP[0] - pieceP[0] + boardTranslation[0],origP[1] - pieceP[1] + boardTranslation[1],origP[2] - pieceP[2] + boardTranslation[2]);
        this.piece.applyTransformations();
        this.currentAnimation.apply();
        this.piece.displayPiece();
        //this.piece.animated = true;
        scene.popMatrix();

        
    }


    getReverseMove(){
        return new MyGameMove(this.gameBoardAfter,this.piece,this.destTile,this.origTile);
    }



}