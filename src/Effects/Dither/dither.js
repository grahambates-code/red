const fs = `
const int uXRes = 700;
const int uYRes = 700;

uniform int uTargetRes;

#define BAYER_LEVEL 1

//#define NO_PIXELATE_BORDERS

const float bayerDim = pow(2.0, float(BAYER_LEVEL)+1.0);

const mat2 bayerLvl0 = mat2(
    vec2(0.0/4.0, 3.0/4.0),
    vec2(2.0/4.0, 1.0/4.0)
);

const mat4 bayerLvl1 = mat4(
    vec4( 0.0/16.0, 12.0/16.0,  3.0/16.0, 15.0/16.0),
    vec4( 8.0/16.0,  4.0/16.0, 11.0/16.0,  7.0/16.0),
    vec4( 2.0/16.0, 14.0/16.0,  1.0/16.0, 13.0/16.0),
    vec4(10.0/16.0,  6.0/16.0,  9.0/16.0,  4.0/16.0)
);

float round(float val) {
    return floor(val + 0.5);
}

float custom_clamp(float value, float min, float max) {
    if(value >= max) {
        return max;
    }

    if(value <= min) {
        return min;
    }

    return value;
}

vec4 dither_sampleColor(sampler2D texture, vec2 texSize, vec2 texCoord) {
    vec4 sample = texture2D(texture, texCoord);

#ifdef NO_PIXELATE_BORDERS
      if(sample.a == 0.0) return vec4(0,0,0,1);
#endif

    // Figure out in which super pixel we are.
    // First, determine pixel size
    float dx = float(uXRes) / float(uTargetRes);
    float dy = float(uYRes) / float(uTargetRes);

    // Calculate super pixel coord, rounding
    float superPixelXCoordF = custom_clamp(round(gl_FragCoord.x / dx), 0.0, float(uXRes - 1));
    float superPixelYCoordF = floor((gl_FragCoord.y / dy) + 0.5);

    float samplePosX = superPixelXCoordF * dx;
    float samplePosY = superPixelYCoordF * dy;

    vec2 samplePos = vec2(samplePosX, samplePosY);
    samplePos.x = samplePos.x / float(uXRes);
    samplePos.y = samplePos.y / float(uYRes);
    
    float brightness = texture2D(texture, samplePos).x;

    int x = int(mod(superPixelXCoordF, bayerDim));
    int y = int(mod(superPixelYCoordF, bayerDim));

    float t = 1.0;

#if(BAYER_LEVEL == 0)
   vec2 column = vec2(0);
   if(x==0)
        column = bayerLvl0[0];
    if(x==1)
        column = bayerLvl0[1];

    if(y==0)
        t = column[0];
    if(y==1)
        t = column[1];
#endif

#if (BAYER_LEVEL == 1)
    vec4 column = vec4(0);
    if(x==0)
        column = bayerLvl1[0];
    if(x==1)
        column = bayerLvl1[1];
    if(x==2)
        column = bayerLvl1[2];
    if(x==3)
        column = bayerLvl1[3];

    if(y==0)
        t = column[0];
    if(y==1)
        t = column[1];
    if(y==2)
        t = column[2];
    if(y==3)
        t = column[3];
#endif

    float outputValue = 0.0;

    if(brightness > t) outputValue = 1.0;
        
    return vec4(vec3(outputValue), 1);
}
`;
const uniforms = {
    uBrightness: {
        value: 1.0,
        min: 0,
        softMax: 1.0
    },
    uTargetRes: {
        value: 200,
        min: 2,
        softMax: 500
    }
};
export default {
    name: 'dither',
    uniforms,
    fs,
    dependencies: [],
    passes: [{
        sampler: true,
    }]
};

// https://github.com/hughsk/glsl-dither
