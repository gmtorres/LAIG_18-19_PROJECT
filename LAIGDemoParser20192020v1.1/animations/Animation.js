class Animation{
    constructor(scene){
        if (this.constructor === Animation) {
            throw new TypeError('Abstract class "Animation" cannot be instantiated directly.'); 
        }
        if (this.update === undefined) {
            throw new TypeError('Classes extending the Animation abstract class should implement \'update\' function');
        }
        if (this.apply === undefined) {
            throw new TypeError('Classes extending the Animation abstract class should implement \'apply\' function');
        }
        this.applicationMatrix = scene;
    }
}
