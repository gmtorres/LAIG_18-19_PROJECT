attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform float timeFactor;


void main() {

    gl_Position = vec4(0.5,0.5,0.5,1)*vec4(aVertexPosition, 1.0) + vec4(0.75,-0.75,0,0);
    vTextureCoord = aTextureCoord;

}