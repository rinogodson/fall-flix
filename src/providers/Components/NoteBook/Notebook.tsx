import { GripHorizontal, NotebookPenIcon } from "lucide-react";
import React from "react";

function Notebook() {
  const [toggled, setToggled] = React.useState(false);
  return (
    <div
      style={{
        translate: toggled ? "-50% 0px" : "-50% calc(37.5rem - 3.25rem)",
      }}
      className="w-200 h-150 rounded-t-3xl px-2 pb-0 backdrop-blur-xl bg-black/30 absolute bottom-0 left-[50%] shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.1)] transition-all duration-200"
    >
      <div
        onClick={() => {
          setToggled(!toggled);
        }}
        className="h-13 w-full flex justify-between items-center px-4"
      >
        <p className="text-white/80 flex justify-center items-center gap-2 text-xl">
          <NotebookPenIcon size={20} /> Notes
        </p>
        <GripHorizontal />
      </div>
      <div className="w-full h-full bg-black/30 rounded-2xl rounded-b-none border border-white/10 border-b-0"></div>
    </div>
  );
}

export default Notebook;
