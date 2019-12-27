class MyGameBoard {

    constructor(orchestrator, board) {
        this.orchestrator = orchestrator;
        if (board == undefined)
            this.createNewBoard();
        else this.board = board;

        this.createTiles();
        this.createPieces();
        

    }

    createNewBoard(i = 0) {
        if (i == 0) {
            this.board = [
                [0, 0, 0, 0, 0],
                [0, 2, 2, 2, 0],
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0]
            ];
        } else {
            this.board = [
                [0, 0, 0, 0, 0],
                [0, 2, 2, 2, 0],
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0]
            ];
        }
    }

    buildBoardFromTiles() {
        this.board = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];

        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].piece != null) {
                let x = this.tiles[i].x;
                let y = this.tiles[i].y;
                let id = this.tiles[i].piece.getId();
                if (id >= 100 && id < 150) {
                    this.board[x][y] = 1;
                }
                if (id >= 150 && id < 200) {
                    this.board[x][y] = 2;
                }
            }
        }
    }

    createTiles() {
        //new MyPlane(this.orchestrator.getScene(), 1, 32, 32)
       
        this.tiles = [];
        let val = 0;
        for (var a = 0; a < 5; a++) {
            for (var b = 0; b < 5; b++) {
                if (val % 2 == 0) {
                    this.tiles.push(new MyTile(this.orchestrator, (a * 5 + b) + 1, null, a, b));
                } else {
                    this.tiles.push(new MyTile(this.orchestrator, (a * 5 + b) + 1, null, a, b));
                }
                val += 1;
            }
        }
    }

    setTilesType(){
        let tile1;
        let tile2;
        tile1 = this.orchestrator.theme.tilesRef1[this.orchestrator.tile1];
        tile2 = this.orchestrator.theme.tilesRef2[this.orchestrator.tile2];

        
        for(let i = 0; i < this.tiles.length;i++){
            if(i % 2 == 0)
                this.tiles[i].setType(tile1);
            else 
                this.tiles[i].setType(tile2);
        }

    }

    createPieces() {
        // new MyTorus(this.orchestrator.getScene(),1,0.2,0.1,20,20)


        this.pieces = [];
        let player1 = 0;
        let player2 = 0;
        for (var a = 0; a < 5; a++) {
            for (var b = 0; b < 5; b++) {
                let value = this.board[a][b];
                if (value == 1) {
                    this.pieces.push(new MyPiece(this.orchestrator, 100 + (player1++), null, this.tiles[a * 5 + b]));
                } else if (value == 2) {
                    this.pieces.push(new MyPiece(this.orchestrator, 150 + (player2++), null, this.tiles[a * 5 + b]));
                }
            }
        }
    }

    setPieceType(){
        let piece1;
        let piece2;

        piece1 = this.orchestrator.theme.piecesRef1[this.orchestrator.player1Piece];
        piece2 = this.orchestrator.theme.piecesRef2[this.orchestrator.player2Piece];
        
        this.pieces.forEach(piece => {
            let id = piece.uniqueID;
            if(id >= 100 && id < 150){
                piece.setType(piece1);
            }else if(id >= 150 && id < 200){
                piece.setType(piece2);
            }
        });

    }

    setPlayerSelectable(player, mode) {
        for (let i = 0; i < this.tiles.length; i++) {
            let piece = this.tiles[i].getPiece();
            if (piece != null) {
                let id = piece.getId();
                if (player == 1) {
                    if (id >= 100 && id < 150)
                        piece.selectable = mode;
                } else if (player == 2) {
                    if (id >= 150 && id < 200)
                        piece.selectable = mode;
                }
            }
        }
    }

    resetPieces() {
        this.pieces.forEach(element => {
            element.setTile(null);
        });
    }
    redefinePieces() {

    }

    setTilesSelectable(mode) {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].selectable = mode;
        }
    }

    setPiecesAnimated(value) {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].getPiece().animated = value;
        }
    }

    movePiece(piece, startTile, destTile) {
        startTile.setPiece(null);
        piece.setTile(destTile);
    }

    movePiece2(startTile, destTile) {
        let piece = startTile.getPiece();
        startTile.setPiece(null);
        piece.setTile(destTile);
    }

    getTile(x, y) {
        return this.tiles[x * 5 + y];
    }

    getPieceByTile(x, y) {
        return this.tiles[x * 5 + y].getPiece();
    }



    display() {

    this.orchestrator.getScene().pushMatrix();
    // this.orchestrator.getScene().translate(- 2.5, 0, -2.5);
    for (let i = 0; i < this.tiles.length; i++) {

        let piece = this.tiles[i].getPiece();

        this.tiles[i].display();
        
        if (piece != null) {
            piece.display();
        }
    }
    this.orchestrator.getScene().popMatrix();
}



}