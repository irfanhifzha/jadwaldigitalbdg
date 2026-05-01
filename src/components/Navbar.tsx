
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: "20px",
      }}
    >
      <button className="card-menu bg-hover-p" style={{margin: '5px 0 15px 0'}} onClick={() => navigate("/")}>
            <span className="material-symbols-rounded bg-border white-color">Home</span>
            <h1>Back to Home</h1>
        </button>
    </div>
  );
}