
import AuthButton from "./AuthButton";

export default function Navbar() {

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 m-5 px-3 mb-8">

        <a href="/" className="flex items-center gap-[12px] w-[220px] h-fit px-5 py-3 rounded-2xl border border-gray-200 cursor-pointer transition duration-200 ease bg-white-100 hover:-translate-y-1 hover:shadow-sm hover:bg-red-100 hover:text-red-700 active:scale-95 active:bg-red-200 active:text-red-800">

          <div className="flex items-center justify-center w-[40px] h-[40px] border border-gray-200 rounded-lg bg-white">
            <span className="material-symbols-rounded select-none">
              Home
            </span>
          </div>

          <p className="text-md font-normal m-0">Back to Home</p>

        </a>

        <AuthButton />

      </div>
    </>
  );
}