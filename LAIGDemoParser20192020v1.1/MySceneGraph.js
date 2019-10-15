var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.cameras = [];

        this.idRoot = null;  // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        this.materialIndex = 0;

        /*
         * Read the contents of the xml file, and refer to this class for loading
         * and error handlers. After the file is read, the reader calls onXMLReady
         * on this object. If any error occurs, the reader calls onXMLError on this
         * object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log('XML Loading finished.');
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various
        // blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional
        // initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != 'lxs') return 'root tag <lxs> missing';

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf('scene')) == -1)
            return 'tag <scene> missing';
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError('tag <scene> out of order ' + index);

            // Parse scene block
            if ((error = this.parseScene(nodes[index])) != null) return error;
        }

        // <views>
        if ((index = nodeNames.indexOf('views')) == -1)
            return 'tag <views> missing';
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError('tag <views> out of order');

            // Parse views block
            if ((error = this.parseView(nodes[index])) != null) return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf('globals')) == -1)
            return 'tag <ambient> missing';
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError('tag <ambient> out of order');

            // Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null) return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf('lights')) == -1)
            return 'tag <lights> missing';
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError('tag <lights> out of order');

            // Parse lights block
            if ((error = this.parseLights(nodes[index])) != null) return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf('textures')) == -1)
            return 'tag <textures> missing';
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError('tag <textures> out of order');

            // Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null) return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf('materials')) == -1)
            return 'tag <materials> missing';
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError('tag <materials> out of order');

            // Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null) return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf('transformations')) == -1)
            return 'tag <transformations> missing';
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError('tag <transformations> out of order');

            // Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf('primitives')) == -1)
            return 'tag <primitives> missing';
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError('tag <primitives> out of order');

            // Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null) return error;
        }

        // <components>
        if ((index = nodeNames.indexOf('components')) == -1)
            return 'tag <components> missing';
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError('tag <components> out of order');

            // Parse components block
            if ((error = this.parseComponents(nodes[index])) != null) return error;
        }
        this.log('all parsed');
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {
        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null) return 'no root defined for scene';

        this.idRoot = root;

        // Get axis length
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError(
                'no axis_length defined for scene; assuming \'length = 1\'');

        this.referenceLength = axis_length || 1;

        this.log('Parsed scene');

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        // this.onXMLMinorError("To do: Parse views and create cameras.");
        var children = viewsNode.children;

        this.scene.selectView = this.reader.getString(viewsNode, 'default');


        if (children.length == 0)
            this.onXMLError('There has to be at least one view. No views found');

        for (let i = 0; i < children.length; i++) {
            // Check for Two views with the same ID
            var viewID = this.reader.getString(children[i], 'id');
            if (this.cameras[viewID] != null) {
                return 'ID must be unique for each view (conflict: ID = ' + viewID +
                    ')';
            }

            // Get grandchildren names
            var nodeNames = [];
            for (let j = 0; j < children[i].children.length; j++) {
                nodeNames.push(children[i].children[j].nodeName)
            }

            var tagName = children[i].tagName;
            if (tagName == 'perspective' || tagName == 'ortho') {
                // Get near value
                var near = this.reader.getFloat(children[i], 'near');
                if (near == null) {
                    this.onXMLMinorError(
                        'no near defined for camera perspective, skipping camera');
                    continue;
                }
                // Get far value
                var far = this.reader.getFloat(children[i], 'far');
                if (far == null) {
                    this.onXMLMinorError(
                        'no far defined for camera perspective, skipping camera');
                    continue;
                }
                // Get from value
                var index_from = nodeNames.indexOf('from');
                if (index_from == -1) {
                    this.onXMLMinorError('no from element found, skipping camera');
                    continue;
                }
                var from = this.parseCoordinates3D(children[i].children[index_from]);
                // Get to value
                var index_to = nodeNames.indexOf('to');
                if (index_to == -1) {
                    this.onXMLMinorError('no to element found, skipping camera');
                    continue;
                }
                var to = this.parseCoordinates3D(children[i].children[index_to]);

                if (tagName == 'perspective') {
                    // Get angle value
                    var angle = this.reader.getFloat(children[i], 'angle');
                    if (angle == null) {
                        this.onXMLMinorError(
                            'no angle defined for camera perspective, skipping camera');
                        continue;
                    }
                    this.cameras[viewID] = new CGFcamera(angle, near, far, from, to);
                } else {
                    var left = this.reader.getFloat(children[i], 'left');
                    if (left == null) {
                        this.onXMLMinorError(
                            'no left defined for cameraOrtho perspective, skipping camera');
                        continue;
                    }
                    var right = this.reader.getFloat(children[i], 'right');
                    if (right == null) {
                        this.onXMLMinorError(
                            'no right defined for cameraOrtho perspective, skipping camera');
                        continue;
                    }
                    var top = this.reader.getFloat(children[i], 'top');
                    if (top == null) {
                        this.onXMLMinorError(
                            'no top defined for cameraOrtho perspective, skipping camera');
                        continue;
                    }
                    var bottom = this.reader.getFloat(children[i], 'bottom');
                    if (bottom == null) {
                        this.onXMLMinorError(
                            'no bottom defined for cameraOrtho perspective, skipping camera');
                        continue;
                    }
                    var up;
                    var index_up = nodeNames.indexOf('to');
                    if (index_up == -1) {
                        this.onXMLMinorError('no up element found, using default 0,1,0');
                        up = vec3.fromValues(0, 1, 0);
                    } else {
                        up = this.parseCoordinates3D(children[i].children[index_up]);
                    }
                    this.cameras[viewID] = new CGFcameraOrtho(
                        left, right, bottom, top, near, far, from, to, up);
                }
            } else {
                this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
                continue;
            }
            //this.scene.camerasIds.push(viewID);
        }

        //this.scene.gui

        this.log('Parsed views');
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {
        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf('ambient');
        var backgroundIndex = nodeNames.indexOf('background');

        var color = this.parseColor(children[ambientIndex], 'ambient');
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], 'background');
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log('Parsed ambient');

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {
            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            // Check type of light
            if (children[i].nodeName != 'omni' && children[i].nodeName != 'spot') {
                this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
                continue;
            } else {
                attributeNames.push(...['location', 'ambient', 'diffuse', 'specular']);
                attributeTypes.push(...['position', 'color', 'color', 'color']);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null) return 'no ID defined for light';

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return 'ID must be unique for each light (conflict: ID = ' + lightId +
                    ')';

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError(
                    'unable to parse value component of the \'enable light\' field for ID = ' +
                    lightId + '; assuming \'value = 1\'');

            enableLight = aux;

            // Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == 'position')
                        var aux = this.parseCoordinates4D(
                            grandChildren[attributeIndex],
                            'light position for ID' + lightId);
                    else
                        var aux = this.parseColor(
                            grandChildren[attributeIndex],
                            attributeNames[j] + ' illumination for ID' + lightId);

                    if (!Array.isArray(aux)) return aux;

                    global.push(aux);
                } else
                    return 'light ' + attributeNames[i] +
                        ' undefined for ID = ' + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == 'spot') {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return 'unable to parse angle of the light for ID = ' + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return 'unable to parse exponent of the light for ID = ' + lightId;

                var targetIndex = nodeNames.indexOf('target');

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(
                        grandChildren[targetIndex], 'target light for ID ' + lightId);
                    if (!Array.isArray(aux)) return aux;

                    targetLight = aux;
                } else
                    return 'light target undefined for ID = ' + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return 'at least one light must be defined';
        else if (numLights > 8)
            this.onXMLMinorError(
                'too many lights defined; WebGL imposes a limit of 8 lights');

        this.log('Parsed lights');
        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // For each texture in textures block, check ID and file URL

        var children = texturesNode.children;

        this.textures = [];

        if (children.length == 0)
            this.onXMLError('There has to be at least one texture. No texture found');

        
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != 'texture') {
                this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
                continue;
            }

            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null) return 'no ID defined for texture';
            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return 'ID must be unique for each texture (conflict: ID = ' +
                textureID + ')';

            var textureFile = this.reader.getString(children[i],'file');
            if (textureFile == null) return 'no File defined for texture';

            var u_length = this.reader.getString(children[i],'u_length');
            if (u_length == null) return 'no u_length defined for texture';

            var v_length = this.reader.getString(children[i],'v_length');
            if (v_length == null) return 'no v_length defined for texture';

            var texture = []
            texture.tex = new CGFtexture(this.scene,textureFile);
            texture.u_length = u_length;
            texture.v_length = v_length;
            //texture.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');



            this.textures[textureID] = texture;



                
        }



        this.log('Parse textures done.');
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];


        // Check if there is at least one material
        if (children.length == 0)
            this.onXMLError('There has to be at least one view. No views found');

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != 'material') {
                this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null) return 'no ID defined for material';

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return 'ID must be unique for each material (conflict: ID = ' +
                    materialID + ')';

            // Get grandchildren names
            var grandChildren = children[i].children;
            var nodeNames = [];
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Checks if emission tag exists
            if (!nodeNames.includes('emission')) {
                this.onXMLMinorError(
                    'tag <emission /> missing, skiping material ' + materialID + '.');
                continue;
            }

            // Checks if ambient tag exists
            if (!nodeNames.includes('ambient')) {
                this.onXMLMinorError(
                    'tag <ambient /> missing, skiping material ' + materialID + '.');
                continue;
            }

            // Checks if diffuse tag exists
            if (!nodeNames.includes('diffuse')) {
                this.onXMLMinorError(
                    'tag <diffuse /> missing, skiping material ' + materialID + '.');
                continue;
            }

            // Checks if specular tag exists
            if (!nodeNames.includes('specular')) {
                this.onXMLMinorError(
                    'tag <specular /> missing, skiping material ' + materialID + '.');
                continue;
            }

            var emission = this.parseColor(
                grandChildren[nodeNames.indexOf('emission')],
                'emission information for ID ' + materialID);
            var ambient = this.parseColor(
                grandChildren[nodeNames.indexOf('ambient')],
                'ambient information for ID ' + materialID);
            var diffuse = this.parseColor(
                grandChildren[nodeNames.indexOf('diffuse')],
                'diffuse information for ID ' + materialID);
            var specular = this.parseColor(
                grandChildren[nodeNames.indexOf('specular')],
                'specular information for ID ' + materialID);

            var material = new CGFappearance(this.scene);
            material.setAmbient(...ambient);
            material.setEmission(...emission);
            material.setDiffuse(...diffuse);
            material.setSpecular(...specular);

            this.materials[materialID] = material;
        }

        this.log('Parsed materials');
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != 'transformation') {
                this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null) return 'no ID defined for transformation';

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return 'ID must be unique for each transformation (conflict: ID = ' +
                    transformationID + ')';

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(
                            grandChildren[j],
                            'translate transformation for ID ' + transformationID);
                        if (!Array.isArray(coordinates)) return coordinates;

                        transfMatrix =
                            mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        // this.onXMLMinorError('To do: Parse scale transformations.');
                        var scalefactor = this.parseCoordinates3D(
                            grandChildren[j],
                            'scale transformation for ID ' + transformationID);
                        if (!Array.isArray(scalefactor)) return scalefactor;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, scalefactor);
                        break;
                    case 'rotate':
                        // Get axis
                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        switch (axis) {
                            case 'x':
                                axis = vec3.fromValues(1, 0, 0);
                                break;
                            case 'y':
                                axis = vec3.fromValues(0, 1, 0);
                                break;
                            case 'z':
                                axis = vec3.fromValues(0, 0, 1);
                                break;

                            default:
                                this.onXMLMinorError(
                                    'axis ' + axis +
                                    ' does not exist, skipping rotation in transformation ' +
                                    transformationID + '.');
                                continue;
                                break;
                        }

                        // Get angle
                        var angle = this.reader.getFloat(grandChildren[j], 'angle');
                        if (angle == null) {
                            this.onXMLMinorError(
                                'angle does not exist or is not valid, skipping rotation in transformation ' +
                                transformationID + '.');
                            continue;
                        }

                        // Degrees to Radians
                        angle *= DEGREE_TO_RAD;

                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, axis);
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log('Parsed transformations');
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != 'primitive') {
                this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
                continue;
            }


            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null) return 'no ID defined for texture';

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return 'ID must be unique for each primitive (conflict: ID = ' +
                    primitiveId + ')';

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' &&
                    grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' &&
                    grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return 'There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)'
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return 'unable to parse x1 of the primitive coordinates for ID = ' +
                        primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return 'unable to parse y1 of the primitive coordinates for ID = ' +
                        primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return 'unable to parse x2 of the primitive coordinates for ID = ' +
                        primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return 'unable to parse y2 of the primitive coordinates for ID = ' +
                        primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            } else if (primitiveType == 'sphere') {
                // r
                var r = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(r != null && !isNaN(r) && r > 0))
                    return "unable to parse r of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, r, slices, stacks);

                this.primitives[primitiveId] = sphere;
            } else if (primitiveType == 'torus') {
                // r1
                var r1 = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(r1 != null && !isNaN(r1) && r1 > 0))
                    return "unable to parse r1 of the primitive coordinates for ID = " + primitiveId;
                // r2
                var r2 = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(r2 != null && !isNaN(r2) && r2 > 0))
                    return "unable to parse r2 of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops) && loops > 0))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, r1, r2, slices, loops);

                this.primitives[primitiveId] = torus;
            } else if (primitiveType == 'cylinder') {
                // r1
                var r1 = this.reader.getFloat(grandChildren[0], 'base');
                if (!(r1 != null && !isNaN(r1) && r1 >= 0))
                    return "unable to parse r1 of the primitive coordinates for ID = " + primitiveId;
                // r2
                var r2 = this.reader.getFloat(grandChildren[0], 'top');
                if (!(r2 != null && !isNaN(r2) && r2 >= 0))
                    return "unable to parse r2 of the primitive coordinates for ID = " + primitiveId;
                if (r2 == r1 && r2 == 0)
                    return "unable to parse r2 of the primitive coordinates for ID = " + primitiveId + " can't be equal to 0 and r1 to 0 too";

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height) && height > 0))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylinder = new MyCylinder(this.scene, primitiveId, r1, r2, height, slices, stacks);

                this.primitives[primitiveId] = cylinder;
            } else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;
                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;
                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;
                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;
                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;
                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var triangle = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);

                this.primitives[primitiveId] = triangle;
            }
            else {
                //console.warn("To do: Parse other primitives.");
            }
        }

        this.log('Parsed primitives');
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != 'component') {
                this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null) return 'no ID defined for componentID';

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return 'ID must be unique for each component (conflict: ID = ' +
                    componentID + ')';

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf('transformation');
            var materialsIndex = nodeNames.indexOf('materials');
            var textureIndex = nodeNames.indexOf('texture');
            var childrenIndex = nodeNames.indexOf('children');

            //this.onXMLMinorError('To do: Parse components.');

            var component = [];

            // Transformations
            
            var transformation = grandChildren[transformationIndex].children;
            
            var transfMatrix = mat4.create();

            for(var a = 0; a < transformation.length ; a++){
                var tempMatrix = mat4.create();
                switch (transformation[a].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(
                            transformation[a],
                            'translate transformation');
                        if (!Array.isArray(coordinates)) return coordinates;

                        tempMatrix =
                            mat4.translate(tempMatrix, tempMatrix, coordinates);
                        break;
                    case 'scale':
                        // this.onXMLMinorError('To do: Parse scale transformations.');
                        var scalefactor = this.parseCoordinates3D(
                            transformation[a],
                            'scale transformation');
                        if (!Array.isArray(scalefactor)) return scalefactor;

                        tempMatrix = mat4.scale(tempMatrix, tempMatrix, scalefactor);
                        break;
                    case 'rotate':
                        // Get axis
                        var axis = this.reader.getString(transformation[a], 'axis');
                        switch (axis) {
                            case 'x':
                                axis = vec3.fromValues(1, 0, 0);
                                break;
                            case 'y':
                                axis = vec3.fromValues(0, 1, 0);
                                break;
                            case 'z':
                                axis = vec3.fromValues(0, 0, 1);
                                break;

                            default:
                                this.onXMLMinorError(
                                    'axis ' + axis +
                                    ' does not exist, skipping rotation in transformation ' +
                                    transformationID + '.');
                                continue;
                                break;
                        }

                        // Get angle
                        var angle = this.reader.getFloat(transformation[a], 'angle');
                        if (angle == null) {
                            this.onXMLMinorError(
                                'angle does not exist or is not valid, skipping rotation in transformation ' +
                                transformationID + '.');
                            continue;
                        }

                        // Degrees to Radians
                        angle *= DEGREE_TO_RAD;

                        tempMatrix = mat4.rotate(tempMatrix, tempMatrix, angle, axis);
                        break;
                    case 'transformationref':
                            var transformationrefID = this.reader.getFloat(transformation[a], 'id');
                            tempMatrix = this.transformations[transformationrefID];
                    break;
                }
                mat4.mul(transfMatrix,transfMatrix,tempMatrix);
            }

            component.transformation = transfMatrix;


            // Materials

            var materialChild = grandChildren[materialsIndex].children;

            component.material = [];

            for(var b = 0; b < materialChild.length; b++){

                if (materialChild[b].nodeName != 'material') {
                    this.onXMLMinorError('unknown tag <' + materialChild[b].nodeName + '>');
                    continue;
                }

                // Get id of the current material.
                var materialID = this.reader.getString(materialChild[b], 'id');
                if (materialID == null) return 'no ID defined for material';


                if(materialID == 'inherit')
                    component.material.push('inherit');
                else{
                    var tempmaterial = this.materials[materialID];
                    if(tempmaterial == null){
                        tempmaterial = new CGFappearance(this.scene);
                        tempmaterial.setAmbient(0.2, 0.4, 0.8, 1.0);
                        tempmaterial.setDiffuse(0.2, 0.4, 0.8, 1.0);
                        tempmaterial.setSpecular(0.2, 0.4, 0.8, 1.0);
                        tempmaterial.setShininess(10.0);
                        this.onXMLMinorError("Could not find material with id " + materialID);
                    }
                    component.material.push(tempmaterial);
                }
            
            }

            // Texture

            var textureChild = grandChildren[textureIndex];

            if (textureChild.nodeName != 'texture') {
                this.onXMLMinorError('unknown tag <' + textureChild.nodeName + '>');
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(textureChild, 'id');
            if (textureID == null) return 'no ID defined for texture';
            component.texture = [];
            if(textureID == 'inherit')
                component.texture.tex = 'inherit';
            else if(textureID == 'none')
                component.texture.tex = 'none';
            else{
                var temptex = this.textures[textureID];
                if(temptex == null){
                    component.texture.tex = 'none';
                    this.onXMLMinorError("Could not find texture with id " + textureID);
                }else  component.texture = temptex;
            }

            // Children

            var cenas = grandChildren[childrenIndex].children;
            
            var node = [];

            node.component = component;
            node.leafs = [];
            node.child = [];

            for(var a = 0; a < cenas.length; a++){
                switch (cenas[a].nodeName) {
                    case 'primitiveref':
                            var primitiveId = this.reader.getString(cenas[a], 'id');
                            //filhos.push(this.primitives[primitiveId]);
                            var prim = this.primitives[primitiveId];
                            if(prim != null)    node.leafs.push(this.primitives[primitiveId]);
                        break;
                    case 'componentref' :
                            var rcomponentId = this.reader.getString(cenas[a], 'id');
                            //filhos.push(this.components[componentId]);
                            node.child.push(rcomponentId);
                    break;
                }
            }
            //component.children = filhos;

            this.nodes[componentID] = node;

            //this.components[componentID] = component;
            //this.nodes[componentID] = this.components[componentID];
        }
        for(var i in this.nodes){
            this.nodes[i].componentref = [];
            for(var a = 0; a < this.nodes[i].child.length;a++){
                var tempcomp = this.nodes[this.nodes[i].child[a]];
                if(tempcomp != null)
                    this.nodes[i].componentref.push(tempcomp);
            }
        }
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return 'unable to parse x-coordinate of the ' + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return 'unable to parse y-coordinate of the ' + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return 'unable to parse z-coordinate of the ' + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        // Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position)) return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return 'unable to parse w-coordinate of the ' + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return 'unable to parse R component of the ' + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return 'unable to parse G component of the ' + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return 'unable to parse B component of the ' + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return 'unable to parse A component of the ' + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error('XML Loading Error: ' + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the
     * console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn('Warning: ' + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log('   ' + message);
    }
    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        var tempTex = [];
        tempTex.tex = 'none';
        //this.displayFunction(this.idRoot , mat4.create() , new CGFappearance(this.scene) , tempTex);
        this.displayFunction(this.nodes[this.idRoot] , mat4.create() , new CGFappearance(this.scene) , tempTex);
    }

    displayFunction(node,matrix , material , texture){
        //var currentNode = this.nodes[node];
        var currentNode = node;

        if(currentNode == null)
            return;

        this.scene.pushMatrix();
        this.scene.multMatrix(currentNode.component.transformation);

        var nodeMaterial = currentNode.component.material[this.materialIndex % currentNode.component.material.length];
        if(nodeMaterial == 'inherit')
            nodeMaterial = material; 
        nodeMaterial.apply();

        var nodeTexture = currentNode.component.texture;
        if(nodeTexture.tex == 'inherit'){
            nodeTexture = texture;
            if(texture.tex != 'none')  
                nodeTexture.tex.bind();
        }
        else if(nodeTexture.tex == 'none'){
            if(texture.tex != 'none')   
                texture.tex.unbind();
        }
        else{
            nodeTexture.tex.bind();
        }

        for(var a  = 0; a < currentNode.leafs.length ; a++){
            if(nodeTexture.tex !='inherit' && nodeTexture.tex != 'none'){
                currentNode.leafs[a].changeTexCoords(nodeTexture.u_length,nodeTexture.v_length);
            }
            currentNode.leafs[a].display();
        }

        /*for(var a = 0; a < currentNode.child.length ; a++){
            this.displayFunction(currentNode.child[a] , matrix , nodeMaterial , nodeTexture);
        }*/
        for(var a = 0; a < currentNode.componentref.length ; a++){
            this.displayFunction(currentNode.componentref[a] , matrix , nodeMaterial , nodeTexture);
        }
        this.scene.popMatrix();
    }

}