import React from "react";
// import songs from "./providers/autumn-giver";
import { AnimatePresence, motion } from "motion/react";
import * as Icons from "lucide-react";
import YouTubeIFrameCtrl from "youtube-iframe-ctrl";
import Maple from "./providers/Components/Maple";
import Notebook from "./providers/Components/NoteBook/Notebook";
import Modal from "./providers/Components/Modal/Modal";

function App() {
  const mosPos = useMousePos();

  const [showModal, setShowModal] = React.useState(false);

  const [leafCtx, setLeafCtx] = React.useState({
    number: 14,
    leafSize: 24,
    wind: 3,
  });

  function getVideoID(url: string): string | null {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }

      if (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtube-nocookie.com")
      ) {
        if (urlObj.pathname === "/watch") {
          return urlObj.searchParams.get("v");
        }

        if (urlObj.pathname.startsWith("/embed/")) {
          return urlObj.pathname.split("/")[2];
        }

        if (urlObj.pathname.startsWith("/v/")) {
          return urlObj.pathname.split("/")[2];
        }
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  const [appCtx, setAppCtx] = React.useState<{
    videoId: string;
    linkIsThere: Boolean;
    link: string;
  }>({
    videoId: "WXk7yDqsKxs",
    linkIsThere: false,
    link: "",
  });

  const [playerCtx, setPlayerCtx] = React.useState<{
    playing: Boolean;
    time: Number;
    progressBarCtx: {
      isDragging: Boolean;
      progress: number;
    };
  }>({
    playing: false,
    time: 0,
    progressBarCtx: {
      isDragging: false,
      progress: 0,
    },
  });

  const [windowCtx, _] = React.useState<{
    width: number;
    height: number;
    rotation: { x: number; y: number; z: number };
  }>({
    width: 960,
    height: 540,
    rotation: { x: 0, y: 0, z: 0 },
  });

  const barRef = React.useRef<any>(null);

  const ytPlayerRef = React.useRef<any>(null);

  const [ytCtx, setYtCtx] = React.useState<{
    title: string;
    volume: number;
    playFn: Function;
    pauseFn: Function;
    volumeSet: Function;
    setTime: Function;
    duration: number;
    currentTime: number;
  }>({
    title: "",
    volume: 100,
    playFn: () => {},
    pauseFn: () => {},
    volumeSet: () => {},
    setTime: () => {},
    duration: 0,
    currentTime: 0,
  });

  React.useEffect(() => {
    if (appCtx.videoId && appCtx.linkIsThere && ytPlayerRef.current) {
      ytPlayerRef.current.contentWindow.postMessage(
        '{"event": "listening"}',
        "*",
      );

      const youtubectrl = new YouTubeIFrameCtrl(ytPlayerRef.current);

      const play = async () => {
        await youtubectrl.play();
      };

      const pause = async () => {
        await youtubectrl.pause();
      };

      const setVolume = async (val: Number) => {
        await youtubectrl.command("setVolume", [val]);
      };

      const setTime = async (val: number) => {
        await youtubectrl.command("seekTo", [val, true]);
      };

      setYtCtx({
        title: "",
        playFn: play,
        pauseFn: pause,
        volumeSet: setVolume,
        setTime: setTime,
        duration: 0,
        currentTime: 0,
        volume: 100,
      });

      const fetchYouTubeTitle = async (link: string) => {
        const url = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${link}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }

          const json = await response.json();
          console.log(json);

          const title = json.title;
          console.log(title);
          return title;
        } catch (error: any) {
          console.error(error.message);
          return "";
        }
      };

      const handleYtMessage = async (event: any) => {
        if (
          event.detail &&
          event.detail.event === "infoDelivery" &&
          event.detail.info
        ) {
          const { duration, currentTime } = event.detail.info;
          const title = await fetchYouTubeTitle(appCtx.videoId);

          if (duration === undefined) {
            setYtCtx((prev) => ({
              ...prev,
              currentTime: Math.floor(currentTime),
              title: title,
            }));
          } else {
            setYtCtx((prev) => ({
              ...prev,
              duration: Math.floor(duration),
              currentTime: Math.floor(currentTime),
              title: title,
            }));
          }
        }
      };

      ytPlayerRef.current.addEventListener("ytmessage", handleYtMessage);

      return () => {
        ytPlayerRef.current?.removeEventListener("ytmessage", handleYtMessage);
      };
    }
  }, [appCtx.linkIsThere]);

  React.useEffect(() => {
    if (!playerCtx.progressBarCtx.isDragging && ytCtx.duration > 0) {
      const progress = (ytCtx.currentTime / ytCtx.duration) * 100;
      setPlayerCtx((prev) => ({
        ...prev,
        progressBarCtx: {
          ...prev.progressBarCtx,
          progress,
        },
      }));
    }
  }, [ytCtx.currentTime, ytCtx.duration, playerCtx.progressBarCtx.isDragging]);

  // React.useEffect(() => {
  //   console.log(ytCtx.duration, ytCtx.currentTime);
  // }, [ytCtx]);

  return (
    <>
      <Maple
        number={leafCtx.number}
        leafSize={leafCtx.leafSize}
        wind={leafCtx.wind}
        image="/maple.webp"
      />
      <div
        id="bg"
        className="absolute z-[-100] w-screen h-screen bg-[url(/bg.webp)] bg-cover blur-[10px]"
      ></div>

      <div className="perspective-distant perspective-origin-center h-screen w-screen flex flex-col gap-10 justify-center items-center">
        {/* <div */}
        {/*   style={{ */}
        {/*     translate: `0px ${mosPos.y * 0.01}px`, */}
        {/*   }} */}
        {/*   className="absolute left-5 z-100 rotate-y-90 hover:rotate-y-0 opacity-80 hover:opacity-100 scale-110 hover:scale-100 origin-left transition-all duration-300 w-100 h-150 bg-linear-to-b to-black/50 from-black/40 p-5 rounded-[2em] backdrop-blur-[10px] shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.2),0_1px_1px_1px_rgba(0,0,0,0.1)]" */}
        {/* > */}
        {/*   <div className="w-full h-full grid grid-cols-2 gap-5"> */}
        {/*     {songs.map((item) => { */}
        {/*       // @ts-ignore */}
        {/*       const LucideIcon: any = Icons[item.icon]; */}
        {/*       return ( */}
        {/*         <div */}
        {/*           key={item.name} */}
        {/*           className="flex-col gap-2 w-full h-full bg-white/10 rounded-2xl border border-white/20 flex justify-center items-center" */}
        {/*         > */}
        {/*           {LucideIcon ? <LucideIcon size={35} /> : null} */}
        {/*           {item.name} */}
        {/*         </div> */}
        {/*       ); */}
        {/*     })} */}
        {/*   </div> */}
        {/* </div> */}
        {/* <div */}
        {/*   style={{ */}
        {/*     translate: `0px ${mosPos.y * 0.01}px`, */}
        {/*   }} */}
        {/*   className="absolute right-5 z-100 -rotate-y-90 hover:rotate-y-0 scale-110 hover:scale-100 origin-right transition-all duration-100 w-100 h-150 bg-linear-to-b to-black/50 from-black/40 p-5 rounded-[2em] backdrop-blur-[10px] shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.2),0_1px_1px_1px_rgba(0,0,0,0.1)]" */}
        {/* > */}
        {/*   <div className="w-full h-full flex flex-col gap-3 justify-center items-center"> */}
        {/*     <p className="text-5xl">19:00</p> */}
        {/*     <button className="bg-linear-to-b from-white to-white/70 text-black px-6 py-2 text-2xl rounded-full"> */}
        {/*       Start */}
        {/*     </button> */}
        {/*   </div> */}
        {/* </div> */}

        <button
          onClick={() => {
            setShowModal(true);
          }}
          className="hover:scale-110 active:scale-100 transition-all duration-200 flex justify-center items-center w-12 aspect-square bg-linear-to-br from-white/20 absolute bottom-10 right-10 rounded-full border-2 border-white/20"
        >
          <Icons.Settings />
        </button>
        <AnimatePresence>
          {showModal && (
            <Modal
              onClose={() => {
                setShowModal(false);
              }}
            >
              <div className="w-full p-10 pt-5 flex flex-col gap-5">
                <div className="flex justify-between items-center gap-2 text-3xl">
                  <p>Count:</p>

                  <div className="flex justify-center items-center gap-2">
                    <input
                      readOnly
                      type="text"
                      value={leafCtx.number}
                      className="flex text-2xl justify-center items-center  text-center rounded-xl h-10 w-20 border border-white/30"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setLeafCtx((p: typeof leafCtx) => ({
                            ...p,
                            number: p.number + 1,
                          }));
                        }}
                        className="active:bg-white/20 bg-white/10 w-fit h-fit rounded-[5px]"
                      >
                        <Icons.ChevronUp />
                      </button>
                      <button
                        onClick={() => {
                          setLeafCtx((p: typeof leafCtx) => ({
                            ...p,
                            number: p.number - 1,
                          }));
                        }}
                        className="active:bg-white/20 bg-white/10 w-fit h-fit rounded-[5px]"
                      >
                        <Icons.ChevronDown />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2 text-3xl w-80">
                  <p>Leaf Size:</p>

                  <div className="flex justify-center items-center gap-2">
                    <input
                      readOnly
                      type="text"
                      value={leafCtx.leafSize}
                      className="flex text-2xl justify-center items-center  text-center rounded-xl h-10 w-20 border border-white/30"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setLeafCtx((p: typeof leafCtx) => ({
                            ...p,
                            leafSize: p.leafSize + 1,
                          }));
                        }}
                        className="active:bg-white/20 bg-white/10 w-fit h-fit rounded-[5px]"
                      >
                        <Icons.ChevronUp />
                      </button>
                      <button
                        onClick={() => {
                          setLeafCtx((p: typeof leafCtx) => ({
                            ...p,
                            leafSize: p.leafSize - 1,
                          }));
                        }}
                        className="active:bg-white/20 bg-white/10 w-fit h-fit rounded-[5px]"
                      >
                        <Icons.ChevronDown />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-3xl">
                  <p>Wind:</p>
                  <div className="flex justify-center items-center gap-2">
                    <input
                      readOnly
                      type="text"
                      value={leafCtx.wind}
                      className="flex text-2xl justify-center items-center  text-center rounded-xl h-10 w-20 border border-white/30"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setLeafCtx((p: typeof leafCtx) => ({
                            ...p,
                            wind: p.wind + 1,
                          }));
                        }}
                        className="active:bg-white/20 bg-white/10 w-fit h-fit rounded-[5px]"
                      >
                        <Icons.ChevronUp />
                      </button>
                      <button
                        onClick={() => {
                          setLeafCtx((p: typeof leafCtx) => ({
                            ...p,
                            wind: p.wind - 1,
                          }));
                        }}
                        className="active:bg-white/20 bg-white/10 w-fit h-fit rounded-[5px]"
                      >
                        <Icons.ChevronDown />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
        {appCtx.linkIsThere ? (
          <motion.div
            initial={{ opacity: 2, translateY: -200, rotate: -10 }}
            animate={{ opacity: 1, translateY: 0, rotate: 0 }}
            style={{
              height: `calc(${windowCtx.height}px + 150px)`,
              width: `${windowCtx.width}px`,
              translate: `${(mosPos.x - window.innerHeight / 2) * 0.01}px ${(mosPos.y - window.innerWidth / 2) * 0.01}px`,
            }}
            className="bg-[url(/texture.webp)] bg-cover p-5 rounded-[2em] backdrop-blur-[10px] shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.2),0_1px_1px_1px_rgba(0,0,0,0.1)]"
          >
            <div
              style={{
                borderBottom: playerCtx.playing
                  ? "2px solid rgba(255, 165, 0, 0.3)"
                  : "2px solid rgba(0, 0, 0, 0.1)",
              }}
              className={`w-full h-full grid grid-rows-[${windowCtx.height}px_1fr] border-black/10 border-2 relative bg-black/10 rounded-xl overflow-hidden`}
            >
              <div>
                <div
                  style={{ height: `${windowCtx.height}px` }}
                  className="w-full absolute top-0 left-0"
                ></div>
                <iframe
                  ref={ytPlayerRef}
                  style={{ height: `${windowCtx.height}px` }}
                  src={`https://www.youtube.com/embed/${appCtx.videoId}?rel=0&amp;controls=0&amp;enablejsapi=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="h-full w-full"
                ></iframe>
              </div>
              <div className="h-full overflow-hidden bg-[url(/texture-rotated.webp)] bg-cover">
                <div className="gap-6 h-full w-full border-t-2 border-black/5 bg-linear-to-b from-black/20 to-black/50 flex justify-around items-center px-4">
                  <div
                    onClick={() => {
                      setPlayerCtx((p: any) => ({ ...p, playing: !p.playing }));
                      if (playerCtx.playing) ytCtx.pauseFn();
                      else ytCtx.playFn();
                      // ytPlayer.current.contentWindow.postMessage(
                      //   '{ "event": "command", func: "playVideo" }',
                      //   "*",
                      // );
                    }}
                    className="h-[75%] aspect-square scale-100 hover:scale-120 active:scale-100 transition-all duration-200"
                  >
                    {playerCtx.playing ? (
                      <img src="/play.webp" />
                    ) : (
                      <img src="/pause.webp" />
                    )}
                  </div>
                  <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                    <div
                      ref={barRef}
                      onMouseDown={(e) => {
                        const rect = barRef.current.getBoundingClientRect();
                        const newProgress =
                          ((e.clientX - rect.left) / rect.width) * 100;
                        setPlayerCtx((p) => ({
                          ...p,
                          progressBarCtx: {
                            ...p.progressBarCtx,
                            progress: newProgress,
                            isDragging: true,
                          },
                        }));

                        ytCtx.setTime(
                          Math.floor((ytCtx.duration * newProgress) / 100),
                        );
                      }}
                      onMouseMove={(e) => {
                        if (!playerCtx.progressBarCtx.isDragging) return;
                        const rect = barRef.current.getBoundingClientRect();
                        const newProgress =
                          ((e.clientX - rect.left) / rect.width) * 100;
                        setPlayerCtx((p) => ({
                          ...p,
                          progressBarCtx: {
                            ...p.progressBarCtx,
                            progress: Math.min(100, Math.max(0, newProgress)),
                          },
                        }));
                      }}
                      onMouseUp={() =>
                        setPlayerCtx((p) => ({
                          ...p,
                          progressBarCtx: {
                            ...p.progressBarCtx,
                            isDragging: false,
                          },
                        }))
                      }
                      onMouseLeave={() =>
                        setPlayerCtx((p) => ({
                          ...p,
                          progressBarCtx: {
                            ...p.progressBarCtx,
                            isDragging: false,
                          },
                        }))
                      }
                      className="relative h-2 hover:h-5 w-full flex justify-start items-center transition-all duration-200"
                    >
                      <div className="w-full h-full bg-[rgba(0,0,0,0.1)] border border-black/50 z-100 backdrop-blur-[10px] rounded-full"></div>
                      <div
                        style={{
                          width: `${playerCtx.progressBarCtx.progress || 0}%`,
                          boxShadow: playerCtx.playing
                            ? "0 0 20px 5px #EC7E16"
                            : "0 0 5px 5px rgba(100, 50, 0, 0.5)",
                        }}
                        className="absolute rounded-full h-full shadow-[0_0_20px_10px_orange] bg-[orange] transition-shadow duration-200"
                      ></div>
                    </div>
                    <div className=" flex justify-between items-center w-full h-10">
                      <div className=" h-full gap-2 flex justify-center items-center">
                        <button
                          onClick={() => {
                            if (ytCtx.currentTime > 10)
                              ytCtx.setTime(ytCtx.currentTime - 10);
                            else ytCtx.setTime(0);
                          }}
                          style={{
                            boxShadow: playerCtx.playing
                              ? "inset 0 1px 1px 1px rgba(255,255,255,0.1),0 1px 1px 1px rgba(0,0,0,0.1), inset -1px 1px 1px 1px rgba(255,165,0,0.1)"
                              : "inset 0 1px 1px 1px rgba(255,255,255,0.1),0 1px 1px 1px rgba(0,0,0,0.1)",
                          }}
                          className="bg-black/20 p-2 border border-white/5 rounded-full justify-center items-center flex  text-white/70 active:scale-90 transition-all duration-200"
                        >
                          <Icons.StepBack />
                        </button>
                        <button
                          onClick={() => {
                            if (ytCtx.currentTime < ytCtx.duration - 11)
                              ytCtx.setTime(ytCtx.currentTime + 10);
                            else ytCtx.setTime(ytCtx.duration);
                          }}
                          style={{
                            boxShadow: playerCtx.playing
                              ? "inset 0 1px 1px 1px rgba(255,255,255,0.1),0 1px 1px 1px rgba(0,0,0,0.1), inset -1px 1px 1px 1px rgba(255,165,0,0.1)"
                              : "inset 0 1px 1px 1px rgba(255,255,255,0.1),0 1px 1px 1px rgba(0,0,0,0.1)",
                          }}
                          className="bg-black/20 p-2 border border-white/5 rounded-full justify-center items-center flex  text-white/70 active:scale-90 transition-all duration-200"
                        >
                          <Icons.StepForward />
                        </button>
                      </div>
                      <p className="text-white/70 w-[60%] whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {ytCtx.title}
                      </p>
                      <div
                        style={{
                          boxShadow: playerCtx.playing
                            ? "inset 0 1px 1px 1px rgba(255,255,255,0.1),0 1px 1px 1px rgba(0,0,0,0.1), inset 1px 1px 1px 1px rgba(255,165,0,0.1)"
                            : "inset 0 1px 1px 1px rgba(255,255,255,0.1),0 1px 1px 1px rgba(0,0,0,0.1)",
                        }}
                        className="w-30 gap-2 h-full bg-black/20 hover:scale-130 transition-transform duration-300 p-2 border border-white/5 rounded-full justify-around px-4 items-center flex  text-white/70"
                      >
                        <Icons.Volume2 />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          id="volume"
                          value={ytCtx.volume}
                          onChange={(e) => {
                            ytCtx.volumeSet(Number(e.target.value));
                            setYtCtx((p: any) => ({
                              ...p,
                              volume: Number(e.target.value),
                            }));
                          }}
                          className={`w-full h-2 appearance-none rounded-lg bg-black/80 border border-white/20 outline-none transition-all duration-300
                                      [&::-webkit-slider-thumb]:appearance-none
                                      [&::-webkit-slider-thumb]:w-2
                                      [&::-webkit-slider-thumb]:h-4
                                      [&::-webkit-slider-thumb]:rounded-full
                                      [&::-webkit-slider-thumb]:bg-white/60
                                      [&::-webkit-slider-thumb]:border
                                      [&::-webkit-slider-thumb]:backdrop-blur-xl
                                      [&::-webkit-slider-thumb]:border-white/80
                                      [&::-webkit-slider-thumb]:cursor-pointer
                                      [&::-webkit-slider-thumb]:transition-transform
                                      [&::-webkit-slider-thumb]:hover:scale-125`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div
            style={{
              translate: `${(mosPos.x - window.innerHeight / 2) * 0.01}px ${(mosPos.y - window.innerWidth / 2) * 0.01}px`,
            }}
            className="gap-3 flex flex-col w-fit h-fit bg-[url(/texture.webp)] bg-cover p-5 rounded-[2em] backdrop-blur-[10px] shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.2),0_1px_1px_1px_rgba(0,0,0,0.1)]"
          >
            <input
              placeholder="Paste the Youtube Link Here."
              type="text"
              value={appCtx.link}
              onChange={(e) =>
                setAppCtx((p: any) => ({ ...p, link: e.target.value }))
              }
              className="w-100 bg-black/40 p-3 text-2xl rounded-xl text-white/90 border border-black/30"
            />
            <button
              onClick={() => {
                if (appCtx.link && getVideoID(appCtx.link)) {
                  const id = getVideoID(appCtx.link);
                  setAppCtx((p: any) => ({
                    ...p,
                    linkIsThere: true,
                    videoId: id,
                  }));
                } else {
                  window.alert("Enter a valid Youtube Link");
                }
              }}
              className="transition-all duration-100 py-2 text-2xl w-full bg-linear-to-b from-[hsla(27.123,45%,40%,0.8)] to-[hsla(27.123,45%,30%,0.8)] text-white/90 flex justify-center items-center gap-3 rounded-xl shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.1),0_1px_1px_1px_rgba(0,0,0,0.2)] active:shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0),0_0px_1px_1px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.2),0_1px_1px_2px_rgba(0,0,0,0.2)]"
            >
              <Icons.PlayIcon />
              PLAY
            </button>
          </div>
        )}
      </div>
      <Notebook />
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
