// import React from "react";

export const Spinner = ({ size = 40, speed = 1.2 }: { size?: number; speed?: number }) => {
  const dots = 8;

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        animation: `spin ${speed}s linear infinite`,
      }}
    >
      {[...Array(dots)].map((_, i) => (
        <span
          key={i}
          className="absolute bg-black rounded-full"
          style={{
            width: size * 0.15,        // 15% dot size
            height: size * 0.15,
            top: "50%",
            left: "50%",
            transform: `
              rotate(${(360 / dots) * i}deg)
              translate(${size * 0.7}px)
            `,
          }}
        ></span>
      ))}
    </div>
  );
};
