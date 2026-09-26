'use client';
import { useRef, useState } from 'react';
import { ArchiveRestore, Download, Eye, FileJson } from 'lucide-react';
import { useReadingList } from './reading-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { mergeBackup, previewBackup } from '@/lib/reading-backup';
import { backupLimit, type ReadingEntry } from '@/lib/reading-list';
import { downloadReading } from '@/lib/reading-download';
export function ReadingBackup() {
  const { entries, allowed, ready, write } = useReadingList();
  const input = useRef<HTMLTextAreaElement>(null);
  const previewButton = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState('');
  const [raw, setRaw] = useState('');
  const [preview, setPreview] = useState<ReadingEntry[] | null>(null);
  return (
    <Card className="mt-12">
      <section aria-labelledby="backup-heading">
        <CardHeader className="flex-row flex-wrap items-start justify-between gap-4 space-y-0">
          <div className="min-w-0 space-y-1.5">
            <CardTitle id="backup-heading" className="flex items-center gap-2">
              <FileJson aria-hidden="true" className="size-5 text-brand" />
              Reading-list backup
            </CardTitle>
            <CardDescription>
              Move your folded corners between browsers with a small JSON file.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={!ready}
            onClick={() => {
              try {
                downloadReading(entries, allowed);
                setMessage('Backup download requested.');
              } catch {
                setMessage(
                  'Backup could not be downloaded. Your saved list is unchanged.',
                );
              }
            }}
          >
            <Download aria-hidden="true" />
            Download all saved references
          </Button>
        </CardHeader>
        <CardContent>
          <label className="mb-0">
            <span className="mb-2 block">Paste reading-list backup</span>
            <Textarea
              ref={input}
              value={raw}
              maxLength={backupLimit}
              spellCheck={false}
              placeholder='{ "version": 1, "entries": [ … ] }'
              onChange={(event) => {
                setRaw(event.target.value);
                setPreview(null);
                setMessage('');
              }}
            />
          </label>
          <p className="mt-2 text-xs text-muted-foreground">
            JSON only, up to 65,536 characters. Existing entries will keep their
            reading status.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-4"
            ref={previewButton}
            disabled={!ready || !raw.trim()}
            onClick={() => {
              try {
                const result = previewBackup(raw, entries, allowed);
                setPreview(result.entries);
                setMessage(
                  `${result.added} new references; ${result.existing} already saved.`,
                );
              } catch {
                setPreview(null);
                setMessage('Invalid backup. No saved data was changed.');
              }
            }}
          >
            <Eye aria-hidden="true" />
            Preview backup
          </Button>
          {preview ? (
            <div
              role="group"
              aria-label="Backup preview"
              className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-brand/40 bg-brand-soft/60 p-4"
            >
              <p className="min-w-0 flex-1 text-sm">
                <span className="font-semibold">
                  {preview.length} validated references.
                </span>{' '}
                Existing entries keep their current reading status.
              </p>
              <Button
                type="button"
                variant="brand"
                size="sm"
                disabled={!ready}
                onClick={() => {
                  try {
                    const merged = mergeBackup(entries, preview, allowed);
                    if (write(merged, 'Backup merged with saved references.')) {
                      setPreview(null);
                      setRaw('');
                      setMessage('Backup imported.');
                      input.current?.focus();
                    }
                  } catch {
                    setMessage(
                      'Backup could not be imported. Saved data is unchanged.',
                    );
                  }
                }}
              >
                <ArchiveRestore aria-hidden="true" />
                Confirm merge
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPreview(null);
                  setMessage('Import canceled.');
                  previewButton.current?.focus();
                }}
              >
                Cancel import
              </Button>
            </div>
          ) : null}
          <p role="status" className="mt-3 text-sm font-medium empty:hidden">
            {message}
          </p>
        </CardContent>
      </section>
    </Card>
  );
}
