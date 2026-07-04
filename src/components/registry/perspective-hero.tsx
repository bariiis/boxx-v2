"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// =========================================
// TYPES
// =========================================

export interface PerspectiveHeroConfig {
  /** Big heading — three lines, second and third offset */
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  line5?: string;
  line6?: string;
  /** Card content (the white square projected on the model) */
  cardTitle?: string;
  cardDescription?: string;
  cardFooter?: string;
  /** Scroll hint text */
  scrollLabel?: string;
  /** Optional: override the model URL */
  modelUrl?: string;
  /** Background scene color */
  sceneBackground?: string;
  dark?: boolean;
}

// =========================================
// DEFAULTS
// =========================================

const DEFAULT_MODEL = "/perspective-hero-model.glb";

const CAMERA_FOV = 45;
const REST_POSITION = new THREE.Vector3(0, 0, 15);
const LOOK_TARGET = new THREE.Vector3(0, -1, -4);

// Scroll-driven camera keyframes (progress 0→1)
const KEYFRAMES = [
  { x: 0,   y: 0,  z: 0,   roll: 0    },
  { x: 20,  y: -2, z: -10, roll: 0.22 },
  { x: -15, y: 10, z: -5,  roll: -0.22 },
  { x: 0,   y: 0,  z: 0,   roll: 0    },
];

// =========================================
// UTILS
// =========================================

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function keyframeValue(progress: number) {
  const segments = KEYFRAMES.length - 1;
  const scaled = progress * segments;
  const idx = Math.min(Math.floor(scaled), segments - 1);
  const t = smoothstep(scaled - idx);
  const a = KEYFRAMES[idx];
  const b = KEYFRAMES[idx + 1];
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
    roll: a.roll + (b.roll - a.roll) * t,
  };
}

// =========================================
// HTML → CANVAS TEXTURE
// =========================================

class HtmlToCanvas {
  element: HTMLElement;
  pixelRatio: number;
  extraCss: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  width: number;
  height: number;
  private _rendering = false;
  private _pending = false;
  private _current: Promise<void> | null = null;

  constructor(element: HTMLElement, opts: { width: number; height: number; pixelRatio?: number }) {
    this.element = element;
    this.pixelRatio = Math.min(opts.pixelRatio ?? window.devicePixelRatio, 2);
    this.extraCss = "";
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
    this.width = 0;
    this.height = 0;
    this.resize(opts.width, opts.height);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  async update() {
    if (this._rendering) { this._pending = true; return this._current; }
    this._rendering = true;
    this._current = (async () => {
      try {
        do {
          this._pending = false;
          const nextW = Math.floor(this.width * this.pixelRatio);
          const nextH = Math.floor(this.height * this.pixelRatio);
          if (nextW !== this.canvas.width || nextH !== this.canvas.height) {
            this.canvas.width = nextW;
            this.canvas.height = nextH;
            this.texture.dispose();
          }
          const url = this.#buildSvgDataUrl();
          const img = new Image();
          img.src = url;
          await img.decode();
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
          this.texture.needsUpdate = true;
        } while (this._pending);
      } finally {
        this._rendering = false;
        this._current = null;
      }
    })();
    return this._current;
  }

  #buildSvgDataUrl() {
    const serialized = new XMLSerializer().serializeToString(this.element);
    const styleBlock = this.extraCss
      ? `<style xmlns="http://www.w3.org/1999/xhtml">/*<![CDATA[*/${this.extraCss}/*]]>*/</style>`
      : "";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:${this.width}px;height:${this.height}px;">
          ${styleBlock}${serialized}
        </div>
      </foreignObject>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  dispose() { this.texture.dispose(); }
}

// =========================================
// CSS COLLECTOR
// =========================================

async function collectDocumentCss(): Promise<string> {
  const chunks = await Promise.all(Array.from(document.styleSheets).map(readSheet));
  return chunks.filter(Boolean).join("\n");
}

async function readSheet(sheet: CSSStyleSheet): Promise<string> {
  try {
    const rules = sheet.cssRules;
    if (rules) return Array.from(rules).map(r => r.cssText).join("\n");
  } catch { /* cross-origin */ }
  if (!sheet.href) return "";
  try {
    const res = await fetch(sheet.href);
    const css = await res.text();
    return await inlineFontUrls(css);
  } catch { return ""; }
}

async function inlineFontUrls(css: string): Promise<string> {
  const urlRegex = /url\((https:\/\/[^)"']+)\)/g;
  const urls = [...new Set([...css.matchAll(urlRegex)].map(m => m[1]))];
  if (!urls.length) return css;
  const pairs = await Promise.all(urls.map(async url => {
    try {
      const r = await fetch(url);
      const blob = await r.blob();
      const dataUri = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(blob);
      });
      return [url, dataUri] as [string, string];
    } catch { return [url, null] as [string, null]; }
  }));
  let out = css;
  for (const [orig, dataUri] of pairs) {
    if (dataUri) out = out.split(orig).join(dataUri);
  }
  return out;
}

// =========================================
// PROJECTED MATERIAL
// =========================================

function createProjector(opts: { camera: THREE.PerspectiveCamera; texture: THREE.Texture }) {
  const { camera, texture } = opts;
  const uniforms = {
    projectedTexture: { value: texture },
    projectorViewMatrix: { value: new THREE.Matrix4() },
    projectorProjectionMatrix: { value: new THREE.Matrix4() },
    projectorPosition: { value: new THREE.Vector3() },
    uLitness: { value: 0 },
  };

  function applyTo(mesh: THREE.Mesh) {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (!mat) return;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.projectedTexture = uniforms.projectedTexture;
      shader.uniforms.projectorViewMatrix = uniforms.projectorViewMatrix;
      shader.uniforms.projectorProjectionMatrix = uniforms.projectorProjectionMatrix;
      shader.uniforms.projectorPosition = uniforms.projectorPosition;
      shader.uniforms.uLitness = uniforms.uLitness;

      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>
uniform mat4 projectorViewMatrix;
uniform mat4 projectorProjectionMatrix;
uniform vec3 projectorPosition;
varying vec4 vProjectedCoord;
varying vec3 vProjectorDir;
varying vec3 vProjectorNormal;`)
        .replace("#include <begin_vertex>", `#include <begin_vertex>
vec4 _projWorld = modelMatrix * vec4(transformed, 1.0);
vProjectedCoord = projectorProjectionMatrix * projectorViewMatrix * _projWorld;
vProjectorDir = normalize(projectorPosition - _projWorld.xyz);
vProjectorNormal = normalize(mat3(modelMatrix) * normal);`);

      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>
uniform sampler2D projectedTexture;
uniform float uLitness;
varying vec4 vProjectedCoord;
varying vec3 vProjectorDir;
varying vec3 vProjectorNormal;`)
        .replace("#include <color_fragment>", `#include <color_fragment>
vec3 _projNDC = vProjectedCoord.xyz / vProjectedCoord.w;
vec2 _projUV = _projNDC.xy * 0.5 + 0.5;
float _inFrustum = step(0.0,_projUV.x)*step(_projUV.x,1.0)*step(0.0,_projUV.y)*step(_projUV.y,1.0)*step(-1.0,_projNDC.z)*step(_projNDC.z,1.0);
float _facing = step(0.0, dot(vProjectorNormal, vProjectorDir));
vec4 _projColor = texture2D(projectedTexture, _projUV);
float _mask = _inFrustum * _facing * _projColor.a;
diffuseColor.rgb = mix(diffuseColor.rgb, _projColor.rgb, _mask);
vec3 _flatDiffuse = diffuseColor.rgb;`)
        .replace("#include <opaque_fragment>", `#include <opaque_fragment>
gl_FragColor.rgb = mix(_flatDiffuse, gl_FragColor.rgb, uLitness);`);

      mat.needsUpdate = true;
    };
  }

  function update() {
    camera.updateMatrixWorld();
    uniforms.projectorViewMatrix.value.copy(camera.matrixWorldInverse);
    uniforms.projectorProjectionMatrix.value.copy(camera.projectionMatrix);
    uniforms.projectorPosition.value.setFromMatrixPosition(camera.matrixWorld);
  }

  return { applyTo, update, uniforms };
}

// =========================================
// MAIN COMPONENT
// =========================================

export default function PerspectiveHero({
  line1 = "Designing",
  line2 = "Motion",
  line3 = "Crafting",
  line4 = "Depth",
  line5 = "Into Living",
  line6 = "Worlds",
  cardTitle = "Kurumsal Donanım\nÇözümleri",
  cardDescription = "Yüksek performans iş yükleri için mühendislik odaklı yaklaşım.",
  cardFooter = "stuux.com",
  scrollLabel = "SCROLL DOWN",
  modelUrl = DEFAULT_MODEL,
  sceneBackground = "#ffffff",
  dark = false,
}: PerspectiveHeroConfig) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const pageInnerRef = useRef<HTMLDivElement>(null); // inner content — no offscreen styles
  const [mounted, setMounted] = useState(false);
  const [resolvedFont, setResolvedFont] = useState("'Urbanist', sans-serif");
  useEffect(() => {
    setMounted(true);
    // next/font registers the font under a generated name (e.g. __Urbanist_xxxxx).
    // Reading the CSS variable at runtime gives us the actual usable font-family string.
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-urbanist")
      .trim();
    if (val) setResolvedFont(val);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvasWrap = canvasWrapRef.current;
    const pageInner = pageInnerRef.current;
    if (!section || !canvasWrap || !pageInner) return;

    // ── Renderer ───────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvas = renderer.domElement;
    canvas.style.position = "sticky";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100vh";
    canvas.style.display = "block";
    canvasWrap.appendChild(canvas);

    // ── Scene / Camera ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneBackground);

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, w / h, 1, 100);
    camera.position.copy(REST_POSITION);
    camera.lookAt(LOOK_TARGET);

    // ── Lights ─────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(5, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 50;
    Object.assign(key.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15 });
    key.shadow.bias = -0.0001;
    key.shadow.normalBias = 0.02;
    scene.add(key);

    // ── HTML → Texture ─────────────────────────────────────────────────
    // Pass the INNER content div — not the outer offscreen wrapper whose
    // "left: -200vw" inline style would be serialized into the SVG and
    // shift the entire rasterized content 200vw to the left.
    const htmlToCanvas = new HtmlToCanvas(pageInner, { width: w, height: h });
    let projector: ReturnType<typeof createProjector> | null = null;
    const projectedMeshes: THREE.Mesh[] = [];

    // Projector camera stays at rest
    const projCamera = new THREE.PerspectiveCamera(CAMERA_FOV, w / h, 1, 100);
    projCamera.position.copy(REST_POSITION);
    projCamera.lookAt(LOOK_TARGET);
    projCamera.updateMatrixWorld();

    async function rasterize() {
      if (document.fonts?.ready) await document.fonts.ready;
      if (!htmlToCanvas.extraCss) htmlToCanvas.extraCss = await collectDocumentCss();
      await htmlToCanvas.update();
    }

    // ── Load GLB ───────────────────────────────────────────────────────
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const standardMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const basicMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const effectiveModel = modelUrl || DEFAULT_MODEL;
    const resolvedModelUrl = effectiveModel.startsWith("http")
      ? `/api/glb-proxy?url=${encodeURIComponent(effectiveModel)}`
      : effectiveModel;

    const onGltfLoad = (gltf: { scene: THREE.Group }) => {
      const model = gltf.scene;
      model.traverse((c) => {
        if (!(c as THREE.Mesh).isMesh) return;
        const mesh = c as THREE.Mesh;
        if (mesh.userData.name === "bg") {
          mesh.material = basicMat;
          mesh.castShadow = false;
          mesh.receiveShadow = true;
        } else {
          mesh.material = standardMat;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
        projectedMeshes.push(mesh);
      });
      scene.add(model);

      // Setup projection
      projector = createProjector({ camera: projCamera, texture: htmlToCanvas.texture });
      for (const mesh of projectedMeshes) projector.applyTo(mesh);
      projector.update();
      rasterize();
    };

    console.log("[PerspectiveHero] loading GLB from:", resolvedModelUrl)

    fetch(resolvedModelUrl)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text().catch(() => `HTTP ${res.status}`);
          let msg = body;
          try { msg = JSON.parse(body).error ?? body; } catch { /* not json */ }
          throw new Error(`[PerspectiveHero] Proxy error ${res.status}: ${msg}`);
        }
        return res.arrayBuffer();
      })
      .then((buffer) => {
        gltfLoader.parse(buffer, "", onGltfLoad, (err) => {
          console.error("[PerspectiveHero] GLTF parse failed:", err);
        });
      })
      .catch((err) => {
        console.error("[PerspectiveHero] GLB load failed:", err);
      });

    // ── Scroll progress ────────────────────────────────────────────────
    let scrollProgress = 0;

    function updateProgress() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) { scrollProgress = 0; return; }
      scrollProgress = Math.max(0, Math.min(1, -rect.top / total));
    }

    // ── Render loop ────────────────────────────────────────────────────
    let raf = 0;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      clock.getDelta();
      updateProgress();
      const kf = keyframeValue(scrollProgress);
      camera.position.set(
        REST_POSITION.x + kf.x,
        REST_POSITION.y + kf.y,
        REST_POSITION.z + kf.z,
      );
      camera.lookAt(LOOK_TARGET);
      camera.rotateZ(kf.roll);
      if (projector) {
        const dist = Math.min(scrollProgress, 1 - scrollProgress) * 2;
        projector.uniforms.uLitness.value = smoothstep(Math.min(dist, 1));
      }
      renderer.render(scene, camera);
    }
    animate();

    // ── Resize ─────────────────────────────────────────────────────────
    function onResize() {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      projCamera.aspect = nw / nh;
      projCamera.updateProjectionMatrix();
      if (projector) projector.update();
      htmlToCanvas.resize(nw, nh);
      rasterize();
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      htmlToCanvas.dispose();
      dracoLoader.dispose();
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl, sceneBackground]);

  // fg is derived from sceneBackground luminance so it's always readable,
  // regardless of what the user sets for the dark toggle.
  const bg = sceneBackground || "#ffffff";
  const r = parseInt(bg.slice(1, 3) || "ff", 16);
  const g = parseInt(bg.slice(3, 5) || "ff", 16);
  const b = parseInt(bg.slice(5, 7) || "ff", 16);
  const isLight = (r * 299 + g * 587 + b * 114) / 1000 > 128;
  const fg = isLight ? "#000000" : "#ffffff";
  const cardBg = dark ? "#18181b" : "#ff4d2e";
  // Contrast color for text ON the card (independent of scene background)
  const cr = parseInt(cardBg.slice(1, 3), 16);
  const cg = parseInt(cardBg.slice(3, 5), 16);
  const cb = parseInt(cardBg.slice(5, 7), 16);
  const cardFg = (cr * 299 + cg * 587 + cb * 114) / 1000 > 128 ? "#000000" : "#ffffff";

  // Pixel sizes computed from window — vw/rem units are unreliable in
  // SVG foreignObject restricted mode (no viewport reference).
  // Use SSR-safe fallback on server; real value after mount.
  const vw = mounted ? window.innerWidth : 1440;
  const cardPx = Math.round(Math.min(vw * 0.38, 340));
  const headingPx = Math.round(Math.min(vw * 0.07, 96));

  // All offscreen projected content MUST use inline styles only.
  // SVG foreignObject runs in restricted mode — Tailwind classes and
  // media queries are not available there.
  const headingStyle: React.CSSProperties = {
    fontFamily: resolvedFont,
    fontWeight: 900,
    fontSize: `${Math.max(headingPx, 45)}px`,
    lineHeight: 1.0,
    color: fg,
    margin: 0,
    padding: 0,
  };

  return (
    <>
      {/* Scroll spacer — sticky canvas lives inside */}
      <div ref={sectionRef} style={{ height: "300vh", position: "relative" }}>
        <div ref={canvasWrapRef} style={{ position: "sticky", top: 0, height: "100vh" }} />
      </div>

      {/* Offscreen wrapper — visually hidden, never serialized into the texture */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-200vw",
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        {/* pageInnerRef — this exact element is serialized into SVG.
            All styles MUST be inline; no Tailwind classes are available
            inside SVG foreignObject restricted mode. */}
        <div
          ref={pageInnerRef}
          style={{
            width: "100vw",
            height: "100vh",
            background: sceneBackground,
            color: fg,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "visible",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          {/* Scroll hint */}
          <p style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: resolvedFont,
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: fg,
            opacity: 0.4,
            margin: 0,
            whiteSpace: "nowrap",
          }}>
            {scrollLabel}
          </p>

          {/* Staggered headings — three groups like original */}
          <div style={{
            width: "100%",
            maxWidth: "70rem",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}>
            {/* Group 1 — centered */}
            <div style={{ width: "100%", maxWidth: "32rem", alignSelf: "center", display: "flex", flexDirection: "column" }}>
              <h1 style={{ ...headingStyle, alignSelf: "flex-start" }}>{line1}</h1>
              <h2 style={{ ...headingStyle, alignSelf: "flex-end" }}>{line2}</h2>
            </div>
            {/* Group 2 — left */}
            <div style={{ width: "100%", maxWidth: "28rem", alignSelf: "flex-start", display: "flex", flexDirection: "column" }}>
              <h2 style={{ ...headingStyle, alignSelf: "flex-start" }}>{line3}</h2>
              <h2 style={{ ...headingStyle, alignSelf: "flex-end" }}>{line4}</h2>
            </div>
            {/* Group 3 — right */}
            <div style={{ width: "100%", maxWidth: "28rem", alignSelf: "flex-end", display: "flex", flexDirection: "column" }}>
              <h2 style={{ ...headingStyle, alignSelf: "flex-start" }}>{line5}</h2>
              <h2 style={{ ...headingStyle, alignSelf: "flex-end" }}>{line6}</h2>
            </div>
          </div>

          {/* Card — square, absolutely centered, projected onto the flat mesh */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${cardPx}px`,
            height: `${cardPx}px`,
            background: cardBg,
            color: cardFg,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: "2rem",
            boxSizing: "border-box",
            gap: "1rem",
          }}>
            <p style={{ fontFamily: resolvedFont, fontSize: "0.7rem", opacity: 0.5, margin: 0, color: cardFg }}>
              {cardFooter}
            </p>
            <p style={{ fontFamily: resolvedFont, fontWeight: 700, fontSize: "1rem", lineHeight: 1.4, margin: 0, color: cardFg, whiteSpace: "pre-line" }}>
              {cardTitle}
            </p>
            <p style={{ fontFamily: resolvedFont, fontSize: "0.8rem", lineHeight: 1.5, opacity: 0.7, margin: 0, color: cardFg }}>
              {cardDescription}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
