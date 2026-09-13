"use client";

/* eslint-disable react-hooks/immutability -- Three.js scene/material handles belong to the imperative renderer; mutations are intentionally confined to effects and useFrame. */

import { addAfterEffect, Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Group, Mesh, OrthographicCamera, PMREMGenerator, ShaderMaterial, Vector3 } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import JetModel from "@/components/scene/JetModel";
import { sampleFlight } from "@/lib/motion/sample-flight";
import { fitFlight } from "@/lib/motion/fit-flight";

type FlightCanvasProps = {
  progress: RefObject<number>;
  invalidateRef: RefObject<() => void>;
  onReady: () => void;
  onFailure: () => void;
};

function CloudVeil({ progress }: Pick<FlightCanvasProps, "progress">) {
  const mesh = useRef<Mesh>(null);
  const direction = useMemo(() => new Vector3(), []);
  const material = useMemo(() => new ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false,
    uniforms: { uProgress: { value: 0 }, uOpacity: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uProgress;
      uniform float uOpacity;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float noise(vec2 p) { vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }
      float fbm(vec2 p) { float v=0., a=.5; for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+3.1;a*=.5;} return v; }
      void main() {
        vec2 p=vUv*vec2(3.8,2.8)+vec2(uProgress*5.,-uProgress*8.);
        float n=fbm(p+fbm(p*1.7));
        float cloud=smoothstep(.28,.66,n);
        vec3 color=mix(vec3(.80,.86,.90),vec3(.99),smoothstep(.2,.8,n));
        gl_FragColor=vec4(color,cloud*uOpacity);
      }`,
  }), []);
  useEffect(() => () => material.dispose(), [material]);
  useFrame(({ camera, size }) => {
    if (!mesh.current) return;
    const p = progress.current;
    const envelope = p > 0.15 && p < 0.41 ? Math.sin(((p - 0.15) / 0.26) * Math.PI) ** 2 : 0;
    mesh.current.visible = envelope > 0.005;
    if (!mesh.current.visible) return;
    material.uniforms.uProgress.value = p;
    material.uniforms.uOpacity.value = envelope * 0.95;
    camera.getWorldDirection(direction);
    mesh.current.position.copy(camera.position).addScaledVector(direction, 3);
    mesh.current.quaternion.copy(camera.quaternion);
    const zoom = (camera as OrthographicCamera).zoom;
    mesh.current.scale.set(size.width / zoom, size.height / zoom, 1);
  });
  return <mesh ref={mesh} material={material} renderOrder={20}><planeGeometry args={[1, 1]} /></mesh>;
}

function SceneController({ progress, invalidateRef, onReady, onFailure }: FlightCanvasProps) {
  const jet = useRef<Group>(null);
  const reveal = useRef(0);
  const { gl, scene, invalidate } = useThree();

  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = generator.fromScene(room, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.9;
    room.dispose();
    generator.dispose();
    invalidateRef.current = () => { if (!document.hidden) invalidate(); };
    const visible = () => { if (!document.hidden) invalidate(); };
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    document.addEventListener("visibilitychange", visible);
    gl.domElement.addEventListener("webglcontextlost", lost);
    const removeDiagnostics = process.env.NODE_ENV !== "production" || window.location.search.includes("capture")
      ? addAfterEffect(() => {
        gl.domElement.dataset.triangles = String(gl.info.render.triangles);
        gl.domElement.dataset.calls = String(gl.info.render.calls);
      }) : () => {};
    const frame = requestAnimationFrame(() => { invalidate(); onReady(); });
    return () => {
      cancelAnimationFrame(frame);
      removeDiagnostics();
      document.removeEventListener("visibilitychange", visible);
      gl.domElement.removeEventListener("webglcontextlost", lost);
      invalidateRef.current = () => {};
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene, invalidate, invalidateRef, onReady, onFailure]);

  useFrame(({ camera, size, gl }) => {
    if (!jet.current) return;
    const mobile = size.width < 760;
    const pose = fitFlight(sampleFlight(progress.current, mobile), progress.current, size.width, size.height);
    const ortho = camera as OrthographicCamera;
    ortho.position.set(...pose.cameraPosition);
    ortho.lookAt(...pose.cameraTarget);
    ortho.zoom = pose.zoom;
    ortho.updateProjectionMatrix();
    jet.current.position.set(...pose.jetPosition);
    jet.current.rotation.set(...pose.jetRotation);
    reveal.current = pose.reveal;
    if (process.env.NODE_ENV !== "production" || window.location.search.includes("capture")) {
      gl.domElement.dataset.progress = progress.current.toFixed(4);
      gl.domElement.dataset.reveal = pose.reveal.toFixed(4);
    }
  }, -2);

  return <>
    <ambientLight intensity={0.4} />
    <hemisphereLight args={["#f7fbff", "#8398ac", 1.1]} />
    <directionalLight position={[-9, 15, -8]} intensity={2.2} color="#fffdf6" />
    <directionalLight position={[10, 3, 7]} intensity={1.4} color="#c1d9ef" />
    <group ref={jet}><JetModel reveal={reveal} /></group>
    <CloudVeil progress={progress} />
  </>;
}

export default function FlightCanvas(props: FlightCanvasProps) {
  return <div className="flight-canvas"><Canvas orthographic frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 26, 5], zoom: 46, near: 0.1, far: 180 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: typeof window !== "undefined" && window.location.search.includes("capture") }} fallback={<span>The aircraft view requires WebGL.</span>}><SceneController {...props} /></Canvas></div>;
}
