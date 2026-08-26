"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    Search,
    Filter,
    Trash2,
    Eye,
    RefreshCw,
    Download,
    MessageSquare,
    ThumbsUp,
    Calendar,
    User,
    Copy,
    Check,
    MoreVertical,
    ArrowUpDown,
    Sparkles,
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export interface CustomerReview {
    id: string | number;
    fullname?: string;
    full_name?: string;
    name?: string;
    email?: string;
    review?: string;
    comment?: string;
    content?: string;
    rating: number;
    created_at?: string;
    status?: string;
}

export default function AdminCustomerReviewsPage() {
    const [reviews, setReviews] = useState<CustomerReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("newest");

    // Selected review for Detail Modal
    const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    // Selected review for Delete Modal
    const [reviewToDelete, setReviewToDelete] = useState<CustomerReview | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Copy state feedback
    const [copiedId, setCopiedId] = useState<string | number | null>(null);

    // Fetch reviews from Supabase
    const fetchReviews = async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const { data, error } = await supabase
                .from("reviews")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            setReviews(data || []);
            if (isManualRefresh) {
                toast.success("Reviews updated successfully");
            }
        } catch (error: any) {
            console.error("Error fetching reviews:", error);
            toast.error(error.message || "Failed to load customer reviews");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Helper getters for robust field mapping
    const getReviewerName = (r: CustomerReview) =>
        r.fullname || r.full_name || r.name || "Anonymous Customer";

    const getReviewContent = (r: CustomerReview) =>
        r.review || r.comment || r.content || "No comment provided.";

    const getReviewDate = (r: CustomerReview) => {
        if (!r.created_at) return "N/A";
        return new Date(r.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Delete review handler
    const handleDeleteReview = async () => {
        if (!reviewToDelete) return;
        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from("reviews")
                .delete()
                .eq("id", reviewToDelete.id);

            if (error) throw error;

            setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
            toast.success("Review deleted successfully");
            setShowDeleteDialog(false);
            setReviewToDelete(null);
        } catch (error: any) {
            console.error("Error deleting review:", error);
            toast.error(error.message || "Failed to delete review");
        } finally {
            setIsDeleting(false);
        }
    };

    // Copy review text handler
    const handleCopyReview = (review: CustomerReview) => {
        const name = getReviewerName(review);
        const content = getReviewContent(review);
        const textToCopy = `"${content}" - ${name} (${review.rating}/5 stars)`;

        navigator.clipboard.writeText(textToCopy);
        setCopiedId(review.id);
        toast.success("Review copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Export to CSV
    const handleExportCSV = () => {
        if (reviews.length === 0) {
            toast.error("No reviews available to export");
            return;
        }

        const headers = ["ID", "Customer Name", "Rating", "Review", "Date"];
        const rows = filteredReviews.map((r) => [
            r.id,
            `"${getReviewerName(r).replace(/"/g, '""')}"`,
            r.rating,
            `"${getReviewContent(r).replace(/"/g, '""')}"`,
            `"${getReviewDate(r)}"`,
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `customer_reviews_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Exported reviews to CSV");
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const total = reviews.length;
        if (total === 0) {
            return {
                total: 0,
                average: "0.0",
                fiveStarPercent: 0,
                distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            };
        }

        const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
        const avg = (sum / total).toFixed(1);

        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => {
            const star = Math.min(Math.max(Math.round(r.rating || 0), 1), 5) as 1 | 2 | 3 | 4 | 5;
            dist[star] = (dist[star] || 0) + 1;
        });

        const fiveStarPercent = Math.round((dist[5] / total) * 100);

        return {
            total,
            average: avg,
            fiveStarPercent,
            distribution: dist,
        };
    }, [reviews]);

    // Filter and sort reviews
    const filteredReviews = useMemo(() => {
        return reviews
            .filter((r) => {
                const name = getReviewerName(r).toLowerCase();
                const content = getReviewContent(r).toLowerCase();
                const search = searchTerm.toLowerCase();

                const matchesSearch = name.includes(search) || content.includes(search);

                const matchesRating =
                    ratingFilter === "all" || r.rating.toString() === ratingFilter;

                return matchesSearch && matchesRating;
            })
            .sort((a, b) => {
                if (sortBy === "newest") {
                    return (
                        new Date(b.created_at || 0).getTime() -
                        new Date(a.created_at || 0).getTime()
                    );
                }
                if (sortBy === "oldest") {
                    return (
                        new Date(a.created_at || 0).getTime() -
                        new Date(b.created_at || 0).getTime()
                    );
                }
                if (sortBy === "highest") {
                    return b.rating - a.rating;
                }
                if (sortBy === "lowest") {
                    return a.rating - b.rating;
                }
                return 0;
            });
    }, [reviews, searchTerm, ratingFilter, sortBy]);

    return (
        <div className="min-h-screen bg-background p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto space-y-8"
            >
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                                Customer Reviews
                            </h1>
                            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold">
                                Supabase Sync
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">
                            View, filter, and manage feedback submitted by your customers.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchReviews(true)}
                            disabled={refreshing || loading}
                            className="gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportCSV}
                            disabled={reviews.length === 0}
                            className="gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card className="border border-border/60 shadow-sm bg-card/60 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs uppercase font-medium tracking-wider">
                                Average Rating
                            </CardDescription>
                            <div className="flex items-baseline gap-3 mt-1">
                                <CardTitle className="text-4xl font-bold font-serif text-foreground">
                                    {stats.average}
                                </CardTitle>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= Math.round(Number(stats.average))
                                                    ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                                                    : "text-neutral-200 dark:text-neutral-700"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                Based on {stats.total} verified customer review{stats.total === 1 ? "" : "s"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/60 shadow-sm bg-card/60 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs uppercase font-medium tracking-wider">
                                5-Star Satisfaction
                            </CardDescription>
                            <div className="flex items-baseline gap-3 mt-1">
                                <CardTitle className="text-4xl font-bold font-serif text-foreground">
                                    {stats.fiveStarPercent}%
                                </CardTitle>
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950/40 dark:border-green-800">
                                    <ThumbsUp className="w-3 h-3 mr-1" /> High Satisfaction
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                {stats.distribution[5]} out of {stats.total} reviews are 5 stars
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/60 shadow-sm bg-card/60 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs uppercase font-medium tracking-wider">
                                Rating Breakdown
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1.5 pt-0">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats.distribution[star as keyof typeof stats.distribution] || 0;
                                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-xs">
                                        <span className="w-3 font-medium text-muted-foreground">{star}</span>
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 transition-all duration-500 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="w-8 text-right text-muted-foreground">{count}</span>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Controls */}
                <Card className="border border-border/60 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search input */}
                            <div className="relative md:col-span-2">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by customer name or review text..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Rating Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Ratings</SelectItem>
                                        <SelectItem value="5">5 Stars</SelectItem>
                                        <SelectItem value="4">4 Stars</SelectItem>
                                        <SelectItem value="3">3 Stars</SelectItem>
                                        <SelectItem value="2">2 Stars</SelectItem>
                                        <SelectItem value="1">1 Star</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort By */}
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="highest">Highest Rating</SelectItem>
                                        <SelectItem value="lowest">Lowest Rating</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews Table */}
                <Card className="border border-border/60 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                    Customer Reviews ({filteredReviews.length})
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Showing {filteredReviews.length} of {reviews.length} total reviews
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            // Skeleton Loader
                            <div className="p-6 space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start justify-between p-4 border border-border/40 rounded-lg animate-pulse bg-muted/10"
                                    >
                                        <div className="space-y-2 flex-1 pr-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-muted"></div>
                                                <div>
                                                    <div className="w-32 h-4 bg-muted rounded"></div>
                                                    <div className="w-20 h-3 bg-muted rounded mt-1"></div>
                                                </div>
                                            </div>
                                            <div className="w-3/4 h-4 bg-muted rounded mt-3"></div>
                                            <div className="w-1/2 h-3 bg-muted rounded"></div>
                                        </div>
                                        <div className="w-16 h-6 bg-muted rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            // Empty State
                            <div className="text-center py-16 px-4 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                        No reviews found
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                                        {searchTerm || ratingFilter !== "all"
                                            ? "No reviews match your current filter criteria. Try resetting your search or filters."
                                            : "No customer reviews have been submitted yet."}
                                    </p>
                                </div>
                                {(searchTerm || ratingFilter !== "all") && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setRatingFilter("all");
                                        }}
                                    >
                                        Reset Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            // Table View
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            <th className="py-3.5 px-6">Customer</th>
                                            <th className="py-3.5 px-4">Rating</th>
                                            <th className="py-3.5 px-6">Review</th>
                                            <th className="py-3.5 px-4">Submitted</th>
                                            <th className="py-3.5 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        <AnimatePresence>
                                            {filteredReviews.map((review, index) => {
                                                const name = getReviewerName(review);
                                                const content = getReviewContent(review);
                                                const dateStr = getReviewDate(review);
                                                const initials = getInitials(name);

                                                return (
                                                    <motion.tr
                                                        key={review.id}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -6 }}
                                                        transition={{ duration: 0.2, delay: index * 0.03 }}
                                                        className="hover:bg-muted/30 transition-colors group"
                                                    >
                                                        {/* Customer */}
                                                        <td className="py-4 px-6 align-top">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center text-xs shrink-0 border border-primary/20">
                                                                    {initials}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-foreground leading-snug">
                                                                        {name}
                                                                    </p>
                                                                    {review.email && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {review.email}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Rating */}
                                                        <td className="py-4 px-4 align-top">
                                                            <div className="flex items-center gap-1">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className={`px-2 py-0.5 gap-1 font-semibold ${review.rating >= 4
                                                                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300"
                                                                            : review.rating === 3
                                                                                ? "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300"
                                                                                : "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border-red-300"
                                                                        }`}
                                                                >
                                                                    <span>{review.rating}</span>
                                                                    <Star className="w-3.5 h-3.5 fill-current" />
                                                                </Badge>
                                                            </div>
                                                        </td>

                                                        {/* Review Content */}
                                                        <td className="py-4 px-6 align-top max-w-md">
                                                            <p className="text-foreground leading-relaxed line-clamp-3">
                                                                "{content}"
                                                            </p>
                                                        </td>

                                                        {/* Submitted Date */}
                                                        <td className="py-4 px-4 align-top text-xs text-muted-foreground whitespace-nowrap">
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                                                                <span>{dateStr}</span>
                                                            </div>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="py-4 px-6 align-top text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                    title="View Details"
                                                                    onClick={() => {
                                                                        setSelectedReview(review);
                                                                        setShowDetailDialog(true);
                                                                    }}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                    title="Copy Review"
                                                                    onClick={() => handleCopyReview(review)}
                                                                >
                                                                    {copiedId === review.id ? (
                                                                        <Check className="w-4 h-4 text-green-600" />
                                                                    ) : (
                                                                        <Copy className="w-4 h-4" />
                                                                    )}
                                                                </Button>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                                    title="Delete Review"
                                                                    onClick={() => {
                                                                        setReviewToDelete(review);
                                                                        setShowDeleteDialog(true);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* View Review Detail Dialog */}
                <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                    <DialogContent className="max-w-lg">
                        {selectedReview && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 font-serif text-xl">
                                        <User className="w-5 h-5 text-primary" />
                                        {getReviewerName(selectedReview)}
                                    </DialogTitle>
                                    <DialogDescription className="text-xs">
                                        Submitted on {getReviewDate(selectedReview)}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 my-2">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50">
                                        <span className="text-sm font-medium text-muted-foreground">Rating</span>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= selectedReview.rating
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-neutral-300 dark:text-neutral-700"
                                                        }`}
                                                />
                                            ))}
                                            <span className="ml-1.5 text-sm font-bold">
                                                {selectedReview.rating}/5
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Full Feedback
                                        </span>
                                        <div className="p-4 rounded-lg bg-background border border-border/60 text-sm leading-relaxed whitespace-pre-wrap">
                                            "{getReviewContent(selectedReview)}"
                                        </div>
                                    </div>

                                    {selectedReview.email && (
                                        <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                                            <span>Email:</span>
                                            <span className="font-mono text-foreground">{selectedReview.email}</span>
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="flex gap-2 sm:justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleCopyReview(selectedReview)}
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copy Text
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setShowDetailDialog(false)}
                                    >
                                        Close
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-destructive flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Delete Customer Review
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this review by{" "}
                                <span className="font-semibold text-foreground">
                                    {reviewToDelete ? getReviewerName(reviewToDelete) : "this customer"}
                                </span>
                                ? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        {reviewToDelete && (
                            <div className="p-3 bg-muted/40 rounded-md border border-border/40 text-xs italic line-clamp-2 my-2">
                                "{getReviewContent(reviewToDelete)}"
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setReviewToDelete(null);
                                }}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteReview}
                                disabled={isDeleting}
                                className="gap-2"
                            >
                                {isDeleting && <RefreshCw className="w-4 h-4 animate-spin" />}
                                {isDeleting ? "Deleting..." : "Delete Review"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </motion.div>
        </div>
    );
}
