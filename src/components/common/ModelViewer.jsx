import { useState, useRef, useEffect } from 'react';

export default function ModelViewer({
  src,
  poster,
  height = 260,
}) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const viewerRef = useRef(null);

  const openViewer = async () => {
    setLoading(true);

    if (!window.customElements.get('model-viewer')) {
      await import('@google/model-viewer');
    }

    setExpanded(true);
  };

  const closeViewer = () => {
    setExpanded(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!expanded || !viewerRef.current) return;

    const viewer = viewerRef.current;

    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    viewer.addEventListener('load', handleLoad);

    return () => {
      viewer.removeEventListener('load', handleLoad);
    };
  }, [expanded]);

  return (
    <>
      {/* Preview Image */}
      <div
        onClick={openViewer}
        style={{
          position: 'relative',
          width: '100%',
          height: `${height}px`,
          overflow: 'hidden',
          cursor: 'zoom-in',
        }}
      >
        <img
          src={poster}
          alt="3D Preview"
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.15)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '18px',
          }}
        >
          ▶ View 3D
        </div>
      </div>

      {/* Modal */}
      {expanded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 9999,
          }}
        >
          {/* Close */}
          <button
            onClick={closeViewer}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 10001,
              color: '#fff',
              background: 'none',
              border: 'none',
              fontSize: '36px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>

          {/* Loader */}
          {loading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                background: 'rgba(0,0,0,0.85)',
                color: '#fff',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: '4px solid rgba(255,255,255,0.2)',
                  borderTop: '4px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <div style={{ marginTop: 16 }}>
                Loading 3D Model...
              </div>
            </div>
          )}

          <model-viewer
            ref={viewerRef}
            src={src}
            poster={poster}
            camera-controls
            auto-rotate
            shadow-intensity="1"
            tone-mapping="neutral"
            loading="eager"
            reveal="auto"
            style={{
              width: '100vw',
              height: '100vh',
            }}
          />

          <style>
            {`
              @keyframes spin {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}