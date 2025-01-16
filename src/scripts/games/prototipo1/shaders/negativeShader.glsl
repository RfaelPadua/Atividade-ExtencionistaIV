precision mediump float;

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main(void)
{
    vec4 color = texture2D(uMainSampler, outTexCoord);
    color.rgb = 1.0 - color.rgb; // Inverte as cores
    gl_FragColor = color;
}