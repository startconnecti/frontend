'use client';

import { useState, useId } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import type { AdminSystemConfig } from '../types';
import { useUpdateSystemConfigMutation } from '../hooks/use-admin-system-configs';
import { formatConfigDate } from '../utils/config-helpers';

interface ConfigRowProps {
  config: AdminSystemConfig;
}

export function ConfigRow({ config }: ConfigRowProps) {
  const id = useId();
  const { mutate, isPending } = useUpdateSystemConfigMutation();

  // Local draft state
  const [draft, setDraft] = useState<unknown>(config.value);
  const isDirty = draft !== config.value;

  const handleSave = () => {
    mutate({ key: config.key, value: draft });
  };

  const handleReset = () => {
    setDraft(config.value);
  };

  const renderInput = () => {
    switch (config.valueType) {
      case 'boolean': {
        const checked = draft === true || draft === 'true';
        return (
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={(val) => setDraft(val)}
            disabled={!config.editable || isPending}
          />
        );
      }
      case 'number': {
        const numVal = draft === null || draft === undefined ? '' : String(draft);
        return (
          <Input
            id={id}
            type="number"
            min={0}
            step="any"
            value={numVal}
            onChange={(e) => {
              const parsed = parseFloat(e.target.value);
              setDraft(isNaN(parsed) ? e.target.value : parsed);
            }}
            disabled={!config.editable || isPending}
            className="max-w-[160px]"
          />
        );
      }
      case 'string':
      default: {
        const strVal = draft === null || draft === undefined ? '' : String(draft);
        return (
          <Input
            id={id}
            type="text"
            value={strVal}
            onChange={(e) => setDraft(e.target.value)}
            disabled={!config.editable || isPending}
            className="max-w-[280px]"
          />
        );
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-5 border-b border-border/50 last:border-0">
      {/* Label + description */}
      <div className="flex-1 min-w-0 space-y-1">
        <label htmlFor={id} className="text-sm font-semibold text-foreground leading-none">
          {config.label}
        </label>
        {config.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{config.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-[10px] text-muted-foreground/70">
            Default: <span className="font-mono">{String(config.defaultValue ?? '—')}</span>
          </span>
          {config.updatedAt && (
            <span className="text-[10px] text-muted-foreground/70">
              Updated: {formatConfigDate(config.updatedAt)}
            </span>
          )}
          {!config.editable && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Read-only
            </Badge>
          )}
        </div>
      </div>

      {/* Input + actions */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {renderInput()}

        {config.editable && (
          <>
            {isDirty && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                disabled={isPending}
                title="Discard changes"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isPending || !isDirty}
              className="h-8 gap-1.5 font-semibold"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
