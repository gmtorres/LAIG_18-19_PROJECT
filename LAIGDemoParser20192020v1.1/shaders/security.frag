#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

vec4 draw_line(float y,vec4 color , float time , float delta){

	float newy = time + delta;

	if(newy > 1.0)
		newy-=1.0;

	if(y > newy && y < 0.01 + newy){
		return vec4((color[0]+1.0)/2.0,(color[1]+1.0)/2.0,(color[2]+1.0)/2.0,1);
	}else return color;
}


void main() {
	vec2 p = vec2(1,1)-vTextureCoord;
	p = vec2(1.0-p[0], p[1] );

	vec4 color = texture2D(uSampler, p);

	/*float time = timeFactor;
	float timetemp = floor(time/2.0);
	time = time - timetemp * 2.0;

	float r = 1.0-distance(p,vec2(0.5));
	float d = 1.3;
	color = vec4(color[0]*(r/d),color[1]*(r/d),color[2]*(r/d),1);
	
	if(vTextureCoord[1] > time && vTextureCoord[1] < time+0.01){
		color = vec4((color[0]+1.0)/2.0,(color[1]+1.0)/2.0,(color[2]+1.0)/2.0,1);
	}

	if(vTextureCoord[1] > time - 0.20 && vTextureCoord[1] < time+0.01-0.20){
		color = vec4((color[0]+1.0)/2.0,(color[1]+1.0)/2.0,(color[2]+1.0)/2.0,1);
	}

	if(vTextureCoord[1] > time - 0.46 && vTextureCoord[1] < time+0.01-0.46){
		color = vec4((color[0]+1.0)/2.0,(color[1]+1.0)/2.0,(color[2]+1.0)/2.0,1);
	}

	if(vTextureCoord[1] > time - 0.80 && vTextureCoord[1] < time+0.01-0.80){
		color = vec4((color[0]+1.0)/2.0,(color[1]+1.0)/2.0,(color[2]+1.0)/2.0,1);
	}

	if(vTextureCoord[1] > time -1.03 && vTextureCoord[1] < time+0.01-1.03){
		color = vec4((color[0]+1.0)/2.0,(color[1]+1.0)/2.0,(color[2]+1.0)/2.0,1);
	}

	if(vTextureCoord[1] > time -1.43 && vTextureCoord[1] < time+0.01-1.43){
		color = vec4((color[0]+1.0)/2.0,(color[1]+1.0)/2.0,(color[2]+1.0)/2.0,1);
	}

	if(vTextureCoord[1] > time + 0.31 && vTextureCoord[1] < time+0.01+0.31){
		color = vec4((color[0]+1.0)/2.0,(color[1]+1.0)/2.0,(color[2]+1.0)/2.0,1);
	}
	if(vTextureCoord[1] > time + 0.51 && vTextureCoord[1] < time+0.01-0.51){
		color = vec4((color[0]+1.0)/2.0,(color[1]+1.0)/2.0,(color[2]+1.0)/2.0,1);
	}*/

	float n = mod(timeFactor,1000.0);
	n = n/1000.0;

	color = draw_line(vTextureCoord[1],color,n,0.0);
	color = draw_line(vTextureCoord[1],color,n,0.18);
	color = draw_line(vTextureCoord[1],color,n,0.4);
	color = draw_line(vTextureCoord[1],color,n,0.65);
	color = draw_line(vTextureCoord[1],color,n,0.83);

	gl_FragColor = color;
}