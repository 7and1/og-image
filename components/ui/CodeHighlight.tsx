"use client";

import { Highlight, themes } from "prism-react-renderer";
import { cn } from "@/lib/utils";

interface CodeHighlightProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeHighlight({
  code,
  language = "tsx",
  showLineNumbers = false,
  className,
}: CodeHighlightProps) {
  return (
    <Highlight
      theme={themes.nightOwl}
      code={code.trim()}
      language={language}
    >
      {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            preClassName,
            "overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm",
            className
          )}
          style={style}
        >
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line });
            return (
              <div key={i} {...lineProps} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell select-none pr-4 text-right text-neutral-500">
                    {i + 1}
                  </span>
                )}
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}

export default CodeHighlight;
