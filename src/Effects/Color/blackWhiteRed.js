const fs = `
uniform float uBlackWhiteCoef;

vec4 blackWhiteRed_sampleColor(sampler2D texture, vec2 texSize, vec2 texCoord) {

    vec4 sample =  texture2D(texture, texCoord);

    float grey = 0.21 * sample.r + 0.71 * sample.g + 0.07 * sample.b;

    float r = 0.0;
    float g = 0.0;
    float b = 0.0; 

    if (grey >= uBlackWhiteCoef)
    {
        r = 1.0;
        g = 1.0;
        b = 1.0;
    }

    r = sample.r;

    vec4 color = vec4(
        r,
        g,
        b,
        1.0
    );
    return color;
}
`;
const uniforms = {
    uBlackWhiteCoef: {
        value: 0.8,
        min: 0,
        softMax: 1.0
    }
};
export default {
    name: 'blackWhiteRed',
    uniforms,
    fs,
    dependencies: [],
    passes: [{
        sampler: true,
    }]
};