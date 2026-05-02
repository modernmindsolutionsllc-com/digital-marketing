import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Float,
  Html,
  Trail,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * HeroSignalScene
 * ----------------------------------------------------------------------------
 * An interactive dark-blue universe replacing the original "Live Growth Signal".
 *
 * Mouse controls:
 *   - Left drag      → orbit / rotate the camera around the system
 *   - Scroll wheel   → zoom in / out (drag forward)
 *   - Right drag     → pan (move the universe)
 *   - Click a planet → select it (camera focuses + HUD shows its data)
 *   - Click empty    → deselect
 * ----------------------------------------------------------------------------
 */

/* ---------- Dark-blue palette --------------------------------------------- */
const PALETTE = {
  bgTop: "#04070f",
  bgBottom: "#020a1a",
  sunCore: "#9ee9ff",
  sunGlow: "#1ea4ff",
  ringDim: "#1d3a64",
  ringHi: "#5fc8ff",
  starFar: "#cfe7ff",
  milky: ["#1d3a64", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#7dd3fc"],
};

/* ---------- Planets data (the "universe") --------------------------------- */
const PLANETS = [
  { name: "Aether",     color: "#1e3a8a", emissive: "#1d4ed8", radius: 0.32, distance: 4.2,  speed: 0.55, ring: false, signal: "Brand awareness",     metric: "+62%"  },
  { name: "Helio",      color: "#2563eb", emissive: "#3b82f6", radius: 0.42, distance: 5.6,  speed: 0.42, ring: false, signal: "Search visibility",   metric: "+118%" },
  { name: "Lumen",      color: "#0ea5e9", emissive: "#38bdf8", radius: 0.5,  distance: 7.1,  speed: 0.34, ring: true,  signal: "Paid media reach",    metric: "+204%" },
  { name: "Caelus",     color: "#1e40af", emissive: "#2563eb", radius: 0.58, distance: 8.8,  speed: 0.27, ring: false, signal: "Social engagement",   metric: "+86%"  },
  { name: "Nereid",     color: "#06b6d4", emissive: "#22d3ee", radius: 0.46, distance: 10.4, speed: 0.22, ring: true,  signal: "Lifecycle email",     metric: "+147%" },
  { name: "Aquila",     color: "#3b82f6", emissive: "#60a5fa", radius: 0.66, distance: 12.2, speed: 0.18, ring: false, signal: "Pipeline velocity",   metric: "+91%"  },
  { name: "Halcyon",    color: "#7dd3fc", emissive: "#bae6fd", radius: 0.38, distance: 13.9, speed: 0.15, ring: false, signal: "Affiliate network",   metric: "+73%"  },
  { name: "Vanta",      color: "#1e293b", emissive: "#334155", radius: 0.54, distance: 15.6, speed: 0.12, ring: true,  signal: "Influencer lift",     metric: "+58%"  },
  { name: "Zephyrion",  color: "#4f46e5", emissive: "#6366f1", radius: 0.7,  distance: 17.6, speed: 0.09, ring: false, signal: "Qualified lead growth", metric: "+180%" },
  { name: "Cryon",      color: "#0c4a6e", emissive: "#0284c7", radius: 0.36, distance: 19.4, speed: 0.07, ring: false, signal: "Retention pulse",     metric: "+44%"  },
  { name: "Polaris",    color: "#93c5fd", emissive: "#dbeafe", radius: 0.28, distance: 21.0, speed: 0.05, ring: false, signal: "Audience expansion",  metric: "+39%"  },
];

/* ---------- Milky-way galaxy (spiral particle field) ---------------------- */
function MilkyWay({ count = 14000, radius = 38, branches = 4, spin = 1.1, randomness = 0.55 }) {
  const ref = useRef(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = PALETTE.milky.map((c) => new THREE.Color(c));

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const r = Math.pow(Math.random(), 1.6) * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * 0.18;
      const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      positions[i3]     = Math.cos(branchAngle + spinAngle) * r + rx;
      positions[i3 + 1] = ry;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + rz;

      const inside = palette[0].clone();
      const outside = palette[Math.floor(Math.random() * (palette.length - 1)) + 1];
      const mixed = inside.clone().lerp(outside, Math.min(1, r / radius));

      colors[i3]     = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;

      sizes[i] = Math.random() * 0.06 + 0.015;
    }
    return { positions, colors, sizes };
  }, [count, radius, branches, spin, randomness]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- Far-distance dust haze (extra premium milky vibe) ------------- */
function NebulaDust({ count = 1800 }) {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 26 + Math.random() * 18;
      const t = Math.random() * Math.PI * 2;
      const p = (Math.random() - 0.5) * 0.6;
      arr[i * 3]     = Math.cos(t) * r;
      arr[i * 3 + 1] = p * r * 0.25;
      arr[i * 3 + 2] = Math.sin(t) * r;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.55}
        color="#1e3a8a"
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- The central sun ----------------------------------------------- */
function Sun({ onClick, selected }) {
  const ref = useRef(null);
  const haloRef = useRef(null);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
    if (haloRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.04;
      haloRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Core */}
      <mesh
        ref={ref}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <sphereGeometry args={[1.55, 64, 64]} />
        <meshBasicMaterial color={PALETTE.sunCore} />
      </mesh>

      {/* Inner glow */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.85, 48, 48]} />
        <meshBasicMaterial color={PALETTE.sunGlow} transparent opacity={0.28} />
      </mesh>

      {/* Outer aura */}
      <mesh>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial color={PALETTE.sunGlow} transparent opacity={0.08} />
      </mesh>

      {/* Pulsing radiant ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 3.05, 96]} />
        <meshBasicMaterial color={PALETTE.ringHi} transparent opacity={selected ? 0.9 : 0.45} side={THREE.DoubleSide} />
      </mesh>

      <pointLight intensity={3.2} distance={120} decay={1.6} color={PALETTE.sunGlow} />
    </group>
  );
}

/* ---------- Orbit guide ring ---------------------------------------------- */
function OrbitRing({ distance, highlight }) {
  const lineObj = useMemo(() => {
    const seg = 192;
    const pts = [];
    for (let i = 0; i <= seg; i++) {
      const t = (i / seg) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * distance, 0, Math.sin(t) * distance));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ transparent: true });
    return new THREE.Line(geom, mat);
  }, [distance]);

  lineObj.material.color.set(highlight ? PALETTE.ringHi : PALETTE.ringDim);
  lineObj.material.opacity = highlight ? 0.9 : 0.22;

  return <primitive object={lineObj} />;
}

/* ---------- Single planet -------------------------------------------------- */
function Planet({ data, selected, hovered, onSelect, onHover, onUnhover }) {
  const groupRef = useRef(null);
  const meshRef = useRef(null);

  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * data.speed + phase;
      groupRef.current.position.x = Math.cos(t) * data.distance;
      groupRef.current.position.z = Math.sin(t) * data.distance;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6;
    }
  });

  const scale = selected ? 1.45 : hovered ? 1.18 : 1;

  return (
    <group ref={groupRef}>
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.25}>
        <mesh
          ref={meshRef}
          scale={scale}
          onClick={(e) => { e.stopPropagation(); onSelect(data.name); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover(data.name); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { onUnhover(); document.body.style.cursor = "default"; }}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[data.radius, 48, 48]} />
          <meshStandardMaterial
            color={data.color}
            emissive={data.emissive}
            emissiveIntensity={selected ? 1.1 : hovered ? 0.85 : 0.55}
            metalness={0.55}
            roughness={0.32}
          />
        </mesh>

        {(selected || hovered) && (
          <mesh>
            <sphereGeometry args={[data.radius * 1.35, 32, 32]} />
            <meshBasicMaterial color={data.emissive} transparent opacity={selected ? 0.18 : 0.1} />
          </mesh>
        )}

        {data.ring && (
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <ringGeometry args={[data.radius * 1.55, data.radius * 2.1, 64]} />
            <meshBasicMaterial color={data.emissive} transparent opacity={0.55} side={THREE.DoubleSide} />
          </mesh>
        )}

        {(selected || hovered) && (
          <Html
            center
            distanceFactor={10}
            position={[0, data.radius + 0.55, 0]}
            zIndexRange={[10, 0]}
            style={{ pointerEvents: "none" }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#e0f2fe",
                background: "rgba(6,18,40,0.78)",
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(95,200,255,0.45)",
                whiteSpace: "nowrap",
                backdropFilter: "blur(6px)",
              }}
            >
              {data.name}
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
}

/* ---------- Comet streaking through the system ---------------------------- */
function Comet() {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.18;
    ref.current.position.x = Math.cos(t) * 24 + Math.sin(t * 2) * 2;
    ref.current.position.z = Math.sin(t) * 24 + Math.cos(t * 2) * 2;
    ref.current.position.y = Math.sin(t * 0.7) * 6;
  });
  return (
    <Trail width={2.4} length={7} color={"#7dd3fc"} attenuation={(w) => w * w}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#e0f2fe" />
      </mesh>
    </Trail>
  );
}

/* ---------- Camera focus controller --------------------------------------- */
function CameraRig({ target, controlsRef }) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3(0, 6, 22));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (!target) {
      desired.current.set(0, 6, 22);
      lookAt.current.set(0, 0, 0);
    } else {
      const planet = PLANETS.find((p) => p.name === target);
      if (planet) {
        desired.current.set(0, planet.radius * 4 + 2, planet.distance + planet.radius * 6 + 1.5);
        lookAt.current.set(0, 0, 0);
      }
    }
  }, [target]);

  useFrame(() => {
    camera.position.lerp(desired.current, 0.03);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookAt.current, 0.05);
      controlsRef.current.update();
    }
  });

  return null;
}

/* ---------- HUD overlay (planet info panel) -------------------------------- */
function Hud({ selected, hovered, onClear }) {
  const planet = selected
    ? PLANETS.find((p) => p.name === selected)
    : hovered
    ? PLANETS.find((p) => p.name === hovered)
    : null;

  return (
    <>
      {planet && (
        <div
          data-testid={`planet-panel-${planet.name.toLowerCase()}`}
          style={{
            position: "absolute",
            bottom: 18,
            right: 18,
            padding: "16px 18px",
            borderRadius: 16,
            background: "rgba(6,18,40,0.78)",
            border: `1px solid ${planet.emissive}55`,
            color: "#e0f2fe",
            fontFamily: "ui-sans-serif, system-ui",
            minWidth: 240,
            maxWidth: 320,
            backdropFilter: "blur(14px)",
            boxShadow: `0 10px 40px -10px ${planet.emissive}55`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span
              style={{
                width: 10, height: 10, borderRadius: "50%",
                background: planet.emissive, boxShadow: `0 0 12px ${planet.emissive}`,
              }}
            />
            <span style={{
              fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.7,
            }}>
              {selected ? "Selected planet" : "Hover preview"}
            </span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>
            {planet.name}
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>{planet.signal}</div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: planet.emissive }}>
              {planet.metric}
            </span>
            <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6 }}>
              avg lift
            </span>
          </div>
          {selected && (
            <button
              data-testid="planet-deselect-btn"
              onClick={onClear}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "8px 12px",
                borderRadius: 999,
                background: "transparent",
                border: "1px solid rgba(95,200,255,0.4)",
                color: "#cfe7ff",
                fontFamily: "ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Reset view
            </button>
          )}
        </div>
      )}
    </>
  );
}

/* ---------- Main scene wrapper -------------------------------------------- */
export default function HeroSignalScene() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const controlsRef = useRef(null);

  return (
    <div
      data-testid="hero-universe-scene"
      className="absolute inset-0"
      style={{
        background: `radial-gradient(120% 90% at 50% 30%, ${PALETTE.bgTop} 0%, ${PALETTE.bgBottom} 70%, #000 100%)`,
        overflow: "hidden",
        borderRadius: "inherit",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 6, 22], fov: 55, near: 0.1, far: 400 }}
        onPointerMissed={() => setSelected(null)}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} color="#9ec5ff" />
        <hemisphereLight args={["#1e3a8a", "#020617", 0.45]} />
        <directionalLight position={[10, 12, 8]} intensity={0.6} color="#bae6fd" />

        <Stars radius={180} depth={80} count={9000} factor={3.2} saturation={0.4} fade speed={0.4} />
        <NebulaDust />
        <MilkyWay />

        <Sun
          onClick={() => setSelected(null)}
          selected={selected === null}
        />

        {PLANETS.map((p) => (
          <OrbitRing
            key={`ring-${p.name}`}
            distance={p.distance}
            highlight={selected === p.name || hovered === p.name}
          />
        ))}

        {PLANETS.map((p) => (
          <Planet
            key={p.name}
            data={p}
            selected={selected === p.name}
            hovered={hovered === p.name}
            onSelect={(n) => setSelected((prev) => (prev === n ? null : n))}
            onHover={(n) => setHovered(n)}
            onUnhover={() => setHovered(null)}
          />
        ))}

        <Comet />

        <CameraRig target={selected} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enablePan
          enableZoom
          enableRotate
          minDistance={4}
          maxDistance={70}
          zoomSpeed={0.9}
          rotateSpeed={0.7}
          panSpeed={0.7}
        />
      </Canvas>

      <Hud
        selected={selected}
        hovered={hovered}
        onClear={() => setSelected(null)}
      />
    </div>
  );
}