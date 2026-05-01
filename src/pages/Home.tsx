import { useNavigate } from "react-router-dom";



function Home() {

    const navigate = useNavigate();

  return (
    <>
      <div style={{display: "flex", flexDirection:"column", height:"100vh", alignItems:"center", justifyContent:"center"}}>
        <div className="card-content">
            <div className="card-content-header">
                <span className="bg-border" style={{padding: 5}}><img src="/favicon.svg" style={{width:"40px"}}></img></span>
                <h1>Jadwal ADB</h1>
            </div>
            <div className="card-content-body bg-invert bg-border center">
                <h2>Dashboard test</h2>
                <div style={{display:"flex", width:"100%"}} className="center">
                    <button className="card-menu bg-hover-b" style={{margin: '5px 0 15px 0'}} onClick={() => navigate("/dashboard")}>
                        <span className="material-symbols-rounded bg-border white-color">dashboard</span>
                        <h1>Go to Dashboard</h1>
                    </button>
                </div>
                <p>Ini sebuah jadwal perkuliahan ADB</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default Home
