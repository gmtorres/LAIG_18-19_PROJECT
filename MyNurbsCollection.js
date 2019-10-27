class MyNurbsCOllection{
    constructor() {
        this.collection = [];
    }
    push(surf){
        this.collection.push(surf);
    }
    getPoint(){
        point = [];
        for(var i = 0; i < this.collection.length;i++)
            point.push(this.collection.getPoint())
    }
}