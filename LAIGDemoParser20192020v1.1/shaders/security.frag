#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D securityCameraSampler;
uniform float timeFactor;

/**
 * Returns a pseudo-random number, it is considered as random
 * @param {*} st vector to be passed and will be used tog enerate a random number
 */

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

/**
 * Return a white if it corresponds to a line, given a y or the color parameter passed
 * @param {*} y y coord of the line
 * @param {*} color Current color to display
 * @param {*} time Current time, used to make the line move on the screen
 * @param {*} delta move the line relatively to a delta
 */
vec4 draw_line(float y,vec4 color , float time , float delta){

	float newy = -time + delta;

	if(newy < 0.0)
		newy+= 1.0;

	if(y > newy && y < 0.01 + newy){
		float r = random(vTextureCoord);
		if(r > 0.4)
			return vec4(color[0] * 0.6 + 0.4,color[1]* 0.6 + 0.4,color[2]* 0.6 + 0.4,1);
	}return color;
}
/**
  * Check if a color is green
  * @param {*} compare color to check if green
  */
bool greenCheck(vec4 compare){
	
	if(compare[0] < 0.6 && compare[1] > 0.5 && compare[2] < 0.6) return true;

	return false;
}

/**
  * Return the color of the shaders afeter all the processment
  */

void main() {
	vec2 p = vec2(1,1)-vTextureCoord;
	p = vec2(1.0-p[0], p[1] );

	vec4 color = texture2D(uSampler, p);
	vec4 recordingColor = texture2D(securityCameraSampler, vTextureCoord);

	// check if the second shader is green and enances the color in cases it is not(white or red)
	if(!greenCheck(recordingColor)){
		if(recordingColor[1]> 0.4 && recordingColor[2]>0.4)	
			recordingColor = vec4(1,1,1,1);
		else{
			float recordTime = mod(timeFactor,2000.0);
			if(recordTime/1000.0 < 1.0)
				recordingColor = vec4(1,0,0,1);
			else{
				recordingColor = color;
			}
			
			
		}
		color = recordingColor;
	}

	float r = 1.0-distance(p,vec2(0.5));
	float d = 1.0;
	color = vec4(color[0]*(r/d),color[1]*(r/d),color[2]*(r/d),1);


	float n = mod(timeFactor,3000.0);
	n = n/3000.0;

	color = draw_line(vTextureCoord[1],color,n,0.0);
	color = draw_line(vTextureCoord[1],color,n,0.18);
	color = draw_line(vTextureCoord[1],color,n,0.4);
	color = draw_line(vTextureCoord[1],color,n,0.65);
	color = draw_line(vTextureCoord[1],color,n,0.83);

	gl_FragColor = color;
}