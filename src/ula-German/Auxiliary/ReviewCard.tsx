import { Heart, Star } from "lucide-react";
import React from "react";

const ReviewCard: React.FC<{ review: any }> = ({ review }) => (
    <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
            <img
                src={review.avatar}
                alt={review.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-100 object-cover"
                loading="lazy"
            />
            <div>
                <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1a2b48]">
                        {review.name}
                    </h4>
                    <span className="bg-green-50 text-green-600 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded">
                        {review.level}
                    </span>
                </div>
                <div className="flex gap-0.5 text-yellow-400">
                    <Star size={9} fill="currentColor" />
                    <Star size={9} fill="currentColor" />
                    <Star size={9} fill="currentColor" />
                    <Star size={9} fill="currentColor" />
                    <Star size={9} fill="currentColor" />
                </div>
            </div>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-snug mb-2 line-clamp-2">
            {review.text}
        </p>
        <div className="flex justify-between items-center pt-1.5 border-t border-slate-50">
            <div className="flex flex-wrap gap-1">
                {review.tags.map((tag: string, i: number) => (
                    <span
                        key={i}
                        className="bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded-md"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Heart size={12} /> {review.likes}
            </div>
        </div>
    </div>
);


export default ReviewCard