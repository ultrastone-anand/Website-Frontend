import { useState } from 'react';
import '@google/model-viewer';


export default function ModelViewer({
  src,
  poster,
  height = 260,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
      onClick={() => setExpanded(true)}
        style={{
          position: 'relative',
          width: '100%',
          height: `${height}px`,
          overflow: 'hidden',
          cursor:'zoom-in'
        }}
      >
 

        <model-viewer
  src={src}
  poster={poster}
  shadow-intensity="1"
  tone-mapping="neutral"
  camera-orbit="deg 155deg 25%"
  field-of-view="18deg"
  min-camera-orbit="auto auto 40%"
  max-camera-orbit="auto auto 120%"
  style={{
    width: '100%',
    height: '100%',
  }}
/>
      </div>

      {expanded && (
        <div
        //   onClick={() => setExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setExpanded(false)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 10000,
              color: '#fff',
              background: 'none',
              border: 'none',
              fontSize: 32,
              cursor: 'pointer',
            }}
          >
            ×
          </button>

          <model-viewer
            src={src}
            poster={poster}
            camera-controls
            auto-rotate
            shadow-intensity="1"
            tone-mapping="neutral"
            style={{
              width: '100vw',
              height: '100vh',
            }}
          />
        </div>
      )}
    </>
  );
}