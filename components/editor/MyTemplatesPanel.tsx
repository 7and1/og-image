"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@/components/ui";
import {
  createTemplateName,
  deleteMyTemplate,
  fetchMyTemplates,
  renameMyTemplate,
  safeTemplateError,
  saveMyTemplate,
} from "@/lib/my-templates";
import type { MyTemplateItem, MyTemplatePayload } from "@/types";

interface MyTemplatesPanelProps {
  userKey: string;
  onUserKeyChange: (value: string) => void;
  values: MyTemplatePayload;
  onApply: (payload: MyTemplatePayload) => void;
}

function normalizePayloadForSave(values: MyTemplatePayload): MyTemplatePayload {
  if (values.backgroundMode === "upload") {
    return {
      ...values,
      backgroundImageSrc: null,
      backgroundId: null,
    };
  }

  return values;
}

function formatDate(dateText: string): string {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }
  return date.toLocaleString();
}

export function MyTemplatesPanel({
  userKey,
  onUserKeyChange,
  values,
  onApply,
}: MyTemplatesPanelProps) {
  const [items, setItems] = useState<MyTemplateItem[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [renaming, setRenaming] = useState(false);

  const normalizedUserKey = useMemo(() => userKey.trim(), [userKey]);

  const reload = async () => {
    if (!normalizedUserKey) {
      setError("Please enter your user key first.");
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const next = await fetchMyTemplates(normalizedUserKey);
      setItems(next);
    } catch (err) {
      setError(safeTemplateError(err, "Failed to load your templates"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!normalizedUserKey) {
      setError("Please enter your user key first.");
      return;
    }

    const finalName = name.trim() || createTemplateName(values.title);
    const payload = normalizePayloadForSave(values);

    setSaving(true);
    setError(null);

    try {
      const saved = await saveMyTemplate({
        userKey: normalizedUserKey,
        name: finalName,
        payload,
      });

      setItems((previous) => [saved, ...previous.filter((item) => item.id !== saved.id)]);
      setName("");
    } catch (err) {
      setError(safeTemplateError(err, "Failed to save template"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!normalizedUserKey) {
      setError("Please enter your user key first.");
      return;
    }

    setActiveDeleteId(templateId);
    setError(null);

    try {
      await deleteMyTemplate({
        userKey: normalizedUserKey,
        id: templateId,
      });
      setItems((previous) => previous.filter((item) => item.id !== templateId));
    } catch (err) {
      setError(safeTemplateError(err, "Failed to delete template"));
    } finally {
      setActiveDeleteId(null);
    }
  };

  const handleStartRename = (item: MyTemplateItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
    setError(null);
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleConfirmRename = async () => {
    if (!normalizedUserKey || !editingId) {
      return;
    }

    const trimmedName = editingName.trim();
    if (!trimmedName) {
      setError("Name cannot be empty");
      return;
    }

    setRenaming(true);
    setError(null);

    try {
      const updated = await renameMyTemplate({
        userKey: normalizedUserKey,
        id: editingId,
        name: trimmedName,
      });
      setItems((previous) =>
        previous.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      setError(safeTemplateError(err, "Failed to rename template"));
    } finally {
      setRenaming(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-neutral-200">My Templates</h3>
        <p className="text-[11px] leading-relaxed text-neutral-500">
          Save your current design to D1 and reuse it anytime.
        </p>
      </div>

      <Input
        label="User Key"
        placeholder="e.g. team-marketing"
        value={userKey}
        onChange={(event) => onUserKeyChange(event.target.value)}
        hint="Same key = same template list"
      />

      <Input
        label="Template Name"
        placeholder="Optional (auto-generated when empty)"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={reload} loading={loading}>
          Load
        </Button>
        <Button onClick={handleSave} loading={saving}>
          Save Current
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-xs text-neutral-500">
            No templates yet. Save your current design to create one.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2"
            >
              {editingId === item.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-200 outline-none focus:border-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleConfirmRename();
                      } else if (e.key === "Escape") {
                        handleCancelRename();
                      }
                    }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleConfirmRename}
                      loading={renaming}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelRename}
                      disabled={renaming}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="cursor-pointer truncate text-xs font-medium text-neutral-200 hover:text-blue-400"
                    onClick={() => handleStartRename(item)}
                    title="Click to rename"
                  >
                    {item.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-neutral-500">
                    Updated: {formatDate(item.updatedAt)}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onApply(item.payload)}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      loading={activeDeleteId === item.id}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTemplatesPanel;
