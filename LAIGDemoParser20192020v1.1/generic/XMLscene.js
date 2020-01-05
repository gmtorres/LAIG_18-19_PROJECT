var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        
        super.init(application);

        this.sceneInited = false;

        this.cameras = [];

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(60);
        this.setPickEnabled(true);

        this.camerasIds = [];

        this.keyMHelper = false;

        this.selectView = "";

        this.interfaceInitiated = false;



    }

    logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
						var customId = this.pickResults[i][1];
						console.log("Picked object: " + obj + ", with pick id " + customId);						
					}
				}
				this.pickResults.splice(0, this.pickResults.length);
			}
        }
        
	}

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.s_camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.cameras['0'] = this.s_camera;
        this.camera = this.s_camera;
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                    this.lights[i].setConstantAttenuation(light[9]);
                    this.lights[i].setLinearAttenuation(light[10]);
                    this.lights[i].setQuadraticAttenuation(light[11]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }
    /**
     * Updates scene camera and set that to the active camera, depending on the camera choosen in the interface
     */
    updateCamera() {
        //this.camera = this.cameras[this.selectView];
        //this.interface.setActiveCamera(this.camera);
        this.gameOrchestrator.cameraAnimationTime = null;
        this.gameOrchestrator.changeCamera(this.cameras[this.selectView]);
        this.gameOrchestrator.state = this.gameOrchestrator.gameStates['Change Camera Position'];
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.gameOrchestrator.onLoaded();

        if(this.interfaceInitiated == true){
            this.interface.gui.removeFolder(this.interface.gui.__folders['Views']);
            this.interface.gui.removeFolder(this.interface.gui.__folders['Lights']);
            this.interface.gui.removeFolder(this.interface.gui.__folders['Select Theme']);
            this.interface.gui.removeFolder(this.interface.gui.__folders['Select Pieces']);
            this.interface.gui.removeFolder(this.interface.gui.__folders['Select Tiles']);
            this.interface.gui.removeFolder(this.interface.gui.__folders['Game Settings']);
            
            /*let piecesFolder = this.interface.gui.addFolder('Select Pieces');
                piecesFolder.add(this.gameOrchestrator,'player1Piece',this.graph.piecesName1).name('Piece 1').onChange(this.changeThemePiece.bind(this));
                piecesFolder.add(this.gameOrchestrator,'player2Piece',this.graph.piecesName2).name('Piece 2').onChange(this.changeThemePiece.bind(this));;
            piecesFolder.open();

            let tilesFolder = this.interface.gui.addFolder('Select Tiles');
                tilesFolder.add(this.gameOrchestrator,'tile1',this.graph.tilesName1).name('Tiles 1').onChange(this.changeThemeTiles.bind(this));
                tilesFolder.add(this.gameOrchestrator,'tile2',this.graph.tilesName2).name('Tiles 2').onChange(this.changeThemeTiles.bind(this));;
            tilesFolder.open();*/

            //return;
        }else{
            this.interfaceInitiated = true;
            this.axis = new CGFaxis(this, this.graph.referenceLength);


            this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

            this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

            this.initLights();

            this.sceneInited = true;

        }
        this.cameras = this.graph.cameras;

        this.camerasIds = [];
        for (var key in this.cameras) {
            if (key === 'length' || !this.cameras.hasOwnProperty(key)) continue;
            this.camerasIds.push(key);
        }

        //Interface
        //this.interface.gui.remove("Select View");
        //this.interface.gui.removeFolder("Lights");
        //this.interface.gui.remove("Select Theme");
        let viewsFolder = this.interface.gui.addFolder('Views');
        viewsFolder.add(this, "selectView", this.camerasIds).name("Select View").onChange(this.updateCamera.bind(this));
        viewsFolder.open();

        let lightsFolder = this.interface.gui.addFolder('Lights');
        this.lightsVar = false;
        var i = 0;
        for (var light in this.graph.lights) {
            this.lightsVar = this.graph.lights[light][0];
            lightsFolder.add(this, "lightsVar").name(light).onChange(this.updateLights.bind(this, i));
            i++;
        }
        lightsFolder.open();

        let themeFolder = this.interface.gui.addFolder('Select Theme');
        themeFolder.add(this,"filename",this.filenames).name('Select Theme').onChange(this.changeTheme.bind(this));
        themeFolder.open();

        let piecesFolder = this.interface.gui.addFolder('Select Pieces');
            piecesFolder.add(this.gameOrchestrator,'player1Piece',this.graph.piecesName1).name('Piece 1').onChange(this.changeThemePiece.bind(this));
            piecesFolder.add(this.gameOrchestrator,'player2Piece',this.graph.piecesName2).name('Piece 2').onChange(this.changeThemePiece.bind(this));;
        piecesFolder.open();

        let tilesFolder = this.interface.gui.addFolder('Select Tiles');
            tilesFolder.add(this.gameOrchestrator,'tile1',this.graph.tilesName1).name('Tiles 1').onChange(this.changeThemeTiles.bind(this));
            tilesFolder.add(this.gameOrchestrator,'tile2',this.graph.tilesName2).name('Tiles 2').onChange(this.changeThemeTiles.bind(this));;
        tilesFolder.open();

        let gameOptions = this.interface.gui.addFolder('Game Settings');
            gameOptions.add(this.gameOrchestrator, 'cameraTransition').name("Camera_Transitions");
            gameOptions.add(this.gameOrchestrator, 'doubleClick').name("Double_Click");
            gameOptions.add(this.gameOrchestrator, 'defBoard', this.gameOrchestrator.defBoards).name("Board").onChange(this.updateBoard.bind(this));
            gameOptions.add(this.gameOrchestrator, 'player1Type', this.gameOrchestrator.ptypes).name('Player 1');
            gameOptions.add(this.gameOrchestrator, 'player2Type', this.gameOrchestrator.ptypes).name('Player 2');
            gameOptions.add(this.gameOrchestrator, 'restartGame').name('Restart Game');
            gameOptions.add(this.gameOrchestrator, 'startGame').name('Start Game');
        gameOptions.open();


        
        
    }
    updateBoard() {
        this.gameOrchestrator.changeBoard();
    }

    changeTheme(obj){
        this.gameOrchestrator.changeTheme(obj);
    }

    changeThemePiece(){
        this.gameOrchestrator.updateBoardTheme();
    }
    changeThemeTiles(){
        this.gameOrchestrator.updateBoardTheme();
    }

    /**
     * Enables or disables scene lights
     * @param {int} i index of the light to change state
     * @param {bool} value true for enable, false to disable
     */
    updateLights(i, value) {
        if (value)
            this.lights[i].enable();
        else
            this.lights[i].disable();
        this.lights[i].update();
    }
    /**
     * function called by each updatePeriod that will check which key is being pressed, changing scene state, 
     * in this case the current material for components that have more than one material
     */

    update() {
        if (this.gui.isKeyPressed('KeyM')) {
            this.keyMHelper = true;
        } else if (this.keyMHelper == true) {
            this.keyMHelper = false;
            this.graph.materialIndex++;
            //console.log("kdos");
        }

        

    }
    

    /**
     * Renders the scene to the current frame buffer for a particular camera
     * @param {CGFcamera} camera Camera to which the scene will be rendered, if undefined the camera will not change and will use the current active camera
     */

    render(camera) {
        this.gameOrchestrator.orchestrate();


        if (camera != undefined) {
            this.camera = camera;
            this.interface.setActiveCamera(this.camera);
        }
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();


        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        this.setActiveShader(this.defaultShader);

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(false);
            //this.lights[i].enable();
            this.lights[i].update();
        }

        this.setDefaultAppearance();
        // Displays the scene (MySceneGraph function).
        this.time = (new Date() - this.startTime) / 1000;


        // this.graph.displayScene();
        this.gameOrchestrator.display();
        
        
        this.popMatrix();
        // ---- END Background, camera and axis setup
        
    }

    /**
     * Displays the scene, renders the first time to the security camera, and then only to the scene camera, and then displays each
     */

    display() {
        if (this.sceneInited) {

            //this.textureRTT = new CGFtextureRTpT(this,this.canvasWidth,this.canvasHeight);
            //gerar securtity camera e escrever imagem na RTT texture
           

            //render da imagem no ecra
            this.render();

            //display da security camera no ecra

           

        }
    }
}