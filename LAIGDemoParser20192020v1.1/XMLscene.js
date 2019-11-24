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
        this.startTime = new Date();
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

        this.camerasIds = [];

        this.keyMHelper = false;

        this.selectView = ""; 

        this.securityCameraShader = new CGFshader(this.gl,"shaders/security.vert","shaders/security.frag");
        this.securityCameraShader.setUniformsValues({securityCameraSampler : 1 ,uSampler: 0});

        this.securityCameraRecordingTexture = new CGFtexture(this, "scenes/images/security_camera.jpg"); 

        this.securityCamera = new MySecurityCamera(this,"MySecurityCamera");

        var canvas = document.body;
        this.canvasWidth = canvas.clientWidth;
        this.canvasHeight = canvas.clientHeight;
        this.textureRTT = new CGFtextureRTT(this,this.canvasWidth,this.canvasHeight);

        this.securityCamera.camera =  new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 0, 16), vec3.fromValues(7, -3, 5));
        this.securityCameraMovement = false;
        this.securityCameraMovementAux = false;
        this.securityCameraMovementVec = [0,0,0,0];

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
                break;              // Only eight lights allowed by WebGL.

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
        this.camera = this.cameras[this.selectView];
        this.interface.setActiveCamera(this.camera);
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
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.sceneInited = true;

        this.cameras = this.graph.cameras;
        

        for (var key in this.cameras) {
          if (key === 'length' || !this.cameras.hasOwnProperty(key)) continue;
            this.camerasIds.push(key);
        }

        //Interface

        this.interface.gui.add(this,"selectView",this.camerasIds).name("Select View").onChange(this.updateCamera.bind(this));
        
        var lightsFolder = this.interface.gui.addFolder('Lights');
        this.lightsVar = false;
        var i = 0;
        for(var light in this.graph.lights){
            this.lightsVar = this.graph.lights[light][0];
            lightsFolder.add(this,"lightsVar").name(light).onChange(this.updateLights.bind(this,i));
            i++;
        }
        lightsFolder.open();


        var SecurityCameraFolder = this.interface.gui.addFolder('Security Camera');
        var SecurityCameraFolderPosition = SecurityCameraFolder.addFolder('Position');
        SecurityCameraFolderPosition.add(this.securityCamera.camera.position,'0',-30,30).name('x');
        SecurityCameraFolderPosition.add(this.securityCamera.camera.position,'1',-30,30).name('y');
        SecurityCameraFolderPosition.add(this.securityCamera.camera.position,'2',-30,30).name('z');
        SecurityCameraFolderPosition.open();
        var SecurityCameraFolderTarget = SecurityCameraFolder.addFolder('Target');
        SecurityCameraFolderTarget.add(this.securityCamera.camera.target,'0',-30,30).name('x');
        SecurityCameraFolderTarget.add(this.securityCamera.camera.target,'1',-30,30).name('y');
        SecurityCameraFolderTarget.add(this.securityCamera.camera.target,'2',-30,30).name('z');
        SecurityCameraFolderTarget.open();
        SecurityCameraFolder.add(this,"securityCameraMovement").name('Movement');
        SecurityCameraFolder.open();

        this.updateCamera();

        //this.interface.gui.add(this, 0, this.camerasIds);
    }
    /**
     * Enables or disables scene lights
     * @param {*} i index of the light to change state
     * @param {*} value true for enable, false to disable
     */
    updateLights(i,value){
        if(value)
            this.lights[i].enable();
        else 
            this.lights[i].disable();
        this.lights[i].update();
    }
    /**
     * function called by each updatePeriod that will check which key is being pressed, changing scene state, 
     * in this case the current material for components that have more than one material
     */

    update(){   
        if(this.gui.isKeyPressed('KeyM')){
            this.keyMHelper = true;
        }else if(this.keyMHelper == true){
            this.keyMHelper = false;
            this.graph.materialIndex++;
            //console.log("kdos");
        }

        if(this.securityCameraMovementAux){
            this.securityCamera.camera.target[0] -= this.securityCameraMovementVec[0];
            this.securityCamera.camera.target[1] -= this.securityCameraMovementVec[1];
            this.securityCamera.camera.target[2] -= this.securityCameraMovementVec[2];

            if(this.securityCameraMovementVec[3] == 0) this.securityCameraMovementVec[3] = this.time;

            let a = (this.time - this.securityCameraMovementVec[3]) % 12;
            var b = this.calculateCameraRotation(a);

            this.securityCameraMovementVec = [b[0],0,b[1],this.securityCameraMovementVec[3]];
            
            if( a>=5.8 && a<6.2 || a<0.2 || a>11.8){
                if(this.securityCameraMovement == false)
                    this.securityCameraMovementAux = false;
            }

            this.securityCamera.camera.target[0] += this.securityCameraMovementVec[0];
            this.securityCamera.camera.target[1] += this.securityCameraMovementVec[1];
            this.securityCamera.camera.target[2] += this.securityCameraMovementVec[2];
        }else{
            if(this.securityCameraMovement){
                this.securityCameraMovementAux = true;
            }
            this.securityCamera.camera.target[0] -= this.securityCameraMovementVec[0];
            this.securityCamera.camera.target[1] -= this.securityCameraMovementVec[1];
            this.securityCamera.camera.target[2] -= this.securityCameraMovementVec[2];
            this.securityCameraMovementVec = [0,0,0,0];
        }
            

    }
    /**
     * Simple function to calculate camera delta rotation, to change the targets coord
     * @param {double} time current time to calculate the function , from 0 to 12
     */
    calculateCameraRotation(time){
        var x = this.securityCamera.camera.position[0] - this.securityCamera.camera.target[0];
        var y = this.securityCamera.camera.position[2] - this.securityCamera.camera.target[2];
        var r = Math.sqrt(x*x+y*y);
        var ang = Math.acos(x/r);

        if(time < 2){
             ang += 0.2*time;
        }else if( time>=2 && time < 4){
            ang += 0.2*2;
        }else if( time>=4 && time<8){
            ang += -0.2*(time-6);
        }else if( time>=8 && time < 10){
            ang += 0.2*-2;
        }else if( time>=10 && time<12){
            ang += 0.2*(time - 12);
        }
        
        var a =  0;
        var b =  0;

        
        a =  r * Math.cos(ang) - x;
        if(y>=0)
            b =  r * Math.sin(ang) - y;
        else
            b =  r * Math.sin(ang) + y;

        return [a, b];

        /*if(a < 2){
            return a;
        }else if( a>=2 && a < 4){
            return 2;
        }else if( a>=4 && a<8){
            return -(a-6);
        }else if( a>=8 && a < 10){
            return -2;
        }else if( a>=10 && a<12){
            return a - 12;
        }*/
        return 0;
    }

    /**
     * Renders the scene to the current frame buffer for a particular camera
     * @param {*} camera Camera to which the scene will be rendered, if undefined the camera will not change and will use the current active camera
     */

    render(camera){
        if(camera != undefined){
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
        this.time = (new Date() - this.startTime)/1000;
        this.graph.displayScene();

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Displays the scene, renders the first time to the security camera, and then only to the scene camera, and then displays each
     */

    display(){
        if (this.sceneInited) {
        
            //this.textureRTT = new CGFtextureRTpT(this,this.canvasWidth,this.canvasHeight);
            //gerar securtity camera e escrever imagem na RTT texture
            this.textureRTT.attachToFrameBuffer();
            this.render(this.securityCamera.camera);
            this.textureRTT.detachFromFrameBuffer();

            //render da imagem no ecra
            this.render(this.cameras[this.selectView]);
            
            //display da security camera no ecra
            
            this.securityCamera.display();

        }
    }
}