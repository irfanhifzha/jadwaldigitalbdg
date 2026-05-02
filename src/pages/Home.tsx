import { useNavigate } from "react-router-dom";



function Home() {

    const navigate = useNavigate();

  return (
    <>
      <div style={{display: "flex", flexDirection:"column", height:"100vh", alignItems:"center", justifyContent:"center"}}>
        <div className="card-content">
            <div className="card-content-header center" style={{margin:15}}>
                <span className="bg-border" style={{padding: 5}}><img src="/favicon.svg" style={{width:"40px"}}></img></span>
                <h1 style={{color: "var(--black)", fontWeight:500}}>Jadwal Kuliah Akademi Digital Bandung</h1>
            </div>

            <div className="card-content-body bg-invert bg-border center"  style={{maxHeight:400, overflowY:"scroll"}}>
                <h2>Dashboard Jadwal Kuliah</h2>
                <div style={{display:"flex", flexDirection:"column", gap:2, width:"100%", marginBottom:20}} className="center">
                    <button className="card-menu bg-hover-b" onClick={() => navigate("/trpl-reg-24")}>
                        <span className="material-symbols-rounded bg-border white-color">function</span>
                        <h1>Jadwal TRPL REG 24</h1>
                    </button>

                    <button className="card-menu bg-hover-g" onClick={() => navigate("/bisdig-reg-24")}>
                        <span className="material-symbols-rounded bg-border white-color">analytics</span>
                        <h1>Jadwal BISDIG REG 24</h1>
                    </button>


                    <button className="card-menu bg-hover-p" onClick={() => navigate("/trpl-reg-25")}>
                        <span className="material-symbols-rounded bg-border white-color">cards_stack</span>
                        <h1>Jadwal TRPL REG 25</h1>
                    </button>

                    <button className="card-menu bg-hover-o" onClick={() => navigate("/bisdig-reg-25")}>
                        <span className="material-symbols-rounded bg-border white-color">business_center</span>
                        <h1>Jadwal BISDIG REG 25</h1>
                    </button>



                    {/* comming soon */}
                    <div>----</div>

                    <button className="card-menu bg-hover-r" onClick={() => navigate("/bisdig-eks-24")}>
                        <span className="material-symbols-rounded bg-border white-color">refresh</span>
                        <h1>Jadwal BISDIG EKS 24 <br></br>(Work in Progress)</h1>
                    </button>

                    <button className="card-menu bg-hover-r" onClick={() => navigate("/bisdig-eks-25")}>
                        <span className="material-symbols-rounded bg-border white-color">refresh</span>
                        <h1>Jadwal BISDIG EKS 25 <br></br>(Work in Progress)</h1>
                    </button>


                </div>

                <p>Pilih Kelas dan Angkatan Diatas</p>

            </div>
        </div>
      </div>
    </>
  )
}

export default Home
