import React from "react";

function App() {
  const [windowCtx, _] = React.useState<{
    width: number;
    height: number;
    rotation: { x: number; y: number; z: number };
  }>({
    width: 960,
    height: 540,
    rotation: { x: 0, y: 0, z: 0 },
  });
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div
        style={{
          height: `${windowCtx.height}px`,
          width: `${windowCtx.width}px`,
        }}
        className="bg-linear-to-b to-black/50 from-black/40 p-5 rounded-[2em] backdrop-blur-[10px] shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.2),0_1px_1px_1px_rgba(0,0,0,0.1)]"
      >
        <div className="w-full h-full border-white/10 border-2 bg-black/10 rounded-xl overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/6dLiLRtXUNc?si=lgrT2B_V_OAMZLCK&amp;controls=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-full w-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default App;
