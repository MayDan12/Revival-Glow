"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Waitlist } from "./waitlist";

export function WaitlistModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      // const joined = localStorage.getItem("waitlist:joined");
      // const dismissed = localStorage.getItem("waitlist:dismissed");
      // if (!joined && !dismissed) setOpen(true);
      setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    try {
      localStorage.setItem("waitlist:dismissed", "1");
    } catch {}
  };

  const handleSuccess = () => {
    try {
      localStorage.setItem("waitlist:joined", "1");
    } catch {}
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : handleClose())}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-serif">Join the Waitlist</DialogTitle>
          <DialogDescription>
            Be the first to know when new drops arrive.
          </DialogDescription>
        </DialogHeader>

        <Waitlist onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
