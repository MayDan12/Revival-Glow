"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LaunchModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("launch_modal:dismissed");
      if (!dismissed) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    try {
      localStorage.setItem("launch_modal:dismissed", "1");
    } catch {}
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : handleClose())}
    >
      <DialogContent className="sm:max-w-md text-center flex flex-col items-center p-8">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <span className="text-4xl">🚀</span>
        </div>
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl mb-2 text-center">We Are Officially Live!</DialogTitle>
          <DialogDescription className="text-base text-center">
            Thank you for your patience. Our new collection is finally here. 
            Explore the latest drops and elevate your style today.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 w-full">
          <Button onClick={handleClose} className="w-full text-lg py-6 rounded-xl">
            Explore the Collection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
