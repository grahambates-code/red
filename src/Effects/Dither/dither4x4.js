const fs = `
uniform float uBrightness;

float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

float luma(vec4 color) {
    return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}

float dither4x4(vec2 position, float brightness) {
    int x = int(mod(position.x, 4.0));
    int y = int(mod(position.y, 4.0));
    int index = x + y * 4;
    float limit = 0.0;
  
    if (x < 8) {
      if (index == 0) limit = 0.0625;
      if (index == 1) limit = 0.5625;
      if (index == 2) limit = 0.1875;
      if (index == 3) limit = 0.6875;
      if (index == 4) limit = 0.8125;
      if (index == 5) limit = 0.3125;
      if (index == 6) limit = 0.9375;
      if (index == 7) limit = 0.4375;
      if (index == 8) limit = 0.25;
      if (index == 9) limit = 0.75;
      if (index == 10) limit = 0.125;
      if (index == 11) limit = 0.625;
      if (index == 12) limit = 1.0;
      if (index == 13) limit = 0.5;
      if (index == 14) limit = 0.875;
      if (index == 15) limit = 0.375;
    }
  
    return brightness < limit ? 0.0 : 1.0;
}
  
vec3 dither4x4(vec2 position, vec3 color) {
    return color * dither4x4(position, luma(color));
}

vec4 dither4x4(vec2 position, vec4 color, float brightness) {
    return vec4(color.rgb * dither4x4(position, luma(color)), brightness);
}
  
vec4 dither4x4_sampleColor(sampler2D texture, vec2 texSize, vec2 texCoord) {
    vec4 color = dither4x4(gl_FragCoord.xy, texture2D(texture, texCoord), uBrightness);
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
    name: 'dither4x4',
    uniforms,
    fs,
    dependencies: [],
    passes: [{
        sampler: true,
    }]
};

// https://github.com/hughsk/glsl-dither
