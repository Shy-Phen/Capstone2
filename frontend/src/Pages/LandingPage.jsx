import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full py-10 bg-night">
      <div className="w-full h-screen flex jusify-center items-center flex-col sm:mt-10 md:mt-15 xl:mt-20 bg-none">
        <h1 className="text-center text-5xl cal-sans-regular mt-10 leading-[1.1]">
          Create, Customize, and Manage Rubrics
        </h1>
        <p className="text-center text-base-content/70 py-4 font-light md:text-lg xl:text-2xl">
          Your reliable partner in creating rubrics and conducting evaluations,
          designed <br></br> to reduce the time and effort spent on traditional,
          manual processes.
        </p>
        <div>
          <div className="w-full gap-4 flex flex-row mt-3">
            <button
              className="btn btn-neutral rounded-full"
              onClick={() => navigate("/login")}
            >
              <div className="flex justify-center items-center w-full px-8">
                Log in
              </div>
            </button>
            <button
              className="btn btn-primary rounded-full"
              onClick={() => navigate("/signup")}
            >
              <div className="flex justify-center items-center w-full px-8">
                Sign up
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
