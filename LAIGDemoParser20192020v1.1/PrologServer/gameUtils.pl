% 0 - HUMAN 1-COMPUTER_LEVEL1 2-COMPUTER_LEVEL2
:- dynamic player/2.


numero(1).
numero(2).
numero(3).
numero(4).
numero(5).

letter(1).
letter(2).
letter(3).
letter(4).
letter(5).

direction('w').
direction('s').
direction('d').
direction('a').

%direction letter number or incx , incy
inc('w',0,-1).
inc('s',0,1).
inc('d',1,0).
inc('a',-1,0).

inverse('w','s').
inverse('a','d').
inverse('s','w').
inverse('d','a').

/*
    getLinkedNumber(+Board,+Number,+Letter,+IncX,+IncY,+Player,-R)
    Get the number of linked pieces of a player.
    Board - Current board
    Number - Number on the board 
    Letter - Letter on the Board
    Incx - Increment on the cols
    Incy - Increment int the rows
    Player - Current Player
    R - Result
*/

getLinkedNumber(Board,Number,Letter,IncX,IncY,Player,R):-
    getLinkedNumber(Board,Number,Letter,IncX,IncY,Player,R,0).

getLinkedNumber(Board,Number,Letter,IncX,IncY,Player,R,C):-
    nth_membro2(Letter,Number,Board,Player),!,
    Rt is C+1,
    Nt is Number+IncX,
    Lt is Letter+IncY,
    getLinkedNumber(Board,Nt,Lt,IncX,IncY,Player,R,Rt).

getLinkedNumber(_Board,_X,_Y,_IncX,_IncY,_Player,R,R).  


nextPlayer(1,2).
nextPlayer(2,1).

/*
    annouce(+Player)
    Annouce victory of Player
    Player - Player that won the game
*/

annouce(Player):-
    Player == 1,
    write('  _____  _                         __                       '),nl,
    write(' |  __ \\| |                       /_ |                      '),nl,
    write(' | |__) | | __ _ _   _  ___ _ __   | | __      _____  _ __  '),nl,
    write(' |  ___/| |/ _` | | | |/ _ \\ \'__|  | | \\ \\ /\\ / / _ \\| \'_ \\ '),nl,
    write(' | |    | | (_| | |_| |  __/ |     | |  \\ V  V / (_) | | | |'),nl,
    write(' |_|    |_|\\__,_|\\__, |\\___|_|     |_|   \\_/\\_/ \\___/|_| |_|'),nl,
    write('                  __/ |                                     '),nl,
    write('                 |___/                                      ').

annouce(Player):-
    Player == 2,
    write('  _____  _                         ___                        '),nl,
    write(' |  __ \\| |                       |__ \\                       '),nl,
    write(' | |__) | | __ _ _   _  ___ _ __     ) | __      _____  _ __  '),nl,
    write(' |  ___/| |/ _` | | | |/ _ \\ \'__|   / /  \\ \\ /\\ / / _ \\| \'_ \\ '),nl,
    write(' | |    | | (_| | |_| |  __/ |     / /_   \\ V  V / (_) | | | |'),nl,
    write(' |_|    |_|\\__,_|\\__, |\\___|_|    |____|   \\_/\\_/ \\___/|_| |_|'),nl,
    write('                  __/ |                                       '),nl,
    write('                 |___/                                        ').

/*
    valid_moves(+Board,+Player,+Turn,-ListOfMoves)
    Get the list of all valid moves for that board, player and turn
    Board - Current board
    Player - Current Player
    Turn - Current Turn
    ListOfMoves - list of all valid moves for those conditions
*/

valid_moves(Board,Player,Turn,ListOfMoves):-
    findall([Number,Letter,Direction,PlayerNudged,OpponentNudged],validMoveAux(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged),ListOfMoves).

/*
    find_allPositions(+Board,+Player,-List):-
    Find all positions on the Board where Player is
    Board - Current Board
    Player - player whose pieces are goingo to be looked for on the board
    List - all Player pieces position
*/

find_allPositions(Board,Player,List):-
    findall([N,L],find_position(Board,N,L,Player),List).

/*
    find_position(+Board,+N,+L,+Player)
    Checks if a Player peice is on the Board on the coordinates
    Board - Current Board
    N - Number on the board
    L - Letter on the board
    Player - Player pieces
*/

find_position(Board,N,L,Player):-
    numero(N),
    letter(L),
    nth_membro2(L,N,Board,Player).

    