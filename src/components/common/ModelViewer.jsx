import * as THREE from "three";
import {Suspense,useEffect,useState} from "react";
import {Canvas,useLoader,useThree,useFrame} from "@react-three/fiber";
import {OrbitControls,Environment,Center,Html} from "@react-three/drei";

function Loader(){

    return(
        <Html center>

            <div
                style={{
                    color:"#fff"
                }}
            >
                Loading...
            </div>

        </Html>
    );

}

function CameraDebugger(){

    const { camera } = useThree();


    const [position,setPosition] = useState({

        x:0,
        y:0,
        z:0

    });



    useFrame(()=>{


        setPosition({

            x:camera.position.x.toFixed(2),

            y:camera.position.y.toFixed(2),

            z:camera.position.z.toFixed(2)

        });


    });



    return(

        <Html
            fullscreen
            style={{

                pointerEvents:"none"

            }}
        >


            <div

                style={{

                    position:"absolute",

                    top:100,

                    right:30,

                    background:"rgba(0,0,0,.75)",

                    color:"#fff",

                    padding:"15px",

                    borderRadius:"10px",

                    fontSize:"14px",

                    lineHeight:"22px"

                }}

            >


                <b>Camera Position</b>

                <br/>

                X : {position.x}

                <br/>

                Y : {position.y}

                <br/>

                Z : {position.z}


            </div>



        </Html>

    );

}

function StoneSlab({
    textureUrl,
    finish
}){


const [texture, setTexture] = useState(null);

useEffect(() => {
    console.log("========== TEXTURE TEST ==========");
    console.log("Texture URL:", textureUrl);

    const loader = new THREE.TextureLoader();

    loader.setCrossOrigin("anonymous");

    loader.load(
        textureUrl,
        (tex) => {
            console.log("✅ Texture loaded");
            console.log(tex);

            console.log("Image:", tex.image);
            console.log("Width:", tex.image.width);
            console.log("Height:", tex.image.height);

            setTexture(tex);
        },
        (event) => {
            console.log("Progress:", event);
        },
        (err) => {
            console.error("❌ Texture failed");
            console.error(err);
        }
    );

    return () => {
        console.log("StoneSlab cleanup");
    };
}, [textureUrl]);

if (!texture) {
    return null;
}

    texture.colorSpace =
        THREE.SRGBColorSpace;


    texture.anisotropy = 16;


    texture.generateMipmaps = true;


    texture.minFilter =
        THREE.LinearMipmapLinearFilter;





    const finishSettings={


        POLISHED:{
            roughness:0.08,
            envMapIntensity:2
        },


        BRUSHED:{
            roughness:0.75,
            envMapIntensity:0.4
        },


        HONED:{
            roughness:0.55,
            envMapIntensity:0.6
        },


        LEATHER:{
            roughness:0.8,
            envMapIntensity:0.3
        },


        FLAMMED:{
            roughness:1,
            envMapIntensity:0.2
        },


        MATT:{
            roughness:0.95,
            envMapIntensity:0.2
        }


    };



    const material =
        finishSettings[
            finish?.toUpperCase()
        ]
        ||
        finishSettings.POLISHED;





    return(

        <Center>


            <mesh

                castShadow

                receiveShadow

                rotation={[
                    -0.08,
                    -0.25,
                    0
                ]}


            >

                <boxGeometry

                    args={[
                        4,
                        2.4,
                        0.05
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

function ViewerCanvas({

    poster,

    finish,

    preview=false

}){

      console.log("========== VIEWER CANVAS ==========");
  console.log("Preview:", preview);
  console.log("Poster:", poster);
  console.log("Finish:", finish);

    

return(

<Canvas

shadows
dpr={[1,1.5]}
camera={{ position: preview ? [ 0.50, -10.05, -1.95] : [ 3.50, -5.86,-14.76],fov:preview ? 5 : 10 }}
    onCreated={({ gl }) => {

        console.log("WebGL created");

        gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
                console.error("🔥 WEBGL CONTEXT LOST");
                console.error(e);
            }
        );

        gl.domElement.addEventListener(
            "webglcontextrestored",
            () => {
                console.log("✅ WEBGL CONTEXT RESTORED");
            }
        );
    }}
>

<ambientLight intensity={2} />

<directionalLight
position={[10,10,10]}
intensity={0.5}
/>

<directionalLight
position={[-10,10,10]}
intensity={0.5}
/>

<directionalLight
position={[10,10,-10]}
intensity={0.5}
/>

<directionalLight
position={[-10,10,-10]}
intensity={0.5}
/>

<Suspense fallback={<Loader/>}>

    <StoneSlab
        textureUrl={poster}
        finish={finish}
    />

{/* <Environment preset=""/>  */}

    {/* CAMERA DEBUG ONLY FULLSCREEN */}

    {
        !preview &&
        <CameraDebugger/>
    }
</Suspense>

<OrbitControls
    enableZoom={!preview}
    enablePan={!preview}
    enableRotate={!preview}
    autoRotate={!preview}
    autoRotateSpeed={2}
/>

</Canvas>
)}

export default function ModelViewer({ poster,height=270,finishes=[]}){

      console.log("========== MODEL VIEWER ==========");
  console.log("Poster:", poster);
  console.log("Finishes:", finishes);

const [open,setOpen]=useState(false);

const [selectedFinish,setSelectedFinish]=useState(finishes?.[0]||"Polished");

useEffect(()=>{
const close=(e)=>{if(e.key==="Escape")
setOpen(false);
};

window.addEventListener(
    "keydown",
    close
);

return()=>{

window.removeEventListener(
    "keydown",
    close
)};
},[]);

return(

<>
{/* STATIC VIEW */}
<div
onClick={()=>setOpen(true)}
style={{width:"100%",
height,
cursor:"pointer",
overflow:"hidden",
borderRadius:8,
background:"#eee",
position:"relative"}}
>

<ViewerCanvas
poster={poster}
finish={selectedFinish}
preview={true}
/>

</div>

{/* FULL SCREEN */}


{open &&
<div
style={{
position:"fixed",
inset:0,
background:"rgba(0,0,0,.92)",
zIndex:99999
}}>

<button
onClick={()=>setOpen(false)}
style={{
position:"absolute",
right:30,
top:20,
zIndex:100000,
fontSize:40,
color:"#fff",
background:"none",
border:"none"
}}
>

×

</button>

<div
style={{
position:"absolute",
top:30,
left:30,
zIndex:100000
}}
>

<select
value={selectedFinish}
onChange={(e)=>
setSelectedFinish(e.target.value)}
style={{
padding:"12px 20px",
background:"#111",
color:"#fff",
borderRadius:10,
fontSize:16
}}
>
{
finishes.map(item=>(
<option
key={item}
value={item}
>
{item}
</option>
))}
</select>

</div>

<div
style={{
width:"100vw",
height:"100vh"
}}>

<ViewerCanvas
poster={poster}
finish={selectedFinish}
preview={false}
/>

</div>

</div>}

</>
)}