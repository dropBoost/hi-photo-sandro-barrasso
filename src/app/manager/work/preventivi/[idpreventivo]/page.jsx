// import ElencoPreventiviRaggruppati from "./ElencoPreventivi"

import PreventivoView from "./preventivoView"

export default async function PAGEpreventiviAnagrafica ({params}) {

  const {idpreventivo} = await params

  return (
    <>
    <div className="flex lg:flex-row flex-col h-full gap-4">
      <div className="basis-5/6 bg-neutral-300 dark:bg-neutral-900 p-6 rounded-2xl">
        <PreventivoView idpreventivo={idpreventivo}/>
      </div>
      <div className="basis-1/6 border rounded-2xl">

      </div>
    </div>
    </>
  )
}