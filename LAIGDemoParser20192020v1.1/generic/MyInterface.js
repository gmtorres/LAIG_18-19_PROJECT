/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();


        //super.syncVars();
        

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }
    /**
     * Process the press down of a key and set that key as active
     * @param {*} event keyPressed
     */
    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    /**
     * Process the release of a key and set that key as not active
     * @param {*} event keyPressed
     */
    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };
    /**
     * Returns if a key is pressed
     * @param {*} keyCode key to be checked
     */
    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}