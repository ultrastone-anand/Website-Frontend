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


    const texture = useLoader(
        THREE.TextureLoader,
        textureUrl
    );


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

return(

<Canvas

shadows
dpr={[1,1.5]}
camera={{ position: preview ? [ 0.50, -10.05, -1.95] : [ 3.50, -5.86,-14.76],fov:preview ? 5 : 5 }}
>

<ambientLight
intensity={1.2}
/>

<directionalLight
    position={[
        5,
        5,
        5
    ]}
    intensity={2}
    castShadow
/>

<Suspense fallback={<Loader/>}>

    <StoneSlab
        textureUrl={poster}
        finish={finish}
    />

    <Environment
        preset="warehouse"
    />

    {/* CAMERA DEBUG ONLY FULLSCREEN */}

    {
        !preview &&
        <CameraDebugger/>
    }
</Suspense>

<OrbitControls
    enabled={!preview}
    enableZoom={!preview}
    enablePan={!preview}
    enableRotate={!preview}
    target={[
        0,
        0,
        0
    ]}
/>

</Canvas>
)}

export default function ModelViewer({ poster,height=270,finishes=[]}){

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