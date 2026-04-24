import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function DialogNeutral({label="apri", data, description="", title="", close, className}) {
  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button className={`text-[0.6rem] p-2 h-fit uppercase`}>{label}</Button>
        </DialogTrigger>
        <DialogContent className={`${className} max-w-none!`}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          {data}
          <DialogFooter>
            {close && 
            <DialogClose asChild>
              <Button className={`text-[0.6rem] p-2 h-fit uppercase`}>{close}</Button>
            </DialogClose> }
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
