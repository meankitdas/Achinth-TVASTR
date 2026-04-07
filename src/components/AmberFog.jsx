import { useEffect, useRef } from 'react'

/**
 * AmberFog — Lightweight animated fog background using simplex noise.
 * 
 * Stripped-down version of the original shader for portal login.
 * No beams, no radial bursts — just gentle flowing fog.
 */
export function AmberFog({ opacity = 0.4 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false })
    if (!gl) {
      console.warn('[AmberFog] WebGL not supported')
      return
    }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    // Fragment shader — fog only (no beams/streaks)
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      
      // Simplex-style noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 centered = (uv - 0.5) * 2.0;
        centered.x *= u_resolution.x / u_resolution.y;
        
        // Distance from center (where card sits)
        float distFromCenter = length(centered);
        
        // Radial dissipation — fog emanates from center and spreads outward
        // Exponential falloff for soft glow that fades gradually
        float radialEmission = exp(-distFromCenter * 0.8);
        radialEmission = pow(radialEmission, 0.6); // soften the curve
        
        // Flowing fog animation with outward drift
        float time = u_time * 0.1;
        
        // Add radial outward flow — fog drifts away from center
        vec2 radialDir = normalize(centered + vec2(0.001)); // avoid division by zero at exact center
        float outwardFlow = time * 0.3;
        
        vec2 flowUV = uv * 2.5 + radialDir * outwardFlow * 0.4;
        
        // Multi-octave noise for organic fog
        float fog1 = snoise(flowUV + vec2(time * 0.8, time * 0.5)) * 0.5 + 0.5;
        float fog2 = snoise(flowUV * 1.5 - vec2(time * 0.4, time * 0.7)) * 0.5 + 0.5;
        float fog3 = snoise(flowUV * 2.5 + vec2(time * 0.9, -time * 0.6)) * 0.5 + 0.5;
        
        // Combine layers
        float fogPattern = fog1 * 0.5 + fog2 * 0.3 + fog3 * 0.2;
        
        // Amber color gradient — hotter at center (card origin), cooler at edges
        vec3 colorHot = vec3(1.0, 0.64, 0.0);   // #ff9100
        vec3 colorCool = vec3(0.85, 0.42, 0.0); // #d97706
        vec3 color = mix(colorCool, colorHot, fogPattern * 0.7 + radialEmission * 0.3);
        
        // Apply radial emission and overall intensity
        // Fog is brightest at center, dissipates outward
        float intensity = fogPattern * radialEmission * 1.1;
        float alpha = intensity * 1.2;
        
        gl_FragColor = vec4(color * intensity, alpha);
      }
    `

    // Compile shaders
    function createShader(gl, type, source) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    // Link program
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return
    }

    // Setup geometry
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const timeLocation = gl.getUniformLocation(program, 'u_time')

    // Resize handler
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) // lighter for login page
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    // Animation loop
    let animationId
    const startTime = performance.now()
    
    function render() {
      const currentTime = (performance.now() - startTime) * 0.001

      gl.useProgram(program)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform1f(timeLocation, currentTime)

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      animationId = requestAnimationFrame(render)
    }

    render()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity }}
    />
  )
}
