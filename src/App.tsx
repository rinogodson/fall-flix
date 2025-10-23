import React from "react";

function App() {
  const mosPos = useMousePos();

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
    <>
      <div
        id="bg"
        className="absolute z-[-100] w-screen h-screen bg-[url(bg.jpg)] bg-cover blur-[10px]"
      ></div>
      <div className="perspective-distant perspective-origin-center h-screen w-screen flex justify-center items-center">
        <div
          style={{
            translate: `0px ${mosPos.y * 0.01}px`,
          }}
          className="absolute left-5 z-100 rotate-y-90 hover:rotate-y-0 scale-110 hover:scale-100 origin-left transition-all duration-100 w-100 h-150 bg-linear-to-b to-black/50 from-black/40 p-5 rounded-[2em] backdrop-blur-[10px] shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.2),0_1px_1px_1px_rgba(0,0,0,0.1)]"
        ></div>
        <div
          style={{
            translate: `0px ${mosPos.y * 0.01}px`,
          }}
          className="absolute right-5 z-100 -rotate-y-90 hover:rotate-y-0 scale-110 hover:scale-100 origin-right transition-all duration-100 w-100 h-150 bg-linear-to-b to-black/50 from-black/40 p-5 rounded-[2em] backdrop-blur-[10px] shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.2),0_1px_1px_1px_rgba(0,0,0,0.1)]"
        ></div>
        <div
          style={{
            height: `${windowCtx.height}px`,
            width: `${windowCtx.width}px`,
            translate: `${mosPos.x * 0.01}px ${mosPos.y * 0.01}px`,
          }}
          className="bg-linear-to-b to-black/50 from-black/40 p-5 rounded-[2em] backdrop-blur-[10px] shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.2),0_1px_1px_1px_rgba(0,0,0,0.1)]"
        >
          <div className="w-full h-full border-white/10 border-2 relative bg-black/10 rounded-xl overflow-hidden">
            <div className="h-full w-full absolute top-0 left-0"></div>
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
    </>
  );
}

const useMousePos = () => {
  const [mPos, setMPos] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMPos({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  return mPos;
};

export default App;
