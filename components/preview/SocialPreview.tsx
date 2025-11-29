"use client";

import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SocialPreviewProps {
  platform: "twitter" | "linkedin" | "facebook";
  title: string;
  description: string;
  imageUrl: string | null;
  siteUrl?: string;
}

export function SocialPreview({
  platform,
  title,
  description,
  imageUrl,
  siteUrl = "yoursite.com",
}: SocialPreviewProps) {
  const configs = {
    twitter: {
      name: "Twitter / X",
      imageRatio: "aspect-[506/253]",
      maxTitle: 70,
      maxDesc: 200,
    },
    linkedin: {
      name: "LinkedIn",
      imageRatio: "aspect-[1200/627]",
      maxTitle: 150,
      maxDesc: 300,
    },
    facebook: {
      name: "Facebook",
      imageRatio: "aspect-[1200/630]",
      maxTitle: 100,
      maxDesc: 200,
    },
  };

  const config = configs[platform];

  const truncate = useCallback(
    (str: string, max: number) =>
      str.length > max ? str.slice(0, max - 3) + "..." : str,
    []
  );

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-neutral-500">
        {config.name}
      </span>

      <div
        className={cn(
          "overflow-hidden rounded-xl border",
          platform === "twitter" && "border-neutral-700 bg-neutral-800",
          platform === "linkedin" && "border-neutral-300 bg-white",
          platform === "facebook" && "border-neutral-300 bg-white"
        )}
      >
        {/* Image */}
        <div className={cn(config.imageRatio, "bg-neutral-700 overflow-hidden")}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${config.name} preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-neutral-500 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            "p-3",
            platform === "twitter" && "bg-neutral-800",
            platform === "linkedin" && "bg-white",
            platform === "facebook" && "bg-neutral-50"
          )}
        >
          {/* URL */}
          <div
            className={cn(
              "text-xs mb-1",
              platform === "twitter" && "text-neutral-500",
              platform === "linkedin" && "text-neutral-500 uppercase",
              platform === "facebook" && "text-neutral-500 uppercase text-[10px]"
            )}
          >
            {siteUrl}
          </div>

          {/* Title */}
          <div
            className={cn(
              "font-semibold leading-tight",
              platform === "twitter" && "text-white text-sm",
              platform === "linkedin" && "text-neutral-900 text-sm",
              platform === "facebook" && "text-neutral-900 text-base"
            )}
          >
            {truncate(title, config.maxTitle)}
          </div>

          {/* Description */}
          {platform !== "twitter" && description && (
            <div
              className={cn(
                "mt-1 text-sm leading-relaxed",
                platform === "linkedin" && "text-neutral-600",
                platform === "facebook" && "text-neutral-500"
              )}
            >
              {truncate(description, config.maxDesc)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SocialPreview);
