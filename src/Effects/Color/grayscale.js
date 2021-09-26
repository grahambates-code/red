const fs = `
uniform float uColorFactor;

vec4 grayscale_sampleColor(sampler2D texture, vec2 texSize, vec2 texCoord) {

    vec4 sample =  texture2D(texture, texCoord);
    float grey = 0.21 * sample.r + 0.71 * sample.g + 0.07 * sample.b;
    vec4 color = vec4(
        sample.r * uColorFactor + grey * (1.0 - uColorFactor),
        sample.g * uColorFactor + grey * (1.0 - uColorFactor),
        sample.b * uColorFactor + grey * (1.0 - uColorFactor),
        1.0
    );
    return color;
}
`;
const uniforms = {
    uColorFactor: {
        value: 0.0,
        min: 0,
        softMax: 1.0
    }
};
export default {
    name: 'grayscale',
    uniforms,
    fs,
    dependencies: [],
    passes: [{
        sampler: true,
    }]
};