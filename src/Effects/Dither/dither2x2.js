const fs = `
uniform float uBrightness;

float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

float luma(vec4 color) {
    return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}

float dither2x2(vec2 position, float brightness) {
    int x = int(mod(position.x, 2.0));
    int y = int(mod(position.y, 2.0));
    int index = x + y * 2;
    float limit = 0.0;
  
    if (x < 8) {
      if (index == 0) limit = 0.25;
      if (index == 1) limit = 0.75;
      if (index == 2) limit = 1.00;
      if (index == 3) limit = 0.50;
    }
  
    return brightness < limit ? 0.0 : 1.0;
}

vec3 dither2x2(vec2 position, vec3 color) {
    return color * dither2x2(position, luma(color));
}

vec4 dither2x2(vec2 position, vec4 color, float brightness) {
    return vec4(color.rgb * dither2x2(position, luma(color)), brightness);
}

vec4 dither2x2_sampleColor(sampler2D texture, vec2 texSize, vec2 texCoord) {
    vec4 color = dither2x2(gl_FragCoord.xy, texture2D(texture, texCoord), uBrightness);
    return color;
}
`;
const uniforms = {
    uBrightness: {
        value: 1.0,
        min: 0,
        softMax: 1.0
    }
};
export default {
    name: 'dither2x2',
    uniforms,
    fs,
    dependencies: [],
    passes: [{
        sampler: true,
    }]
};

// https://github.com/hughsk/glsl-dither
