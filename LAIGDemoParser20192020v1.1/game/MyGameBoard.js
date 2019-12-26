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
        let tile1i = this.orchestrator.theme.tile1[0];
        let tile2i = this.orchestrator.theme.tile2[0];
        let tile1 = this.orchestrator.theme.tiles1[tile1i];
        let tile2 = this.orchestrator.theme.tiles2[tile2i];
        this.tiles = [];
        let val = 0;
        for (var a = 0; a < 5; a++) {
            for (var b = 0; b < 5; b++) {
                if (val % 2 == 0) {
                    this.tiles.push(new MyTile(this.orchestrator, (a * 5 + b) + 1, tile1, a, b));
                } else {
                    this.tiles.push(new MyTile(this.orchestrator, (a * 5 + b) + 1, tile2, a, b));
                }
                val += 1;
            }
        }
    }

    createPieces() {
        // new MyTorus(this.orchestrator.getScene(),1,0.2,0.1,20,20)
        let piece1i = this.orchestrator.theme.piece1[0];
        let piece2i = this.orchestrator.theme.piece2[0];
        let piece1 = this.orchestrator.theme.pieces1[piece1i];
        let piece2 = this.orchestrator.theme.pieces2[piece2i];
        this.pieces = [];
        let player1 = 0;
        let player2 = 0;
        for (var a = 0; a < 5; a++) {
            for (var b = 0; b < 5; b++) {
                let value = this.board[a][b];
                if (value == 1) {
                    this.pieces.push(new MyPiece(this.orchestrator, 100 + (player1++), piece1, this.tiles[a * 5 + b]));
                } else if (value == 2) {
                    this.pieces.push(new MyPiece(this.orchestrator, 150 + (player2++), piece2, this.tiles[a * 5 + b]));
                }
            }
        }
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

        if (i % 2 == 0) this.orchestrator.getScene().graph.materials['black'].apply();
        else this.orchestrator.getScene().graph.materials['white'].apply();

        let piece = this.tiles[i].getPiece();

        this.tiles[i].display();
        this.orchestrator.getScene().graph.materials['white'].apply();
        if (piece != null) {
            piece.display();
        }
    }
    this.orchestrator.getScene().popMatrix();
}



}