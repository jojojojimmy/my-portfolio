uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec2 u_speed;
uniform float u_aspect;
uniform float u_size;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    uv = (uv + vec2(u_time) * u_speed) * vec2(u_aspect, 1.0); //This part is what makes the pattern move diagonally or horizontally as time goes on.
    // uv.x * u_size and uv.y * u_size make a grid.
    // mod(total, 2.0) alternates between 0 and 1 — that’s how you get alternating tiles!
    float total = floor(uv.x * u_size) + floor(uv.y * u_size);
    
    // Converts your u_color1 and u_color2 (which are probably 0–255 RGB values) into 0–1.
    // Returns one or the other depending on whether the cell is even or odd.
    bool isEven = mod(total, 2.0) == 0.0;
    vec4 col1 = vec4(u_color1 / 255.0, 1.0);
    vec4 col2 = vec4(u_color2 / 255.0, 1.0);
    return (isEven) ? col1 : col2;
}