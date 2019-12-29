/*
    value(+Board,+Player,-Value)
    Evaluate a given Board for a PLayer and returns that value, the bigger the value, the bigger the odds of winning 
    Admit the Turn is the second, if the evaluate predicate would take into account the current turn.
    Board - Board to be evaluated
    Player - Player to which the board will be evaluated
    Value - value of the board
*/

value(Board,Player,Value):-
    value(Board,Player,2,Value).

/*
    value(+Board,+Player,+Turn,-Value)
    Evaluate a given Board for a PLayer and returns that value, the bigger the value, the bigger the odds of winning 
    Admit the Turn is the second, if the evaluate predicate would take into account the current turn.
    Board - Board to be evaluated
    Player - Player to which the board will be evaluated
    Turn - Current turn ,  not used in this case
    Value - value of the board
*/

value(Board,Player,_,Value):-
    V is 0.0,
    value_gameOver(Board,Player,Value1),!,
    V1 is V + Value1,
    value_canNudgePieces(Board,Player,Value2),
    V2 is V1 + 2*Value2,
    value_canBeNudgePieces(Board,Player,Value3),
    V3 is V2 - Value3,
    value_dist_players(Board,Player,Value4),
    V4 is V3 - 0.2*Value4,
    value_dist_player(Board,Player,Value5),
    V5 is V4 - 0.1*Value5,
    Value is V5.

/*
    value_gameOver(+Board,+Player,-Value)
    Checks if it is game over and if Player won or lose, the extreme score
    Board - Board to be evaluated
    Player - Player to which the board will be evaluated
    Value - value of the board

*/

value_gameOver(Board,Player,Value):-
    gameOver(Board,Player),
    Value is 10000.
value_gameOver(Board,Player,Value):-
    nextPlayer(Player,Next),
    gameOver(Board,Next),
    Value is -10000.
value_gameOver(_,_,0).


/*
    value_dist_players(+Board,+Player,-Value)
    Checks if players are far apart from each other, so that they come close to each other and attack each other
    Board - Board to be evaluated
    Player - Player to which the board will be evaluated
    Value - value of the board

*/

value_dist_players(Board,Player,Value):-
    find_allPositions(Board,Player,L1),
    nextPlayer(Player,NextPlayer),
    find_allPositions(Board,NextPlayer,L2),
    computeDists(L1,L2,L),
    listSum(L,Sum),
    length(L,Length),
    Value is Sum/Length.

/*
    value_dist_player(+Board,+Player,-Value)
    Checks if player's are far apart from each other, so that they come close to each other and attack together
    Board - Board to be evaluated
    Player - Player to which the board will be evaluated
    Value - value of the board

*/

value_dist_player(Board,Player,Value):-
    find_allPositions(Board,Player,L1),
    find_allPositions(Board,Player,L2),
    computeDists(L1,L2,L),
    listSum(L,Sum),
    length(L,Length),
    Value is Sum/Length.



/*
    value_nudgePiecesAux_value(+Direction,+Number,+Letter,-Score)
    Get a nudge score depending to where a piece is nudged, the closed the border the greatest
    Direction - Direction of the movement
    Number - col on the board
    Letter - letter on the board
    Score - value of the nudge
*/

value_nudgePiecesAux_value('w',_N,L,4):-
    L < 1.
value_nudgePiecesAux_value('w',_N,1,2).
value_nudgePiecesAux_value('w',_N,2,1.5).
value_nudgePiecesAux_value('w',_N,_L,1).

value_nudgePiecesAux_value('s',_N,L,4):-
    L > 5.
value_nudgePiecesAux_value('s',_N,5,2).
value_nudgePiecesAux_value('s',_N,4,1.5).
value_nudgePiecesAux_value('s',_N,_L,1).

value_nudgePiecesAux_value('a',N,_L,4):-
    N < 1.
value_nudgePiecesAux_value('a',1,_L,2).
value_nudgePiecesAux_value('a',2,_L,1.5).
value_nudgePiecesAux_value('a',_N,_L,1).

value_nudgePiecesAux_value('d',N,_L,4):-
    N > 5.
value_nudgePiecesAux_value('d',5,_L,2).
value_nudgePiecesAux_value('d',4,_L,1.5).
value_nudgePiecesAux_value('d',_N,_L,1).



value_nudgePiecesAux([],0).

value_nudgePiecesAux([[_,_,_,_,0]|L],Count):-
    value_nudgePiecesAux(L,Count).

value_nudgePiecesAux([[Number,Letter,Direction,PlayerNudged,OpponentNudged|_]|List],Count):-
    value_nudgePiecesAux(List,Count1),!,
    inc(Direction,Incx,Incy),
    Nt is Number + Incx * (OpponentNudged + PlayerNudged),
    Lt is Letter + Incy * (OpponentNudged + PlayerNudged),
    value_nudgePiecesAux_value(Direction,Nt,Lt,V),
    Count is Count1 + V.

/*
    value_canNudgePieces(Board,Player,Value)
    Checks if player's pieces can nudge the opoonent's ones and to where, the closed the border the greater the score
    Board - Board to be evaluated
    Player - Player to which the board will be evaluated
    Value - value of the board
*/

value_canNudgePieces(Board,Player,Value):-
    valid_moves(Board,Player,1,List),
    value_nudgePiecesAux(List,Value).

/*
    value_canBeNudgePieces(Board,Player,Value)
    Checks if player's pieces can be nudged the opoonent's ones and to where, the closed the border the worse the score
    Board - Board to be evaluated
    Player - Player to which the board will be evaluated
    Value - value of the board
*/

value_canBeNudgePieces(Board,Player,Value):-
    nextPlayer(Player,Next),
    valid_moves(Board,Next,1,List),
    value_nudgePiecesAux(List,Value).