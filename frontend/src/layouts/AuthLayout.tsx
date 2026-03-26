import { Navigate, Outlet } from "react-router-dom";
import { BorderBeam } from "@/components/ui/border-beam";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const { isError, isLoading } = useAuth();

  if (isLoading) return "Cargando..";

  if (!isError) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">

      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1422 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-60"
      >
        <defs>
          <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="oooscillate-grad">
            <stop stopColor="hsl(174, 72%, 46%)" stopOpacity="1" offset="0%" />
            <stop stopColor="hsl(174, 72%, 26%)" stopOpacity="1" offset="100%" />
          </linearGradient>
        </defs>
        <g strokeWidth="1.5" stroke="url(#oooscillate-grad)" fill="none" strokeLinecap="round">
          <path d="M 0 572 Q 355.5 -100 711 400 Q 1066.5 900 1422 572" />
          <path d="M 0 550 Q 355.5 -100 711 400 Q 1066.5 900 1422 550" />
          <path d="M 0 528 Q 355.5 -100 711 400 Q 1066.5 900 1422 528" />
          <path d="M 0 506 Q 355.5 -100 711 400 Q 1066.5 900 1422 506" />
          <path d="M 0 484 Q 355.5 -100 711 400 Q 1066.5 900 1422 484" />
          <path d="M 0 462 Q 355.5 -100 711 400 Q 1066.5 900 1422 462" />
          <path d="M 0 440 Q 355.5 -100 711 400 Q 1066.5 900 1422 440" />
          <path d="M 0 418 Q 355.5 -100 711 400 Q 1066.5 900 1422 418" />
          <path d="M 0 396 Q 355.5 -100 711 400 Q 1066.5 900 1422 396" />
          <path d="M 0 374 Q 355.5 -100 711 400 Q 1066.5 900 1422 374" />
          <path d="M 0 352 Q 355.5 -100 711 400 Q 1066.5 900 1422 352" />
          <path d="M 0 330 Q 355.5 -100 711 400 Q 1066.5 900 1422 330" />
          <path d="M 0 308 Q 355.5 -100 711 400 Q 1066.5 900 1422 308" />
          <path d="M 0 286 Q 355.5 -100 711 400 Q 1066.5 900 1422 286" />
          <path d="M 0 264 Q 355.5 -100 711 400 Q 1066.5 900 1422 264" />
          <path d="M 0 242 Q 355.5 -100 711 400 Q 1066.5 900 1422 242" />
          <path d="M 0 220 Q 355.5 -100 711 400 Q 1066.5 900 1422 220" />
          <path d="M 0 198 Q 355.5 -100 711 400 Q 1066.5 900 1422 198" />
          <path d="M 0 176 Q 355.5 -100 711 400 Q 1066.5 900 1422 176" />
          <path d="M 0 154 Q 355.5 -100 711 400 Q 1066.5 900 1422 154" />
          <path d="M 0 132 Q 355.5 -100 711 400 Q 1066.5 900 1422 132" />
          <path d="M 0 110 Q 355.5 -100 711 400 Q 1066.5 900 1422 110" />
          <path d="M 0 88 Q 355.5 -100 711 400 Q 1066.5 900 1422 88"  />
          <path d="M 0 66 Q 355.5 -100 711 400 Q 1066.5 900 1422 66"  />
          <path d="M 0 44 Q 355.5 -100 711 400 Q 1066.5 900 1422 44"  />
        </g>
      </svg>

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-fit">
        <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl shadow-2xl shadow-black/50 p-12 overflow-hidden">
          <BorderBeam
            duration={8}
            size={350}
            colorFrom="#14b8a6"
            colorTo="#0f766e"
            borderWidth={2}
          />
          <Outlet />
        </div>

        <p className="text-center text-slate-500 text-xs mt-6 font-mono">
          Proyectos Automatización COMPRES {new Date().getFullYear()}
        </p>
      </div>

    </div>
  );
}
