import { useState } from "react";

export default function test() {
  const [size, setSize] = useState<number>(16);

  const increase = () => setSize(prev => prev + 22);
  const decrease = () => setSize(prev => Math.max(8, prev - 22)); // prevent too smalls

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2 style={{ fontSize: `${size}px` }}>
        Resize Me!
      </h2>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={decrease} style={{ marginRight: "10px" }}>
          -
        </button>
        <button onClick={increase}>
          +
        </button>
      </div>

      <p>Current size: {size}px</p>
    </div>
  );
};

