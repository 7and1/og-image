"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: "typescript" | "html" | "jsx";
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5",
          "text-xs font-medium transition-all duration-150",
          copied
            ? "bg-green-600 text-white"
            : "bg-neutral-700 text-neutral-300 opacity-0 group-hover:opacity-100 hover:bg-neutral-600"
        )}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </button>

      {/* Code display */}
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
        {/* Language badge */}
        <div className="flex items-center border-b border-neutral-800 px-4 py-2">
          <span className="text-xs font-medium text-neutral-500">
            {language === "typescript" && "TypeScript"}
            {language === "html" && "HTML"}
            {language === "jsx" && "JSX"}
          </span>
        </div>

        {/* Code content */}
        <pre className="overflow-x-auto p-4 text-sm">
          <code className="font-mono text-neutral-300 whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;
