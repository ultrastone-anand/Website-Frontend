import * as THREE from "three";

import { createPortal } from "react-dom";

import {
    Suspense,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Canvas,
    useThree,
} from "@react-three/fiber";

import {
    OrbitControls,
    Center,
    Html,
    ContactShadows,
} from "@react-three/drei";

import Loading from "./Loading";


/* ============================================================
   LOADER
============================================================ */

function Loader() {

    return (
        <Html center>

            <div
                style={{
                    color: "#fff",
                }}
            >
                <Loading />
            </div>

        </Html>
    );

}


/* ============================================================
   STONE SLAB
============================================================ */

function StoneSlab({
    textureUrl,
    finish,
}) {

    const [
        texture,
        setTexture,
    ] = useState(null);


    useEffect(() => {

        console.log(
            "========== TEXTURE TEST =========="
        );

        console.log(
            "Texture URL:",
            textureUrl
        );


        const manager =
            new THREE.LoadingManager();


        manager.setURLModifier(
            (url) => {

                console.log(
                    "Loading:",
                    url
                );


                const separator =
                    url.includes("?")
                        ? "&"
                        : "?";


                return `${url}${separator}t=${Date.now()}`;
            }
        );


        const loader =
            new THREE.TextureLoader(
                manager
            );


        loader.crossOrigin =
            "anonymous";


        loader.setCrossOrigin(
            "anonymous"
        );


        loader.load(

            textureUrl,

            (tex) => {

                console.log(
                    "✅ Texture loaded"
                );

                console.log(tex);

                console.log(
                    "Image:",
                    tex.image
                );

                console.log(
                    "Width:",
                    tex.image.width
                );

                console.log(
                    "Height:",
                    tex.image.height
                );


                tex.colorSpace =
                    THREE.SRGBColorSpace;


                tex.anisotropy =
                    16;


                tex.generateMipmaps =
                    true;


                tex.minFilter =
                    THREE.LinearMipmapLinearFilter;


                tex.magFilter =
                    THREE.LinearFilter;


                tex.needsUpdate =
                    true;


                setTexture(tex);
            },

            undefined,

            (err) => {

                console.error(
                    "❌ Texture failed"
                );

                console.error(err);

            }
        );


        return () => {

            console.log(
                "StoneSlab cleanup"
            );

        };

    }, [
        textureUrl,
    ]);


    useEffect(() => {

        return () => {

            texture?.dispose();

        };

    }, [
        texture,
    ]);


    if (!texture) {

        return null;

    }


    const finishSettings = {

        POLISHED: {
            roughness: 0.08,
            metalness: 0,
        },

        BRUSHED: {
            roughness: 0.75,
            metalness: 0,
        },

        HONED: {
            roughness: 0.55,
            metalness: 0,
        },

        LEATHER: {
            roughness: 0.8,
            metalness: 0,
        },

        FLAMMED: {
            roughness: 1,
            metalness: 0,
        },

        FLAMED: {
            roughness: 1,
            metalness: 0,
        },

        MATT: {
            roughness: 0.95,
            metalness: 0,
        },

        MATTE: {
            roughness: 0.95,
            metalness: 0,
        },

    };


    const material =
        finishSettings[
            finish?.toUpperCase()
        ]
        ||
        finishSettings.POLISHED;


    return (

        <Center>

            <mesh
                castShadow
                receiveShadow
                rotation={[
                    -0.08,
                    -0.25,
                    0,
                ]}
            >

                <boxGeometry
                    args={[
                        4,
                        2.4,
                        0.05,
                    ]}
                />

                <meshStandardMaterial
                    map={texture}
                    {...material}
                />

            </mesh>

        </Center>

    );

}


/* ============================================================
   CAMERA PRESET CONTROLLER
   FULLSCREEN ONLY
============================================================ */

function CameraController({
    controlsRef,
    cameraPreset,
}) {

    const {
        camera,
    } = useThree();


    useEffect(() => {

        if (!cameraPreset) {

            return;

        }


        const presets = {

            front: [
                0,
                0,
                12,
            ],

            back: [
                0,
                0,
                -12,
            ],

            left: [
                -12,
                0,
                0,
            ],

            right: [
                12,
                0,
                0,
            ],

            top: [
                0,
                12,
                0.01,
            ],

            perspective: [
                5,
                3,
                12,
            ],

        };


        const position =
            presets[
                cameraPreset
            ];


        if (!position) {

            return;

        }


        camera.position.set(
            ...position
        );


        camera.lookAt(
            0,
            0,
            0
        );


        camera.updateProjectionMatrix();


        if (
            controlsRef.current
        ) {

            controlsRef.current.target.set(
                0,
                0,
                0
            );


            controlsRef.current.update();

        }

    }, [
        cameraPreset,
        camera,
        controlsRef,
    ]);


    return null;

}


/* ============================================================
   FULLSCREEN ADVANCED CANVAS
============================================================ */

function AdvancedViewerCanvas({
    poster,
    finish,
    autoRotate,
    autoRotateSpeed,
    cameraPreset,
    controlsRef,
}) {

    return (

        <Canvas
            shadows

            dpr={[
                1,
                2,
            ]}

            camera={{
                position: [
                    5,
                    3,
                    12,
                ],

                fov: 32,

                near: 0.1,

                far: 1000,
            }}

            gl={{
                antialias: true,

                alpha: true,

                preserveDrawingBuffer:
                    true,

                powerPreference:
                    "high-performance",
            }}

            onCreated={({
                gl,
            }) => {

                gl.outputColorSpace =
                    THREE.SRGBColorSpace;


                gl.toneMapping =
                    THREE.ACESFilmicToneMapping;


                gl.toneMappingExposure =
                    1;


                gl.domElement.addEventListener(

                    "webglcontextlost",

                    (e) => {

                        console.error(
                            "🔥 WEBGL CONTEXT LOST"
                        );

                        console.error(e);

                    }

                );


                gl.domElement.addEventListener(

                    "webglcontextrestored",

                    () => {

                        console.log(
                            "✅ WEBGL CONTEXT RESTORED"
                        );

                    }

                );

            }}
        >

            <color
                attach="background"
                args={[
                    "#111111",
                ]}
            />


            <ambientLight
                intensity={1.2}
            />


            <directionalLight
                position={[
                    6,
                    8,
                    10,
                ]}
                intensity={1.2}
                castShadow
            />


            <directionalLight
                position={[
                    -8,
                    5,
                    8,
                ]}
                intensity={0.65}
            />


            <directionalLight
                position={[
                    5,
                    -3,
                    -8,
                ]}
                intensity={0.35}
            />


            <Suspense
                fallback={
                    <Loader />
                }
            >

                <StoneSlab
                    textureUrl={poster}
                    finish={finish}
                />


                <ContactShadows
                    position={[
                        0,
                        -1.35,
                        0,
                    ]}
                    opacity={0.35}
                    scale={8}
                    blur={2.5}
                    far={5}
                />

            </Suspense>


            <CameraController
                controlsRef={controlsRef}
                cameraPreset={cameraPreset}
            />


            <OrbitControls
                ref={controlsRef}

                makeDefault

                enableZoom

                enablePan

                enableRotate

                enableDamping

                dampingFactor={0.08}

                minDistance={4}

                maxDistance={30}

                autoRotate={autoRotate}

                autoRotateSpeed={
                    autoRotateSpeed
                }

                rotateSpeed={0.65}

                zoomSpeed={0.8}

                panSpeed={0.7}
            />

        </Canvas>

    );

}


/* ============================================================
   STATIC PREVIEW
   UNCHANGED
============================================================ */

function ViewerCanvas({

    poster,

    finish,

    preview = false,

}) {

    return (

        <Canvas

            shadows

            dpr={[
                1,
                1.5,
            ]}

            camera={{
                position:
                    preview
                        ? [
                            0.50,
                            -10.05,
                            -1.95,
                        ]
                        : [
                            3.50,
                            -5.86,
                            -27.58,
                        ],

                fov:
                    preview
                        ? 5
                        : 10,
            }}

            onCreated={({
                gl,
            }) => {

                console.log(
                    "WebGL created"
                );


                gl.domElement.addEventListener(

                    "webglcontextlost",

                    (e) => {

                        console.error(
                            "🔥 WEBGL CONTEXT LOST"
                        );

                        console.error(e);

                    }

                );


                gl.domElement.addEventListener(

                    "webglcontextrestored",

                    () => {

                        console.log(
                            "✅ WEBGL CONTEXT RESTORED"
                        );

                    }

                );

            }}
        >

            <ambientLight
                intensity={2}
            />


            <directionalLight
                position={[
                    10,
                    10,
                    10,
                ]}
                intensity={0.5}
            />


            <directionalLight
                position={[
                    -10,
                    10,
                    10,
                ]}
                intensity={0.5}
            />


            <directionalLight
                position={[
                    10,
                    10,
                    -10,
                ]}
                intensity={0.5}
            />


            <directionalLight
                position={[
                    -10,
                    10,
                    -10,
                ]}
                intensity={0.5}
            />


            <Suspense
                fallback={
                    <Loader />
                }
            >

                <StoneSlab
                    textureUrl={poster}
                    finish={finish}
                />

            </Suspense>


            <OrbitControls
                enableZoom={!preview}
                enablePan={!preview}
                enableRotate={!preview}
                autoRotate={!preview}
                autoRotateSpeed={2}
            />

        </Canvas>

    );

}


/* ============================================================
   CONTROL BUTTON STYLE
============================================================ */

const controlButtonStyle = {

    minWidth: 42,

    height: 42,

    padding:
        "0 13px",

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    border:
        "1px solid rgba(255,255,255,.16)",

    borderRadius: 8,

    background:
        "rgba(20,20,20,.85)",

    color:
        "#fff",

    cursor:
        "pointer",

    fontSize: 14,

    backdropFilter:
        "blur(12px)",

};


/* ============================================================
   MODEL VIEWER
============================================================ */

export default function ModelViewer({

    poster,

    height = 270,

    finishes = [],

}) {

    console.log(
        "========== MODEL VIEWER =========="
    );

    console.log(
        "Poster:",
        poster
    );

    console.log(
        "Finishes:",
        finishes
    );


    const [
        open,
        setOpen,
    ] = useState(false);


    const [
        selectedFinish,
        setSelectedFinish,
    ] = useState(
        finishes?.[0]
        ||
        "Polished"
    );


    const [
        autoRotate,
        setAutoRotate,
    ] = useState(true);


    const autoRotateSpeed =
        1.5;


    const [
        cameraPreset,
        setCameraPreset,
    ] = useState(
        "perspective"
    );


    const controlsRef =
        useRef(null);


    /* ========================================================
       RESET VIEW
    ======================================================== */

    const resetViewer = () => {

        setCameraPreset(
            ""
        );


        requestAnimationFrame(
            () => {

                setCameraPreset(
                    "perspective"
                );

            }
        );


        setAutoRotate(
            true
        );


        if (
            controlsRef.current
        ) {

            controlsRef.current.target.set(
                0,
                0,
                0
            );


            controlsRef.current.update();

        }

    };


    /* ========================================================
       KEYBOARD CONTROLS
    ======================================================== */

    useEffect(() => {

        const handleKeyDown = (
            e
        ) => {

            if (
                e.key ===
                "Escape"
            ) {

                setOpen(
                    false
                );

            }


            if (
                !open
            ) {

                return;

            }


            if (
                e.code ===
                "Space"
            ) {

                e.preventDefault();


                setAutoRotate(
                    (
                        previous
                    ) =>
                        !previous
                );

            }


            if (
                e.key.toLowerCase() ===
                "r"
            ) {

                resetViewer();

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

    }, [
        open,
    ]);


    /* ========================================================
       BODY SCROLL LOCK
    ======================================================== */

    useEffect(() => {

        if (!open) {

            return undefined;

        }


        const previousOverflow =
            document.body.style
                .overflow;


        document.body.style
            .overflow =
            "hidden";


        return () => {

            document.body.style
                .overflow =
                previousOverflow;

        };

    }, [
        open,
    ]);


    /* ========================================================
       ZOOM IN
    ======================================================== */

    const zoomIn = () => {

        if (
            !controlsRef.current
        ) {

            return;

        }


        const controls =
            controlsRef.current;


        const camera =
            controls.object;


        const direction =
            new THREE.Vector3()
                .subVectors(
                    camera.position,
                    controls.target
                )
                .multiplyScalar(
                    0.85
                );


        camera.position.copy(
            controls.target
        );


        camera.position.add(
            direction
        );


        controls.update();

    };


    /* ========================================================
       ZOOM OUT
    ======================================================== */

    const zoomOut = () => {

        if (
            !controlsRef.current
        ) {

            return;

        }


        const controls =
            controlsRef.current;


        const camera =
            controls.object;


        const direction =
            new THREE.Vector3()
                .subVectors(
                    camera.position,
                    controls.target
                )
                .multiplyScalar(
                    1.15
                );


        camera.position.copy(
            controls.target
        );


        camera.position.add(
            direction
        );


        controls.update();

    };


    /* ========================================================
       CAMERA PRESET CHANGE
    ======================================================== */

    const changeCameraPreset = (
        preset
    ) => {

        setCameraPreset(
            ""
        );


        requestAnimationFrame(
            () => {

                setCameraPreset(
                    preset
                );

            }
        );

    };


    return (

        <>

            {/* =================================================
                STATIC VIEW
                UNCHANGED
            ================================================= */}

            <div

                onClick={() =>
                    setOpen(
                        true
                    )
                }

                style={{

                    width:
                        "100%",

                    height,

                    cursor:
                        "pointer",

                    overflow:
                        "hidden",

                    borderRadius:
                        8,

                    position:
                        "relative",

                }}
            >

                <ViewerCanvas
                    poster={poster}
                    finish={selectedFinish}
                    preview={true}
                />

            </div>


            {/* =================================================
                FULLSCREEN VIEWER
            ================================================= */}

            {open &&
                createPortal(

                    <div
                        style={{
                            position:
                                "fixed",

                            inset: 0,

                            width:
                                "100vw",

                            height:
                                "100dvh",

                            background:
                                "#111111",

                            zIndex:
                                99999,

                            overflow:
                                "hidden",
                        }}
                    >

                        {/* =====================================
                            CANVAS
                        ====================================== */}

                        <div
                            style={{
                                width:
                                    "100%",

                                height:
                                    "100%",
                            }}
                        >

                            <AdvancedViewerCanvas
                                poster={poster}
                                finish={selectedFinish}
                                autoRotate={autoRotate}
                                autoRotateSpeed={autoRotateSpeed}
                                cameraPreset={cameraPreset}
                                controlsRef={controlsRef}
                            />

                        </div>


                        {/* =====================================
                            TOP LEFT CONTROLS
                        ====================================== */}

                        <div
                            style={{
                                position:
                                    "absolute",

                                top: 24,

                                left: 24,

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap: 10,

                                zIndex:
                                    100000,
                            }}
                        >

                            {finishes?.length >
                                0 && (

                                <select

                                    value={
                                        selectedFinish
                                    }

                                    onChange={(
                                        e
                                    ) =>
                                        setSelectedFinish(
                                            e.target.value
                                        )
                                    }

                                    style={{
                                        height:
                                            42,

                                        padding:
                                            "0 16px",

                                        background:
                                            "rgba(20,20,20,.88)",

                                        color:
                                            "#fff",

                                        border:
                                            "1px solid rgba(255,255,255,.16)",

                                        borderRadius:
                                            8,

                                        fontSize:
                                            14,

                                        outline:
                                            "none",

                                        cursor:
                                            "pointer",

                                        backdropFilter:
                                            "blur(12px)",
                                    }}
                                >

                                    {finishes.map(
                                        (
                                            item
                                        ) => (

                                            <option
                                                key={
                                                    item
                                                }
                                                value={
                                                    item
                                                }
                                            >
                                                {item}
                                            </option>

                                        )
                                    )}

                                </select>

                            )}


                            <button

                                type="button"

                                onClick={() =>
                                    setAutoRotate(
                                        (
                                            previous
                                        ) =>
                                            !previous
                                    )
                                }

                                style={
                                    controlButtonStyle
                                }

                                title={
                                    autoRotate
                                        ? "Pause rotation"
                                        : "Start rotation"
                                }
                            >

                                {autoRotate
                                    ? "Pause"
                                    : "Rotate"}

                            </button>


                            <button

                                type="button"

                                onClick={
                                    resetViewer
                                }

                                style={
                                    controlButtonStyle
                                }

                                title="Reset view"
                            >
                                Reset
                            </button>

                        </div>


                        {/* =====================================
                            CLOSE BUTTON
                        ====================================== */}

                        <button

                            type="button"

                            onClick={() =>
                                setOpen(
                                    false
                                )
                            }

                            style={{
                                position:
                                    "absolute",

                                right: 24,

                                top: 20,

                                zIndex:
                                    100002,

                                width: 46,

                                height: 46,

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                fontSize:
                                    32,

                                lineHeight:
                                    1,

                                color:
                                    "#fff",

                                background:
                                    "rgba(20,20,20,.8)",

                                border:
                                    "1px solid rgba(255,255,255,.15)",

                                borderRadius:
                                    "50%",

                                cursor:
                                    "pointer",

                                backdropFilter:
                                    "blur(12px)",
                            }}
                        >
                            ×
                        </button>


                        {/* =====================================
                            BOTTOM CAMERA CONTROLS
                        ====================================== */}

                        <div
                            style={{
                                position:
                                    "absolute",

                                bottom: 26,

                                left:
                                    "50%",

                                transform:
                                    "translateX(-50%)",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap: 7,

                                zIndex:
                                    100001,

                                padding: 8,

                                borderRadius:
                                    12,

                                background:
                                    "rgba(0,0,0,.45)",

                                backdropFilter:
                                    "blur(12px)",
                            }}
                        >

                            {[
                                [
                                    "perspective",
                                    "3D",
                                ],

                                [
                                    "front",
                                    "Front",
                                ],

                                [
                                    "back",
                                    "Back",
                                ],

                                [
                                    "left",
                                    "Left",
                                ],

                                [
                                    "right",
                                    "Right",
                                ],

                                [
                                    "top",
                                    "Top",
                                ],

                            ].map(
                                ([
                                    value,
                                    label,
                                ]) => (

                                    <button

                                        type="button"

                                        key={
                                            value
                                        }

                                        onClick={() =>
                                            changeCameraPreset(
                                                value
                                            )
                                        }

                                        style={{
                                            ...controlButtonStyle,

                                            minWidth:
                                                "auto",

                                            background:
                                                cameraPreset ===
                                                value
                                                    ? "rgba(255,255,255,.20)"
                                                    : controlButtonStyle.background,
                                        }}
                                    >
                                        {label}
                                    </button>

                                )
                            )}


                            <div
                                style={{
                                    width: 1,

                                    height: 32,

                                    background:
                                        "rgba(255,255,255,.15)",

                                    margin:
                                        "0 3px",
                                }}
                            />


                            <button

                                type="button"

                                onClick={
                                    zoomOut
                                }

                                style={
                                    controlButtonStyle
                                }

                                title="Zoom out"
                            >
                                −
                            </button>


                            <button

                                type="button"

                                onClick={
                                    zoomIn
                                }

                                style={
                                    controlButtonStyle
                                }

                                title="Zoom in"
                            >
                                +
                            </button>

                        </div>


                        {/* =====================================
                            HELP
                        ====================================== */}

                        <div
                            style={{
                                position:
                                    "absolute",

                                left: 24,

                                bottom: 24,

                                zIndex:
                                    100000,

                                padding:
                                    "9px 12px",

                                color:
                                    "rgba(255,255,255,.6)",

                                fontSize:
                                    11,

                                borderRadius:
                                    7,

                                background:
                                    "rgba(0,0,0,.35)",

                                pointerEvents:
                                    "none",

                                backdropFilter:
                                    "blur(8px)",
                            }}
                        >

                            Drag to rotate

                            &nbsp;•&nbsp;

                            Scroll to zoom

                            &nbsp;•&nbsp;

                            Shift + drag to pan

                            &nbsp;•&nbsp;

                            Space to pause

                            &nbsp;•&nbsp;

                            R to reset

                        </div>

                    </div>,

                    document.body

                )}

        </>

    );

}