import * as THREE from "three";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Canvas,
  useLoader,
  useThree,
} from "@react-three/fiber";
import {
  Center,
  Html,
  OrbitControls,
  useProgress,
} from "@react-three/drei";

import Loading from "./Loading";

THREE.Cache.enabled = true;

/*
|--------------------------------------------------------------------------
| Viewer defaults
|--------------------------------------------------------------------------
*/

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(
  3.17,
  -1.08,
  -20.75
);

const DEFAULT_TARGET = new THREE.Vector3(
  0,
  -0.55,
  0
);

const FINISH_SETTINGS = {
  POLISHED: {
    roughness: 0.08,
    metalness: 0,
    envMapIntensity: 2,
  },

  BRUSHED: {
    roughness: 0.75,
    metalness: 0,
    envMapIntensity: 0.4,
  },

  HONED: {
    roughness: 0.55,
    metalness: 0,
    envMapIntensity: 0.6,
  },

  LEATHER: {
    roughness: 0.8,
    metalness: 0,
    envMapIntensity: 0.3,
  },

  FLAMMED: {
    roughness: 1,
    metalness: 0,
    envMapIntensity: 0.2,
  },

  FLAMED: {
    roughness: 1,
    metalness: 0,
    envMapIntensity: 0.2,
  },

  MATTE: {
    roughness: 0.95,
    metalness: 0,
    envMapIntensity: 0.2,
  },

  MATT: {
    roughness: 0.95,
    metalness: 0,
    envMapIntensity: 0.2,
  },
};

/*
|--------------------------------------------------------------------------
| Loader
|--------------------------------------------------------------------------
*/

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div
        style={{
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          minWidth: 140,
          pointerEvents: "none",
        }}
      >
        <Loading />

        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

/*
|--------------------------------------------------------------------------
| Stone model
|--------------------------------------------------------------------------
*/

function StoneSlab({
  textureUrl,
  finish,
}) {
  const texture = useLoader(
    THREE.TextureLoader,
    textureUrl,
    (loader) => {
      loader.setCrossOrigin("anonymous");
    }
  );

  const { gl } = useThree();

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.anisotropy = Math.min(
      8,
      gl.capabilities.getMaxAnisotropy()
    );

    texture.generateMipmaps = true;

    texture.minFilter =
      THREE.LinearMipmapLinearFilter;

    texture.magFilter =
      THREE.LinearFilter;

    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.needsUpdate = true;
  }, [texture, gl]);

  const materialSettings = useMemo(() => {
    const normalizedFinish =
      finish?.trim().toUpperCase();

    return (
      FINISH_SETTINGS[normalizedFinish] ||
      FINISH_SETTINGS.POLISHED
    );
  }, [finish]);

  return (
    <group position={[0, -0.65, 0]}>
      <Center>
        <mesh
          castShadow
          receiveShadow
          rotation={[-0.08, -0.25, 0]}
        >
          <boxGeometry
            args={[4, 2.4, 0.05]}
          />

          <meshStandardMaterial
            map={texture}
            roughness={
              materialSettings.roughness
            }
            metalness={
              materialSettings.metalness
            }
            envMapIntensity={
              materialSettings.envMapIntensity
            }
          />
        </mesh>
      </Center>
    </group>
  );
}

/*
|--------------------------------------------------------------------------
| Camera controller
|--------------------------------------------------------------------------
*/

function CameraController({
  controlsRef,
  cameraRef,
  rendererRef,
  sceneRef,
  autoRotate,
}) {
  const {
    camera,
    gl,
    scene,
  } = useThree();

  useEffect(() => {
    cameraRef.current = camera;
    rendererRef.current = gl;
    sceneRef.current = scene;
  }, [
    camera,
    gl,
    scene,
    cameraRef,
    rendererRef,
    sceneRef,
  ]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom
      enablePan
      enableRotate
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.65}
      zoomSpeed={0.8}
      panSpeed={0.55}
      minDistance={8}
      maxDistance={35}
      autoRotate={autoRotate}
      autoRotateSpeed={2}
      target={[
        DEFAULT_TARGET.x,
        DEFAULT_TARGET.y,
        DEFAULT_TARGET.z,
      ]}
    />
  );
}

/*
|--------------------------------------------------------------------------
| Fullscreen canvas
|--------------------------------------------------------------------------
*/

function ViewerCanvas({
  poster,
  finish,
  autoRotate,
  lightIntensity,
  background,
  controlsRef,
  cameraRef,
  rendererRef,
  sceneRef,
  onReset,
}) {
  const cameraSettings = useMemo(
    () => ({
      position: [
        DEFAULT_CAMERA_POSITION.x,
        DEFAULT_CAMERA_POSITION.y,
        DEFAULT_CAMERA_POSITION.z,
      ],
      fov: 10,
      near: 0.1,
      far: 1000,
    }),
    []
  );

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={cameraSettings}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      onCreated={({
        gl,
        camera,
        scene,
      }) => {
        rendererRef.current = gl;
        cameraRef.current = camera;
        sceneRef.current = scene;

        gl.outputColorSpace =
          THREE.SRGBColorSpace;

        gl.toneMapping =
          THREE.ACESFilmicToneMapping;

        gl.toneMappingExposure = 1.05;
      }}
      onDoubleClick={onReset}
    >
      <color
        attach="background"
        args={[background]}
      />

      <ambientLight
        intensity={lightIntensity * 0.72}
      />

      <directionalLight
        position={[8, 12, 10]}
        intensity={lightIntensity * 0.42}
        castShadow
      />

      <directionalLight
        position={[-8, 8, 8]}
        intensity={lightIntensity * 0.22}
      />

      <directionalLight
        position={[6, 5, -8]}
        intensity={lightIntensity * 0.18}
      />

      <directionalLight
        position={[-6, 4, -8]}
        intensity={lightIntensity * 0.12}
      />

      <Suspense fallback={<Loader />}>
        <StoneSlab
          textureUrl={poster}
          finish={finish}
        />
      </Suspense>

      <CameraController
        controlsRef={controlsRef}
        cameraRef={cameraRef}
        rendererRef={rendererRef}
        sceneRef={sceneRef}
        autoRotate={autoRotate}
      />
    </Canvas>
  );
}

/*
|--------------------------------------------------------------------------
| Toolbar button
|--------------------------------------------------------------------------
*/

function ControlButton({
  children,
  onClick,
  title,
  active = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 44,
        minWidth: 44,
        padding: "0 15px",

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        border: active
          ? "1px solid rgba(255,255,255,.65)"
          : "1px solid rgba(255,255,255,.22)",

        borderRadius: 9,

        background: active
          ? "rgba(255,255,255,.13)"
          : "rgba(18,18,18,.9)",

        color: "#fff",

        fontSize: 13,
        fontWeight: 700,

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        opacity: disabled ? 0.5 : 1,

        transition:
          "background .2s ease, border-color .2s ease, transform .2s ease",
      }}
      onMouseEnter={(event) => {
        if (!disabled) {
          event.currentTarget.style.background =
            "rgba(35,35,35,.95)";
        }
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background =
          active
            ? "rgba(255,255,255,.13)"
            : "rgba(18,18,18,.9)";
      }}
    >
      {children}
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Fast outside preview
|--------------------------------------------------------------------------
*/

function StaticSlabPreview({
  poster,
  height,
  onOpen,
}) {
  const [imageLoaded, setImageLoaded] =
    useState(false);

  const [hovered, setHovered] =
    useState(false);

  const activateViewer = () => {
    onOpen();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open 3D stone slab viewer"
      onClick={activateViewer}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          activateViewer();
        }
      }}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        cursor: "pointer",
        background:
          "linear-gradient(180deg, #fff 0%, #fff 75%, #f8f8f8 100%)",
        outline: "none",
      }}
    >
        
      <div
        style={{
          position: "absolute",
          left: "3%",
          right: "3%",
          top: "20%",
          bottom: "8%",

          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "4%",
            right: "4%",
            bottom: 0,

            height: 12,

            borderRadius: "50%",

            background:
              "rgba(0,0,0,.18)",

            filter: "blur(6px)",

            opacity: imageLoaded ? 1 : 0,

            transition:
              "opacity .3s ease",
          }}
        />

        <div
          style={{
            position: "relative",

            width: "100%",
            height: "100%",

            opacity: imageLoaded ? 1 : 0,

            transform: hovered
              ? "translateY(-3px)"
              : "translateY(0)",

            transition:
              "opacity .3s ease, transform .3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",

              left: "3%",
              right: "3%",
              top: 0,
              bottom: 7,

              overflow: "hidden",

              clipPath:
                "polygon(10.5% 0%, 89.5% 0%, 100% 100%, 0% 100%)",

              background: "#f2f2f2",
            }}
          >
            <img
              src={poster}
              alt="Stone slab preview"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onLoad={() =>
                setImageLoaded(true)
              }
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                objectPosition:
                  "center center",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",

              left: "3%",
              right: "3%",
              bottom: 1,

              height: 7,

              background:
                "linear-gradient(180deg, #eeeeec 0%, #c7c7c4 55%, #9e9e9b 100%)",

              boxShadow:
                "0 3px 4px rgba(0,0,0,.22)",
            }}
          />

          <div
            style={{
              position: "absolute",

              left: "3.2%",
              right: "3.2%",
              bottom: 8,

              height: 1,

              background:
                "rgba(255,255,255,.95)",
            }}
          />
        </div>
      </div>

      {!imageLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            pointerEvents: "none",
          }}
        >
          <Loading />
        </div>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Main component
|--------------------------------------------------------------------------
*/

export default function ModelViewer({
  poster,
  height = 270,
  finishes = [],
}) {
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);

  const [open, setOpen] =
    useState(false);

  const [
    selectedFinish,
    setSelectedFinish,
  ] = useState(
    finishes?.[0] || "Polished"
  );

  /*
   * Starts disabled so the initial button
   * matches your screenshot and says "Rotate".
   */
  const [autoRotate, setAutoRotate] =
    useState(false);

  const [
    lightIntensity,
    setLightIntensity,
  ] = useState(2);

  const [
    backgroundMode,
    setBackgroundMode,
  ] = useState("dark");

  const background =
    backgroundMode === "dark"
      ? "#070707"
      : "#dedede";

  useEffect(() => {
    if (!finishes.length) {
      return;
    }

    if (
      !finishes.includes(
        selectedFinish
      )
    ) {
      setSelectedFinish(finishes[0]);
    }
  }, [
    finishes,
    selectedFinish,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Preload texture
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!poster) {
      return undefined;
    }

    const preloadTexture = () => {
      useLoader.preload(
        THREE.TextureLoader,
        poster,
        (loader) => {
          loader.setCrossOrigin(
            "anonymous"
          );
        }
      );
    };

    if (
      "requestIdleCallback" in window
    ) {
      const requestId =
        window.requestIdleCallback(
          preloadTexture,
          {
            timeout: 1200,
          }
        );

      return () => {
        window.cancelIdleCallback(
          requestId
        );
      };
    }

    const timeoutId =
      window.setTimeout(
        preloadTexture,
        350
      );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [poster]);

  /*
  |--------------------------------------------------------------------------
  | Escape key
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
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
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Lock body scroll
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /*
  |--------------------------------------------------------------------------
  | Reset camera
  |--------------------------------------------------------------------------
  */

  const resetCamera = useCallback(() => {
    const camera = cameraRef.current;
    const controls =
      controlsRef.current;

    if (!camera || !controls) {
      return;
    }

    camera.position.copy(
      DEFAULT_CAMERA_POSITION
    );

    controls.target.copy(
      DEFAULT_TARGET
    );

    camera.updateProjectionMatrix();
    controls.update();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Zoom
  |--------------------------------------------------------------------------
  */

  const zoomCamera = useCallback(
    (direction) => {
      const camera =
        cameraRef.current;

      const controls =
        controlsRef.current;

      if (!camera || !controls) {
        return;
      }

      const target = controls.target;

      const cameraDirection =
        new THREE.Vector3()
          .subVectors(
            camera.position,
            target
          )
          .normalize();

      const currentDistance =
        camera.position.distanceTo(
          target
        );

      const change =
        direction === "in"
          ? -2
          : 2;

      const nextDistance =
        THREE.MathUtils.clamp(
          currentDistance + change,
          8,
          35
        );

      camera.position.copy(
        target
          .clone()
          .add(
            cameraDirection.multiplyScalar(
              nextDistance
            )
          )
      );

      controls.update();
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Screenshot
  |--------------------------------------------------------------------------
  */

  const downloadScreenshot =
    useCallback(() => {
      const renderer =
        rendererRef.current;

      const camera =
        cameraRef.current;

      const scene =
        sceneRef.current;

      if (
        !renderer ||
        !camera ||
        !scene
      ) {
        return;
      }

      renderer.render(
        scene,
        camera
      );

      renderer.domElement.toBlob(
        (blob) => {
          if (!blob) {
            return;
          }

          const blobUrl =
            URL.createObjectURL(blob);

          const link =
            document.createElement("a");

          link.href = blobUrl;
          link.download =
            "stone-slab-view.png";

          document.body.appendChild(
            link
          );

          link.click();
          link.remove();

          URL.revokeObjectURL(blobUrl);
        },
        "image/png",
        1
      );
    }, []);

  if (!poster) {
    return null;
  }

  return (
    <>
      {!open && (
        <StaticSlabPreview
          poster={poster}
          height={height}
          onOpen={() =>
            setOpen(true)
          }
        />
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,

            background,

            zIndex: 99999,

            overflow: "hidden",
          }}
        >
          {/* Fullscreen canvas */}
          <div
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            <ViewerCanvas
              poster={poster}
              finish={selectedFinish}
              autoRotate={autoRotate}
              lightIntensity={
                lightIntensity
              }
              background={background}
              controlsRef={
                controlsRef
              }
              cameraRef={cameraRef}
              rendererRef={
                rendererRef
              }
              sceneRef={sceneRef}
              onReset={resetCamera}
            />
          </div>

          {/* Top toolbar */}
          <div
            style={{
              position: "absolute",

              top: 16,
              left: 10,
              right: 80,

              zIndex: 10,

              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 9,

              pointerEvents: "auto",
            }}
          >
            {finishes.length > 0 && (
              <select
                value={selectedFinish}
                onChange={(event) =>
                  setSelectedFinish(
                    event.target.value
                  )
                }
                style={{
                  height: 44,

                  minWidth: 98,

                  padding: "0 34px 0 16px",

                  border:
                    "1px solid rgba(255,255,255,.22)",

                  borderRadius: 9,

                  background:
                    "rgba(18,18,18,.9)",

                  color: "#fff",

                  fontSize: 13,
                  fontWeight: 700,

                  cursor: "pointer",

                  outline: "none",
                }}
              >
                {finishes.map(
                  (finishItem) => (
                    <option
                      key={finishItem}
                      value={finishItem}
                    >
                      {finishItem}
                    </option>
                  )
                )}
              </select>
            )}

            <ControlButton
              title={
                autoRotate
                  ? "Pause rotation"
                  : "Start rotation"
              }
              active={autoRotate}
              onClick={() =>
                setAutoRotate(
                  (current) =>
                    !current
                )
              }
            >
              {autoRotate
                ? "Pause"
                : "Rotate"}
            </ControlButton>

            <ControlButton
              title="Reset camera"
              onClick={resetCamera}
            >
              Reset
            </ControlButton>

            <ControlButton
              title="Zoom in"
              onClick={() =>
                zoomCamera("in")
              }
            >
              +
            </ControlButton>

            <ControlButton
              title="Zoom out"
              onClick={() =>
                zoomCamera("out")
              }
            >
              −
            </ControlButton>

            <ControlButton
              title="Change background"
              onClick={() =>
                setBackgroundMode(
                  (current) =>
                    current === "dark"
                      ? "light"
                      : "dark"
                )
              }
            >
              Background
            </ControlButton>

            <ControlButton
              title="Download screenshot"
              onClick={
                downloadScreenshot
              }
            >
              Screenshot
            </ControlButton>
          </div>

          {/* Close button */}
          <button
            type="button"
            aria-label="Close 3D viewer"
            onClick={() =>
              setOpen(false)
            }
            style={{
              position: "absolute",

              top: 12,
              right: 16,

              zIndex: 11,

              width: 48,
              height: 48,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border:
                "1px solid rgba(255,255,255,.23)",

              borderRadius: "50%",

              background:
                "rgba(18,18,18,.9)",

              color: "#fff",

              fontSize: 34,
              fontWeight: 300,
              lineHeight: 1,

              cursor: "pointer",
            }}
          >
            ×
          </button>

          {/* Lighting control */}
          <div
            style={{
              position: "absolute",

              left: 10,
              bottom: 20,

              zIndex: 10,

              width: 200,

              boxSizing: "border-box",

              padding: "13px 15px 15px",

              border:
                "1px solid rgba(255,255,255,.22)",

              borderRadius: 10,

              background:
                "rgba(18,18,18,.9)",

              color: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",

                marginBottom: 12,

                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <span>Lighting</span>

              <span>
                {lightIntensity.toFixed(
                  1
                )}
              </span>
            </div>

            <input
              type="range"
              min="0.5"
              max="4"
              step="0.1"
              value={lightIntensity}
              onChange={(event) =>
                setLightIntensity(
                  Number(
                    event.target.value
                  )
                )
              }
              style={{
                width: "100%",
                display: "block",
                cursor: "pointer",
              }}
            />
          </div>

          {/* Instructions */}
          <div
            style={{
              position: "absolute",

              right: 20,
              bottom: 22,

              zIndex: 10,

              color:
                backgroundMode === "dark"
                  ? "rgba(255,255,255,.72)"
                  : "rgba(0,0,0,.65)",

              fontSize: 12,

              pointerEvents: "none",
            }}
          >
            Drag to rotate · Scroll to zoom ·
            Double-click to reset
          </div>
        </div>
      )}
    </>
  );
}