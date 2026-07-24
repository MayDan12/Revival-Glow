"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ReviewPage() {
  const [fullname, setFullname] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || !review.trim() || rating === 0) {
      toast.error("Please fill in all fields and select a rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert([
        {
          fullname: fullname.trim(),
          review: review.trim(),
          rating,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("Thank you for your review!");
      setFullname("");
      setReview("");
      setRating(0);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 md:px-6 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-lg border border-neutral-200/60 shadow-sm dark:border-neutral-800/60 bg-background/60 backdrop-blur-md">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-semibold tracking-tight">Leave a Review</CardTitle>
          <CardDescription className="text-muted-foreground mt-2 text-base">
            Share your experience with our products. We value your feedback!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                placeholder="John Doe"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-3">
              <Label>Rating</Label>
              <div className="flex gap-1" onMouseLeave={() => setHoveredRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`size-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                          : "text-neutral-200 dark:text-neutral-800"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Tell us what you loved..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
                className="min-h-[140px] resize-none bg-background/50 leading-relaxed"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
