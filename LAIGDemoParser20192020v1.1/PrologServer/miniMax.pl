miniMaxAuxGetMax(Board,Player,Turn,[Move|ListOfMoves],Record,BestMove):-
    move(Board,Player,Move,NewBoard),
    value(NewBoard,Player,Turn,Value),
    updateRecordMax(Move,Value,Record,NewRecord),
    miniMaxAuxGetMax(Board,Player,Turn,ListOfMoves,NewRecord,BestMove).

miniMaxAuxGetMax(_,_,_,[],BestMove,BestMove).

updateRecordMax(_,Value,(Move1,Value1),(Move1,Value1)):-
    random(0,2,R),
    R == 0,
    Value =< Value1.
updateRecordMax(Move,Value,(_,Value1),(Move,Value)):-
    Value >= Value1.





miniMaxAuxGetMin(Board,Player,Turn,[Move|ListOfMoves],Record,BestMove):-
    move(Board,Player,Move,NewBoard),
    value(NewBoard,Player,Turn,Value),
    updateRecordMin(Move,Value,Record,NewRecord),
    miniMaxAuxGetMin(Board,Player,Turn,ListOfMoves,NewRecord,BestMove).

miniMaxAuxGetMin(_,_,_,[],BestMove,BestMove).

updateRecordMin(_,Value,(Move1,Value1),(Move1,Value1)):-
    random(0,2,R),
    R == 0,
    Value >= Value1.
updateRecordMin(Move,Value,(_,Value1),(Move,Value)):-
    Value =< Value1.





%Dado um Board ver qual a Jogada que o CurrentPlayer vai escolher em relação ao Player, max caso o mesmo que o Player ou mini caso o oponente,
% turno permite ver quantas jogadas faltam para trocar
/*
miniMax(Board,Player,Player,Turn,1,BestMove):-
    valid_moves(Board,Player,ListOfMoves),
    miniMaxAuxGetMax(Board,Player,Turn,ListOfMoves,(nil,-10000),BestMove).

miniMax(Board,_Player,CurrentPlayer,Turn,1,BestMove):-
    valid_moves(Board,CurrentPlayer,ListOfMoves),
    miniMaxAuxGetMin(Board,CurrentPlayer,Turn,ListOfMoves,(nil,+10000),BestMove).





miniMaxAux(Board,Player,Player,Turn,2,[Move|ListOfMoves],BestMove):-
    move(Board,Player,Move,NewBoard),
    miniMax(NewBoard,Player,Player,Turn,1,BestMove).


miniMax(Board,Player,Player,Turn,2,BestMove):-
    valid_moves(Board,Player,ListOfMoves).*/





miniMaxAuxMapValues(_Board,_Player,_CurrentPlayer,_Turn,[],[]).

miniMaxAuxMapValues(Board,Player,CurrentPlayer,Turn,[Move|ListOfMoves],[Value|ListOfValues]):-
    move(Board,CurrentPlayer,Move,NewBoard),
    value(NewBoard,Player,Turn,Value),
    miniMaxAuxMapValues(Board,Player,CurrentPlayer,Turn,ListOfMoves,ListOfValues).


miniMaxAuxMapMovesAux(_Board,NewBoard,Player,Player,_Turn,Depth,[_Move|_ListOfMoves],[BestValue|[]]):-
    gameOver(NewBoard,Player),!,
    %write('gameOver'),nl,
    BestValue is 10000 * Depth.

miniMaxAuxMapMovesAux(_Board,NewBoard,_Player,Opponent,_Turn,Depth,[_Move|_ListOfMoves],[BestValue|[]]):-
    %write('here'),nl,
    gameOver(NewBoard,Opponent),!,
    %write('gameOver'),nl,
    BestValue is -10000 * Depth.


miniMaxAuxMapMovesAux(Board,NewBoard,Player,CurrentPlayer,Turn,Depth,[_Move|ListOfMoves],[BestValue|BestMovesValues]):-
    NewDepth is Depth - 1,
    valid_moves(NewBoard,CurrentPlayer,Turn,NewListOfMoves),
    NextTurn is Turn + 1,
    /*write(Move),nl,
    write(NewBoard),nl,*/
    miniMaxAux(NewBoard,Player,CurrentPlayer,NextTurn,NewDepth,NewListOfMoves,[_Indice|BestValue]),%nl,
    miniMaxAuxMapMoves(Board,Player,CurrentPlayer,Turn,Depth,ListOfMoves,BestMovesValues).


miniMaxAuxMapMoves(_Board,_Player,_CurrentPlayer,_Turn,_Depth,[],[]).

miniMaxAuxMapMoves(Board,Player,CurrentPlayer,Turn,Depth,[Move|ListOfMoves],[BestValue|BestMovesValues]):-
    move(Board,CurrentPlayer,Move,NewBoard),
    miniMaxAuxMapMovesAux(Board,NewBoard,Player,CurrentPlayer,Turn,Depth,[Move|ListOfMoves],[BestValue|BestMovesValues]).


miniMaxAux(Board,Player,CurrentPlayer,Turn,Depth,_ListOfMoves,[BestMove|BestMoveValue]):-
    Turn > 2,
    nextPlayer(CurrentPlayer,NextPlayer),
    valid_moves(Board,NextPlayer,1,NewListOfMoves),
    miniMaxAux(Board,Player,NextPlayer,1,Depth,NewListOfMoves,[BestMove|BestMoveValue]).

miniMaxAux(Board,Player,Player,Turn, 1 ,ListOfMoves,[Indice|BestMoveValue]):-
    miniMaxAuxMapValues(Board,Player,Player,Turn,ListOfMoves,ListOfValues),
    /*write(ListOfMoves),nl,
    write(ListOfValues),nl,*/
    maxList(ListOfValues,BestMoveValue),
    /*Alternative way*/
    indiceList(ListOfValues,BestMoveValue,NewBestMoves),
    length(NewBestMoves,Length),
    Length2 is Length + 1,
    random(1,Length2,R),
    nth_membro(R,NewBestMoves,Indice).
    %nth_membro(Indice,ListOfValues,BestMoveValue).

miniMaxAux(Board,Player,Opponent,Turn, 1 ,ListOfMoves,[Indice|BestMoveValue]):-
    miniMaxAuxMapValues(Board,Player,Opponent,Turn,ListOfMoves,ListOfValues),
    /*write(ListOfMoves),nl,
    write(ListOfValues),nl,*/
    minList(ListOfValues,BestMoveValue),
    /*Alternative way*/
    indiceList(ListOfValues,BestMoveValue,NewBestMoves),
    length(NewBestMoves,Length),
    Length2 is Length + 1,
    random(1,Length2,R),
    nth_membro(R,NewBestMoves,Indice).
    %nth_membro(Indice,ListOfValues,BestMoveValue).


miniMaxAux(Board,Player,Player,Turn,Depth,ListOfMoves,[BestMove|BestMoveValue]):-
    miniMaxAuxMapMoves(Board,Player,Player,Turn,Depth,ListOfMoves,MovesValues),
    /*write('MoveValues:  '),
    write(MovesValues),nl,*/
    maxList(MovesValues,BestMoveValue),
    /*Alternative way*/
    indiceList(MovesValues,BestMoveValue,NewBestMoves),
    length(NewBestMoves,Length),
    Length2 is Length + 1,
    random(1,Length2,R),
    nth_membro(R,NewBestMoves,BestMove).
    %nth_membro(BestMove,MovesValues,BestMoveValue).

miniMaxAux(Board,Player,Opponent,Turn,Depth,ListOfMoves,[BestMove|BestMoveValue]):-
    miniMaxAuxMapMoves(Board,Player,Opponent,Turn,Depth,ListOfMoves,MovesValues),
    /*write('MoveValues:  '),
    write(MovesValues),nl,*/
    minList(MovesValues,BestMoveValue),
    /*Alternative way*/
    indiceList(MovesValues,BestMoveValue,NewBestMoves),
    length(NewBestMoves,Length),
    Length2 is Length + 1,
    random(1,Length2,R),
    nth_membro(R,NewBestMoves,BestMove).
    %nth_membro(BestMove,MovesValues,BestMoveValue).

    


/*
   miniMax(+Board,+Player,+Turn,+Depth,-BestMove)
   Implementation of minimax. When is the opponent playing it will choose the board that will consist on the board that minimizes his odds of lossing
   acordingly to an evaluate predicate, on the other hand, the current player will try to maximize is odds of winning. It is capable of processing Depth turns in advance
   of the game. On the last depth it calculates each possible board value and then applies the algorithm described above going up on the tree of possibilities until it reaches where it 
   began and than chooses the best move on that Board, if several moves have the same value it chooses one random, to keep some randomness to the game.
   Board - Current Board
   Player - Current Player
   Turn - Current Turn 
   Depth - Depth of the minimax, turns ahead capable of processing 
   BestMove - Best move to be played on this Board, it depends on the evaluate predicate 
*/



miniMax(Board,Player,Turn,Depth,BestMove):-
    valid_moves(Board,Player,Turn,ListOfMoves),
    miniMaxAux(Board,Player,Player,Turn,Depth,ListOfMoves,[BestMoveInd|_BestMoveValue]),!,
    /*write('Value: '),write(BestMoveValue),nl,
    write(BestMoveInd),nl,
    write(ListOfMoves),nl,*/
    nth_membro(BestMoveInd,ListOfMoves,BestMove).
    