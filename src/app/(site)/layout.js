import { getSettings } from "@/lib/setting";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next"
import { Separator } from "@/components/ui/separator";

export default async function Layout({ children }) {

  const s = await getSettings();

  if (s.workon == "true") 
  
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-black px-6 text-white">
      <div className="flex max-w-xl flex-col items-center text-center gap-3">
        <img src={s.favicon} className="w-20"/>
        <span className="text-lg font-semibold tracking-tight text-brand">
          sandrobarrasso.com
        </span>
        <Separator/>
        <span className="text-xs  text-white/70">
          SITO MOMENTANEAMENTE IN MANUTENZIONE<br/>
          Stiamo lavorando per migliorare il sito. Torneremo online il prima
          possibile.
        </span>
      </div>
    </main>
  )

  return (
  <>
  <div className="h-screen w-screen flex flex-col justify-between overflow-auto">
    <Analytics/>
    <Header/>
    <div className="flex-1">
      {children}
    </div>
    <Footer/>
  </div>
  </>
  );
}
