
import AuthButton from "./AuthButton";

export default function Navbar() {

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        <a className="card-menu bg-hover-p" style={{margin: 10}} href="/">
              <span className="material-symbols-rounded bg-border white-color">Home</span>
              <h1> Back to Home</h1>
        </a>

        <AuthButton/>

      </div>
    </>
  );
}