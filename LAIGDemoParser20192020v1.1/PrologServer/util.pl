/*
    reverse(+L1,-L2)
    Reverse a list
    L1 - List to be reversed
    L2 - Reversed list
*/
reverse(L1,L2):-
    reverse(L1,L2,[]).

reverse([],L,L).
reverse([H|T],Z,Acc) :- 
    reverse(T,Z,[H|Acc]).


/*
    reverse2(+L1,-L2)
    Reverse a list containing lists and reverse those lists too
    L1 - List of lists to be reversed
    L2 - Reversed list of lists
*/

reverse2(L1,L2):-
    reverse2(L1,L2,[]).
reverse2([],L,L).
reverse2([H|LL1],Z,Acc) :-
    reverse(H,LR),
    reverse2(LL1,Z,[LR|Acc]).



/*
    membro(+X,+L)
    Checks whether X is a member of L or not
    X - element to check is it is member
    L - List where X will be checked
*/

membro(X,[X|_]).

membro(X,[_|L]) :-
    membro(X,L).

/*
    nth_membro(+-N,+L,+-C)
    Gives the first position or the element that correspond to that element or position respectivaly on the list L. Counts from 1.
    N - Position on the list
    L - list of elements
    C - Element on the list
*/

nth_membro(N,L,C):-
    nth_membro(1,N,L,C).
nth_membro(_,_,[],_):-
    fail.
nth_membro(N,N,[X|_],X).
nth_membro(N,N1,[_|L],C):-
    Nt is N + 1,
    nth_membro(Nt,N1,L,C).

/*
    nth_membro2(+-X,+-Y,+L,+-C)
    Gives the first position or the element that correspond to that element or position respectivaly on the list of lists L. Counts from 1.
    Here we are aplying a bidimensional search where X represent the List on the position X on L and on this list we get the element on the position Y
    X - Position on the list L
    Y - Position on the list from the list on position X on L
    L - list of lists of elements
    C - Element on the list
*/

nth_membro2(X,Y,L,C):-
    nth_membro2(1,X,Y,L,C).

nth_membro2(_,_,_,[],_):-
    fail.
nth_membro2(X,X,Y,[T|_],C):-
    nth_membro(Y,T,C).
nth_membro2(Xt,X,Y,[_|L],C):-
    Xtt is Xt + 1,
    nth_membro2(Xtt,X,Y,L,C).


/*
    replace(+O,+R,+L1,-L2)
    Replace O by R on the list L1 and return the new list on L2
    O - element that will replace
    R - element that will be replaced
    L1 - original list
    L2 - new list

*/

replace(_,_,[],[]).
replace(O,R,[O|T],[R|T2]) :- replace(O,R,T,T2).
replace(O,R,[H|T],[H|T2]) :- H \= O , replace(O,R,T,T2).


/*
 * (indice ,
    caracter of return on the original list, 
    caracter that will replace,
    List,
    Return List).
*/

/*
    replace(N+,-O,+R,+L1,-L2)
    Replace element on position N by R on L1 and return the new List on L2 and the element that was replaced on O
    N - Position of the element to be replaced
    O - element that was replaced
    R - element that will replace
    L1 - original list
    L2 - new list
*/

replace(_,_,_,[],[]).
replace(1,O,R,[O|T],[R|T2]) :- replace(0,O,R,T,T2).
replace(N,O,R,[H|T],[H|T2]) :- Nt is N-1, replace(Nt,O,R,T,T2).


/*
    replace2(N1+,+N2,-O,+R,+L1,-L2)
    Replace element on position N2 by R on the list that is on position N1 on L1 and return the new List on L2 and the element that was replaced on O
    N1 - Position of list on L1
    N2 - Position of the element to be replaced on the list that is on position N1 on L1
    O - element that was replaced
    R - element that will replace
    L1 - original list
    L2 - new list
*/

replace2(_,_,_,_,[],[]).
replace2(1,N2,O,R,[A|L1],[B|L2]):- replace(N2,O,R,A,B),replace2(0,N2,0,R,L1,L2).
replace2(N1,N2,O,R,[A|L1],[A|L2]):- Nt is N1-1, replace2(Nt,N2,O,R,L1,L2).

/*
    loop(+N,+F)
    Apply a loop N times of the predicate F/0.
    N - iterations of the loop
    F - predicate to apply N times
*/
loop(0,_).
loop(N,F) :-
    N>0,
    M is N-1,
    F,
    loop(M,F).

/*
    count(+L,+V,-R)
    Count number of occurence of an element on L
    L - list
    V - element to be search
    R - count, number of times that elements shows up on L
*/

count(L,V,R):-
    count(L,V,R,0).

count([],_,R,R).

count([V|L],V,R,RR):-
    T is RR+1,
    count(L,V,R,T).

count([_|L],V,R,RR):-
    count(L,V,R,RR).


/*
    countw(+L,+V,-R)
    Count number of occurence of an element on the list of lists L
    L - list of lists
    V - element to be search
    R - count, number of times that elements shows up on every list on L
*/

count2(L,V,R):-
    count2(L,V,R,0).

count2([],_,R,R).

count2([X|L],V,R,RR):-
    count(X,V,A),
    T is RR + A,
    count2(L,V,R,T).


/*
    min(+A,+B,-C)
    Return the min of A and B on C
    A - first number
    B - second number
    C - min
*/

min(A,B,A):-
    A<B.
min(_,B,B).
/*
    max(+A,+B,-C)
    Return the max of A and B on C
    A - first number
    B - second number
    C - max
*/
max(A,B,A):-
    A>B.
max(_,B,B).

/*
    maxList(+L,-R)
    Get max element on the list L
    L - list 
    R - max element on L
*/

maxListAux([],R,R).
maxListAux([A|L],M,R):-
    A >= M,
    maxListAux(L,A,R).
maxListAux([A|L],M,R):-
    A < M,
    maxListAux(L,M,R).

maxList([A|L],R):-
    maxListAux(L,A,R).


/*
    minList(+L,-R)
    Get min element on the list L
    L - list 
    R - min element on L
*/

minListAux([],R,R).
minListAux([A|L],M,R):-
    A =< M,
    minListAux(L,A,R).
minListAux([A|L],M,R):-
    A > M,
    minListAux(L,M,R).

minList([A|L],R):-
    minListAux(L,A,R).


/*
    indiceList(+List,+V,-L)
    Returns on L a list with all index of V in List. Count from 1
    List - List of element
    V - element to be search
    L - List of index of V in List
*/
indiceList(List,V,L):-
    indiceListAux(List,V,1,L).

indiceListAux([],_A,_I,[]).

indiceListAux([A|List] , A , I , [I|L]):-
    In is I + 1,
    indiceListAux(List,A,In,L).

indiceListAux([_A|List] , V , I , L):-
    In is I + 1,
    indiceListAux(List,V,In,L).



/*
    dist1(+X1,+Y1,+X2,+Y2,-Dist)
    Get distance from a point to another
    X1 - x coordinate of point 1
    Y1 - y coordinate of point 1
    Y2 - x coordinate of point 2
    Y2 - y coordinate of point 2
    Dist - distance
*/

dist1(X1,Y1,X2,Y2,Dist):-
    X is (X1 - X2) * (X1 - X2),
    Y is (Y1 - Y2) * (Y1 - Y2),
    D is X + Y,
    Dist is sqrt(D).


/*
    computeDists(+L1,+L2,-Lr)
    Compute all distance from every element on L1 to every element on L2 , each element is consisted of 2 numbers
    L1 - list of points 1
    L2 - list of points 1
    Lr - list of distances

*/

computeDistsAux([],_,_L2aux,[]).

computeDistsAux([[_X1|_Y1]|L1],[],L2aux,Lr):-
    computeDistsAux(L1,L2aux,L2aux,Lr).

computeDistsAux([[X1|Y1]|L1],[[X2|Y2]|L2],L2aux,[D|Lr]):-
    dist1(X1,Y1,X2,Y2,D),
    computeDistsAux([[X1|Y1]|L1],L2,L2aux,Lr).

computeDists(L1,L2,Lr):-
    computeDistsAux(L1,L2,L2,Lr).


/*
    listSum(+L,-R)
    Compute the sum of every element on L
    L - List of numbers
    R - sum of every element
*/

listSum([],0).

listSum([H|T],R):-
    listSum(T,R2),
    R is R2 + H.



