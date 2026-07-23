import * as THREE from "three";
import {
  Component,
  memo,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Canvas,
  useThree,
} from "@react-three/fiber";

import {
  Html,
  OrbitControls,
  useTexture,
} from "@react-three/drei";

import Loading from "./Loading";

THREE.Cache.enabled = true;

/*
|--------------------------------------------------------------------------
| Finish settings
|--------------------------------------------------------------------------
*/

const FINISH_SETTINGS = {
  POLISHED: {
    roughness: 0.08,
    envMapIntensity: 2,
  },

  BRUSHED: {
    roughness: 0.75,
    envMapIntensity: 0.4,
  },

  HONED: {
    roughness: 0.55,
    envMapIntensity: 0.6,
  },

  LEATHER: {
    roughness: 0.8,
    envMapIntensity: 0.3,
  },

  FLAMMED: {
    roughness: 1,
    envMapIntensity: 0.2,
  },

  FLAMED: {
    roughness: 1,
    envMapIntensity: 0.2,
  },

  MATT: {
    roughness: 0.95,
    envMapIntensity: 0.2,
  },

  MATTE: {
    roughness: 0.95,
    envMapIntensity: 0.2,
  },
};

const DEFAULT_FINISH = "POLISHED";

/*
|--------------------------------------------------------------------------
| Camera settings
|--------------------------------------------------------------------------
*/

const PREVIEW_CAMERA = {
  position: [0.5, -10.05, -1.95],
  fov: 5,
  near: 0.1,
  far: 100,
};

const FULLSCREEN_CAMERA = {
  position: [3.5, -5.86, -27.58],
  fov: 10,
  near: 0.1,
  far: 100,
};

/*
|--------------------------------------------------------------------------
| CDN URL helper
|--------------------------------------------------------------------------
|
| Development:
|
| https://cdn.ultrastone.in/example.avif
|
| becomes:
|
| /stone-cdn/example.avif
|
| This requires the Vite proxy configuration shown below.
|
*/

function getTextureUrl(url) {
  if (
    typeof url !== "string" ||
    !url.trim()
  ) {
    return "";
  }

  const cleanUrl = url.trim();

  if (
    import.meta.env.DEV &&
    cleanUrl.startsWith(
      "https://cdn.ultrastone.in/"
    )
  ) {
    return cleanUrl.replace(
      "https://cdn.ultrastone.in",
      "/stone-cdn"
    );
  }

  return cleanUrl;
}

/*
|--------------------------------------------------------------------------
| Loading component
|--------------------------------------------------------------------------
*/

function Loader() {
  return (
    <Html center>
      <div
        style={{
          color: "#fff",
          pointerEvents: "none",
        }}
      >
        <Loading />
      </div>
    </Html>
  );
}

/*
|--------------------------------------------------------------------------
| Error boundary
|--------------------------------------------------------------------------
*/

class ViewerErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "Model viewer error:",
      error,
      errorInfo
    );
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.resetKey !==
        this.props.resetKey &&
      this.state.hasError
    ) {
      this.setState({
        hasError: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f3f3f3",
            color: "#666",
            textAlign: "center",
            padding: 20,
          }}
        >
          <strong
            style={{
              fontSize: 15,
              marginBottom: 5,
            }}
          >
            Unable to load 3D preview
          </strong>

          <span
            style={{
              fontSize: 13,
            }}
          >
            The slab texture could not be loaded.
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}

/*
|--------------------------------------------------------------------------
| Texture setup
|--------------------------------------------------------------------------
*/

function useConfiguredTexture(textureUrl) {
  const sourceTexture =
    useTexture(textureUrl);

  const { gl } = useThree();

  const texture = useMemo(() => {
    return sourceTexture.clone();
  }, [sourceTexture]);

  useEffect(() => {
    const maxAnisotropy =
      gl.capabilities.getMaxAnisotropy();

    texture.colorSpace =
      THREE.SRGBColorSpace;

    texture.anisotropy = Math.min(
      maxAnisotropy,
      8
    );

    texture.generateMipmaps = true;

    texture.minFilter =
      THREE.LinearMipmapLinearFilter;

    texture.magFilter =
      THREE.LinearFilter;

    texture.wrapS =
      THREE.ClampToEdgeWrapping;

    texture.wrapT =
      THREE.ClampToEdgeWrapping;

    texture.needsUpdate = true;

    return () => {
      texture.dispose();
    };
  }, [texture, gl]);

  return texture;
}

/*
|--------------------------------------------------------------------------
| Stone slab
|--------------------------------------------------------------------------
*/

const StoneSlab = memo(function StoneSlab({
  textureUrl,
  finish,
}) {
  const texture =
    useConfiguredTexture(textureUrl);

  const material = useMemo(() => {
    const finishName =
      typeof finish === "string"
        ? finish.trim().toUpperCase()
        : DEFAULT_FINISH;

    return (
      FINISH_SETTINGS[finishName] ||
      FINISH_SETTINGS[DEFAULT_FINISH]
    );
  }, [finish]);

  return (
    <mesh
      rotation={[-0.08, -0.25, 0]}
      frustumCulled
    >
      <boxGeometry
        args={[4, 2.4, 0.05]}
      />

      <meshStandardMaterial
        map={texture}
        roughness={material.roughness}
        envMapIntensity={
          material.envMapIntensity
        }
        metalness={0}
        side={THREE.FrontSide}
      />
    </mesh>
  );
});

/*
|--------------------------------------------------------------------------
| Lighting
|--------------------------------------------------------------------------
*/

const SceneLights = memo(
  function SceneLights({ preview }) {
    return (
      <>
        <ambientLight
          intensity={preview ? 1.8 : 2}
        />

        <directionalLight
          position={[10, 10, 10]}
          intensity={0.65}
        />

        <directionalLight
          position={[-10, 10, 10]}
          intensity={0.45}
        />

        <directionalLight
          position={[10, 10, -10]}
          intensity={0.3}
        />
      </>
    );
  }
);

/*
|--------------------------------------------------------------------------
| Viewer scene
|--------------------------------------------------------------------------
*/

const ViewerScene = memo(
  function ViewerScene({
    poster,
    finish,
    preview,
  }) {
    return (
      <>
        <SceneLights preview={preview} />

        <Suspense fallback={<Loader />}>
          <StoneSlab
            textureUrl={poster}
            finish={finish}
          />
        </Suspense>

        {!preview && (
          <OrbitControls
            makeDefault
            enableZoom
            enablePan
            enableRotate
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.65}
            zoomSpeed={0.8}
            panSpeed={0.7}
            autoRotate
            autoRotateSpeed={2}
            minDistance={4}
            maxDistance={45}
          />
        )}
      </>
    );
  }
);

/*
|--------------------------------------------------------------------------
| Canvas
|--------------------------------------------------------------------------
*/

const ViewerCanvas = memo(
  function ViewerCanvas({
    poster,
    finish,
    preview = false,
  }) {
    const cameraSettings = preview
      ? PREVIEW_CAMERA
      : FULLSCREEN_CAMERA;

    return (
      <Canvas
        frameloop={
          preview ? "demand" : "always"
        }
        dpr={
          preview ? 1 : [1, 1.5]
        }
        camera={cameraSettings}
        gl={{
          antialias: !preview,
          alpha: true,
          powerPreference:
            "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
        }}
        performance={{
          min: 0.5,
          max: 1,
          debounce: 200,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace =
            THREE.SRGBColorSpace;

          gl.toneMapping =
            THREE.ACESFilmicToneMapping;

          gl.toneMappingExposure = 1;

          gl.setClearColor(
            0x000000,
            0
          );
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <ViewerScene
          poster={poster}
          finish={finish}
          preview={preview}
        />
      </Canvas>
    );
  }
);

/*
|--------------------------------------------------------------------------
| Main component
|--------------------------------------------------------------------------
*/

function ModelViewer({
  poster,
  height = 270,
  finishes = [],
}) {
  const normalizedPoster = useMemo(
    () => getTextureUrl(poster),
    [poster]
  );

  const normalizedFinishes = useMemo(() => {
    if (!Array.isArray(finishes)) {
      return [];
    }

    return finishes
      .filter(
        (item) =>
          typeof item === "string" &&
          item.trim()
      )
      .map((item) => item.trim());
  }, [finishes]);

  const defaultFinish =
    normalizedFinishes[0] ||
    "Polished";

  const [open, setOpen] =
    useState(false);

  const [
    selectedFinish,
    setSelectedFinish,
  ] = useState(defaultFinish);

  useEffect(() => {
    setSelectedFinish(
      (currentFinish) => {
        if (
          normalizedFinishes.includes(
            currentFinish
          )
        ) {
          return currentFinish;
        }

        return defaultFinish;
      }
    );
  }, [
    normalizedFinishes,
    defaultFinish,
  ]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  if (!normalizedPoster) {
    return (
      <div
        style={{
          width: "100%",
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f3f3",
          color: "#666",
          borderRadius: 8,
          fontSize: 14,
        }}
      >
        Preview unavailable
      </div>
    );
  }

  return (
    <>
      {/*
       * Only one Canvas is mounted at a time.
       *
       * This prevents multiple WebGL contexts
       * and improves performance.
       */}
      {!open && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Open stone slab viewer"
          onClick={() => setOpen(true)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              setOpen(true);
            }
          }}
          style={{
            width: "100%",
            height,
            cursor: "pointer",
            overflow: "hidden",
            borderRadius: 8,
            position: "relative",
            background: "#f3f3f3",
            contain: "layout paint size",
          }}
        >
          <ViewerErrorBoundary
            resetKey={normalizedPoster}
          >
            <ViewerCanvas
              poster={normalizedPoster}
              finish={selectedFinish}
              preview
            />
          </ViewerErrorBoundary>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Stone slab viewer"
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            background:
              "rgba(0,0,0,.92)",
            zIndex: 99999,
            overflow: "hidden",
          }}
        >
          <button
            type="button"
            aria-label="Close viewer"
            onClick={() =>
              setOpen(false)
            }
            style={{
              position: "absolute",
              right: 30,
              top: 20,
              zIndex: 100000,
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              lineHeight: 1,
              color: "#fff",
              background:
                "rgba(0,0,0,.35)",
              border:
                "1px solid rgba(255,255,255,.2)",
              borderRadius: "50%",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ×
          </button>

          {normalizedFinishes.length >
            0 && (
            <div
              style={{
                position: "absolute",
                top: 30,
                left: 30,
                zIndex: 100000,
              }}
            >
              <select
                value={selectedFinish}
                onChange={(event) =>
                  setSelectedFinish(
                    event.target.value
                  )
                }
                style={{
                  minWidth: 150,
                  padding:
                    "12px 38px 12px 20px",
                  background: "#111",
                  color: "#fff",
                  border:
                    "1px solid rgba(255,255,255,.2)",
                  borderRadius: 10,
                  fontSize: 16,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {normalizedFinishes.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <div
            style={{
              width: "100vw",
              height: "100vh",
            }}
          >
            <ViewerErrorBoundary
              resetKey={normalizedPoster}
            >
              <ViewerCanvas
                poster={normalizedPoster}
                finish={selectedFinish}
                preview={false}
              />
            </ViewerErrorBoundary>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(ModelViewer);