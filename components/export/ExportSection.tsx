"use client";

import { useState, useCallback, useMemo } from "react";
import { Download, Check, Copy } from "lucide-react";
import { useStore, useActions } from "@/store/useStore";
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { CodeBlock } from "./CodeBlock";
import {
  generateNextJsCode,
  generateHtmlMetaTags,
  generateVercelOgCode,
} from "@/lib/code-gen";
import { copyToClipboard, downloadFromUrl } from "@/lib/utils";

export function ExportSection() {
  const { title, description, icon, backgroundColor, textColor, accentColor, previewUrl, activeExportTab } = useStore();
  const { setUI } = useActions();
  const [copied, setCopied] = useState(false);

  const state = useMemo(
    () => ({ title, description, icon, backgroundColor, textColor, accentColor }),
    [title, description, icon, backgroundColor, textColor, accentColor]
  );

  // Memoize code generation
  const codes = useMemo(
    () => ({
      nextjs: generateNextJsCode(state),
      html: generateHtmlMetaTags(state),
      vercel: generateVercelOgCode(state),
    }),
    [state]
  );

  const handleCopyCode = useCallback(async () => {
    const code = codes[activeExportTab];
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [codes, activeExportTab]);

  const handleDownload = useCallback(() => {
    if (previewUrl) {
      downloadFromUrl(previewUrl, "og-image.png");
    }
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownload}
          disabled={!previewUrl}
          icon={<Download className="h-4 w-4" />}
          className="flex-1"
        >
          Download PNG
        </Button>
        <Button
          variant="secondary"
          onClick={handleCopyCode}
          icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          className="flex-1"
        >
          {copied ? "Copied!" : "Copy Code"}
        </Button>
      </div>

      {/* Code tabs */}
      <Tabs
        defaultValue="nextjs"
        value={activeExportTab}
        onValueChange={(value) => setUI({ activeExportTab: value as typeof activeExportTab })}
      >
        <TabsList className="w-full">
          <TabsTrigger value="nextjs" className="flex-1">
            Next.js
          </TabsTrigger>
          <TabsTrigger value="html" className="flex-1">
            HTML
          </TabsTrigger>
          <TabsTrigger value="vercel" className="flex-1">
            Vercel OG
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nextjs">
          <CodeBlock code={codes.nextjs} language="typescript" />
        </TabsContent>

        <TabsContent value="html">
          <CodeBlock code={codes.html} language="html" />
        </TabsContent>

        <TabsContent value="vercel">
          <CodeBlock code={codes.vercel} language="typescript" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ExportSection;
