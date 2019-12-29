/*
       board(+ID , -Board)
       Return a valid initial Board
       ID - Board ID
       Board- initial Board

*/
board(1,[[0,0,0,0,0],[0,2,2,2,0],[0,0,0,0,0],[0,1,1,1,0],[0,0,0,0,0],]).
board(2,[[2,0,2,0,2],
         [0,0,0,0,0],
         [0,0,0,0,0],
         [0,0,0,0,0],
         [1,0,1,0,1]
       ]).
board(3,[[0,0,2,0,0],
         [0,2,0,2,0],
         [0,0,0,0,0],
         [0,1,0,1,0],
         [0,0,1,0,0]
       ]).
board(4,[[0,2,0,2,0],
         [0,0,2,0,0],
         [0,0,0,0,0],
         [0,0,1,0,0],
         [0,1,0,1,0]
       ]).

board_intermedio([[0,1,1,0,2],
                  [0,1,2,0,0],
                  [0,2,0,0,0],
                  [0,0,0,0,0],
                  [0,0,0,0,0]
       ]).
board_intermedio2([[0,2,0,0,0],
                   [1,1,0,2,0],
                   [0,1,0,0,0],
                   [0,2,0,0,0],
                   [0,0,0,0,0]
       ]).
board_intermedio3([[0,0,0,0,0],
                   [0,2,2,2,0],
                   [0,1,0,0,0],
                   [0,0,1,1,0],
                   [0,0,0,0,0]
]).
board_intermedio4([[0,0,0,0,0],
                   [1,2,2,2,0],
                   [0,0,1,0,0],
                   [0,0,0,1,0],
                   [0,0,0,0,0]
]).
board_final([[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,2,1],[0,2,0,1,1]]).

board_teste([[-1,-1,-1,-1,-1,-1,-1],
       [-1,0,0,0,0,0,-1],
       [-1,0,1,1,1,0,-1],
       [-1,0,0,0,0,0,-1],
       [-1,0,2,2,2,0,-1],
       [-1,0,0,0,0,0,-1],
       [-1,-1,-1,-1,-1,-1,-1]
       ]).


