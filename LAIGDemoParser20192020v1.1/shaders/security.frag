#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D securityCameraSampler;
uniform float timeFactor;

vec4 draw_line(float y,vec4 color , float time , float delta){

	float newy = -time + delta;

	if(newy < 0.0)
		newy+= 1.0;

	if(y > newy && y < 0.01 + newy){
		return vec4(color[0] * 0.6 + 0.4,color[1]* 0.6 + 0.4,color[2]* 0.6 + 0.4,1);
	}else return color;
}

bool greenCheck(vec4 compare){
	
	if(compare[0] < 0.6 && compare[1] > 0.5 && compare[2] < 0.6) return true;

	return false;
}


void main() {
	vec2 p = vec2(1,1)-vTextureCoord;
	p = vec2(1.0-p[0], p[1] );

	vec4 color = texture2D(uSampler, p);
	vec4 recordingColor = texture2D(securityCameraSampler, vTextureCoord);

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

	/*if(vTextureCoord[0] < 0.02 || vTextureCoord[0] > 0.98 || vTextureCoord[1] < 0.05 || vTextureCoord[1] > 0.95)
		color = vec4(0.3,0.20,0.20,1);*/

	gl_FragColor = color;
}