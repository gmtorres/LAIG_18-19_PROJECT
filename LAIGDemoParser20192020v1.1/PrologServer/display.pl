:- include('util.pl').

display_rotation(1). /*If the roation of the board is enabled*/
horizontal_margin(3). /*For formatation aspects, can be changed*/
board_size(5). /* DO NOT CHANGE THIS ONE, UNLESS YOU KNOW WHAT YOU ARE DOING*/

/*
 *-1 -> void
 *0 -> empty
 *1 -> white
 *2 -> black
*/

/*
    playerChar(+Number,-Char)
    Associate each number on the board to a char to display
*/

playerChar(-1,'').
playerChar(0,' ').
playerChar(1,'O').
playerChar(2,'*').
playerChar(_,'?').


display_topo_linha_aux(N,N):-
    nl.
display_topo_linha_aux(M,N):-
    M < N,
    write('#'),
    Ma is M+1,
    display_topo_linha_aux(Ma,N).


/*
    display_topo_linha(+N)
    Display series of '#' as a straight line, N blocks
    N - number of blocks displayed
*/

display_topo_linha(N):-
    horizontal_margin(HM),
    Na is N*(2+2*HM)+1,
    display_topo_linha_aux(0,Na).



display_blanck_linha_aux(N,N):-
    nl.
display_blanck_linha_aux(M,N):-
    M < N,
    horizontal_margin(HM),
    T is HM*2+1,
    loop(T,write(' ')),
    write('#'),
    Ma is M+1,
    display_blanck_linha_aux(Ma,N).

/*
    display_blanck_linha(+N)
    Display a line with spaces and '#' representing division between blocks
    N - number of blocks displayed
*/ 
display_blanck_linha(N):-
    write('#'),
    display_blanck_linha_aux(0,N).

display_info_linha_aux(N,N,_):-
    nl.

display_info_linha_aux(M,N,[]):-
    M < N,
    horizontal_margin(HM),
    loop(HM,write(' ')),
    write(' '),
    loop(HM,write(' ')),
    write('#'),
    Ma is M+1,
    display_info_linha_aux(Ma,N,_).

display_info_linha_aux(M,N,[X|L]):-
    M < N,
    horizontal_margin(HM),
    loop(HM,write(' ')),
    playerChar(X,C),
    write(C),
    loop(HM,write(' ')),
    write('#'),
    Ma is M+1,
    display_info_linha_aux(Ma,N,L).

/*
    display_blanck_linha(+N)
    Display a line with spaces and '#' representing division between blocks 
    and in the middle of each block there will be inforamtion about the board, a char representing a piece
    N - number of blocks displayed
*/

display_info_linha(N,L):-
    write('#'),
    display_info_linha_aux(0,N,L).

 /*
    display_number_line(+N,+Max,+Inc):-
    Display the number line represtning each col of blocks
    N - index
    Max - max number of blocks
    Inc - Increment on N
 */   

display_number_line(N,N,_):-
    horizontal_margin(HM),
    T is HM+1,
    loop(T,write(' ')),
    CN is 48 + N,
    char_code(C,CN),
    write(C),
    loop(T,write(' ')).

display_number_line(N,Cnt,Inc):-
    Cnt \= N,
    horizontal_margin(HM),
    T is HM+1,
    loop(T,write(' ')),
    CN is 48 + Cnt,
    char_code(C,CN),
    write(C),
    loop(HM,write(' ')),
    Cnt_ is Cnt + Inc,
    display_number_line(N,Cnt_,Inc).


display_board_aux([],_,Inc):-
    board_size(Bs),
    Inc == 1,
    write('   '),
    display_topo_linha(Bs),
    write('   '),
    display_number_line(1,Bs,-1).

display_board_aux([],_,Inc):-
    board_size(Bs),
    Inc == -1,
    write('   '),
    display_topo_linha(Bs),
    write('   '),
    display_number_line(Bs,1,1).


display_board_aux([X|L],N,Inc):-
    board_size(Bs),
    write('   '),
    display_topo_linha(Bs),
    write('   '),
    display_blanck_linha(Bs),
    char_code(C,N),
    write(C),
    write('  '),
    display_info_linha(Bs,X),
    write('   '),
    display_blanck_linha(Bs),
    N_ is N + Inc,
    display_board_aux(L,N_,Inc).

/*  
    display_Player(+Player)
    Display the player to play
    Player - Current player
*/

display_Player(Player):-
    write(' Player: '),
    write(Player).

/*  
    display_Move(+Move)
    Display the move to be played
    Move - Current move
*/
display_Move(Move):-
    write(' Move: '),
    write(Move).

/*
    display_board(+Board,+Player)
    Display the board on console and the player that will play
    Board - Current board
    Player - Current player
*/

display_board(Board,Player):-
    display_rotation(R),
    R == 0,!,
    display_board_aux(Board,69 ,-1),
    display_Player(Player).

display_board(Board,Player) :-
    Player == 1,!,
    display_board_aux(Board,69 ,-1),
    display_Player(Player).

display_board(Board,Player) :-
    Player == 2,
    reverse2(Board,B),
    display_board_aux(B,65 ,1),
    display_Player(Player).

/*
    display_board(+Board,+Player,+Turn)
    Display the board on console and the player that will play as well as the turn
    Board - Current board
    Player - Current player
    Turn - Current Turn
*/

display_board(Board,Player,Turn):-
    display_board(Board,Player),
    display_Move(Turn).