

export default function Home() {
  return (
    <div className="main">

      <div className="content h-screen min-h-screen bg-cover bg-center text-white relative pt-[100px] ml-full flex flex-col items-center justify-center">
        <h1 className="text-[50px] pl-[20px] tracking-wider font-semibold opacity-0 translate-y-10 animate-fade-in">
          WELCOME <br/>To <br/>
          <span className="text-orange-500 text-[60px]">UniPATH</span>
        </h1>
        <p className="par pl-[10px] text-center w-[70%]">
          Explore UNILAG like never before! <br />
          Start your journey with UniPATH today and discover the best paths around the campus.
        </p>
        <button className="btn text-black w-[160px] h-[40px] bg-orange-500 ml-[20px] mb-[10px] text-[18px] font-semibold rounded-lg hover:bg-white transition duration-300 ease-in-out">
          <a href="/map">Get Started</a>
        </button>
      </div>
      
    </div>
  );
}
