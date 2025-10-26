import React from "react";
import "./Maple.css";
const Maple = React.memo(
  ({
    number = 10,
    leafSize = 24,
    wind = 3,
    image,
  }: {
    number: number;
    leafSize: number;
    wind: number;
    image: string;
  }) => {
    const leaves = Array.from({ length: number });
    return (
      <div className="maple-leaf-overlay">
        {leaves.map((_, index) => {
          const startX = Math.random() * 100;
          const duration = 8 + Math.random() * (15 - 8);
          const delay = Math.random() * duration;
          const size = leafSize * (0.7 + Math.random() * 1.5);
          const rotationSpeed = ((Math.random() - 5) * 360) / duration;
          return (
            <div
              key={index}
              className="falling-leaf"
              style={{
                left: `${startX}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                width: `${size}px`,
                height: `${size}px`,
                // @ts-ignore
                "--wind-intensity": wind,
                "--rotation-speed": `${rotationSpeed}deg`,
              }}
            >
              <img src={image} alt="" className="leaf-image" />
            </div>
          );
        })}
      </div>
    );
  },
);

export default Maple;
