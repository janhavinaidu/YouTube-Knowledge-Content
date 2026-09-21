import { FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowUpRight,
  BookOpenText,
  Check,
  Clipboard,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  Hash,
  Lightbulb,
  Link2,
  ListTree,
  LoaderCircle,
  Play,
  Search,
  Sparkles,
  TriangleAlert,
  Youtube,
} from 'lucide-react';
import {
  useAnalyzeYoutubeVideo,
  type AnalyzeVideoResponse,
  type ContentIdea,
} from '@workspace/api-client-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeVideoResponse | null>(null);
  const [formError, setFormError] = useState('');
  const [copied, setCopied] = useState('');
  const mutation = useAnalyzeYoutubeVideo();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setFormError('Paste a YouTube link to begin.');
      return;
    }
    if (!/youtube\.com|youtu\.be/i.test(trimmedUrl)) {
      setFormError('That does not look like a YouTube URL. Try a watch or short link.');
      return;
    }
    setFormError('');
    mutation.reset();
    mutation.mutate(
      { data: { url: trimmedUrl } },
      { onSuccess: (response) => setAnalysis(response) },
    );
  };

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('');
    }
  };

  return (
    <div className="workspace-grid min-h-[100dvh] overflow-x-hidden">
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3" data-testid="brand-mark">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--accent))]">
            <Play size={16} fill="currentColor" strokeWidth={1.5} />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Field notes</p>
            <p className="text-sm font-semibold tracking-tight text-foreground">YouTube / knowledge</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4f9b76]" />
          <span>Private research desk</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-12">
        <section className="relative grid gap-10 pb-14 pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.6fr)] lg:items-end lg:gap-20 lg:pb-20 lg:pt-20">
          <div className="animate-rise max-w-3xl">
            <div className="mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} strokeWidth={2.2} />
              <span>Watch less. Understand more.</span>
            </div>
            <h1 className="max-w-4xl text-[clamp(3.35rem,8vw,7.7rem)] font-semibold leading-[.87] tracking-[-0.075em] text-foreground">
              Turn watching into a <span className="text-accent">point of view.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Drop in a public video. Get the useful shape of it back: the argument, the memorable details, and five directions worth making your own.
            </p>
          </div>
          <div className="animate-rise hidden justify-self-end lg:block" style={{ animationDelay: '120ms' }}>
            <div className="max-w-[260px] border-l border-foreground/15 pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">A better starting point</p>
              <p className="mt-4 text-2xl font-medium leading-tight tracking-[-.04em] text-foreground">
                From open tab to working brief in one pass.
              </p>
            </div>
          </div>
        </section>

        <section className="relative z-10 rounded-[1.4rem] border border-foreground/10 bg-card p-4 paper-shadow sm:p-6 lg:p-7" aria-label="Analyze a YouTube video">
          <form onSubmit={submit}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <label htmlFor="youtube-url" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Link2 size={16} className="text-accent" />
                Start with a public YouTube link
              </label>
              <span className="hidden font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground sm:block">One video at a time</span>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex min-w-0 flex-1 items-center">
                <Youtube className="absolute left-4 text-accent" size={20} strokeWidth={1.8} />
                <input
                  id="youtube-url"
                  data-testid="input-youtube-url"
                  value={url}
                  onChange={(event) => { setUrl(event.target.value); setFormError(''); }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="h-14 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm text-foreground outline-none transition-[border,box-shadow] placeholder:text-muted-foreground/75 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  autoComplete="url"
                  spellCheck={false}
                />
              </div>
              <button
                type="submit"
                data-testid="button-analyze-video"
                disabled={mutation.isPending}
                className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_0_hsl(230_26%_16%/.1)] active:translate-y-0 disabled:cursor-wait disabled:opacity-70 md:min-w-[170px]"
              >
                {mutation.isPending ? <LoaderCircle size={18} className="animate-spin" /> : <Search size={18} />}
                <span>{mutation.isPending ? 'Reading video' : 'Analyze video'}</span>
                {!mutation.isPending && <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
              </button>
            </div>
            {formError && <p className="mt-3 flex items-center gap-2 text-sm text-destructive" data-testid="status-form-error"><TriangleAlert size={15} />{formError}</p>}
            {mutation.isPending && <AnalysisLoading />}
            {mutation.isError && !mutation.isPending && (
              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm sm:flex-row sm:items-center sm:justify-between" data-testid="status-analysis-error">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="mt-0.5 shrink-0 text-destructive" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">This video could not be read.</p>
                    <p className="mt-1 text-muted-foreground">{getErrorMessage(mutation.error)}</p>
                  </div>
                </div>
                <button type="button" data-testid="button-retry-analysis" onClick={() => submit(new Event('submit') as unknown as FormEvent<HTMLFormElement>)} className="shrink-0 self-start rounded-lg border border-destructive/25 px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 sm:self-center">Try again</button>
              </div>
            )}
          </form>
        </section>

        {analysis ? (
          <AnalysisReport analysis={analysis} copied={copied} onCopy={copyText} />
        ) : !mutation.isPending ? (
          <EmptyWorkspace />
        ) : null}
      </main>
      <footer className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 pb-7 text-[11px] text-muted-foreground sm:px-8 lg:px-12">
        <span className="font-mono uppercase tracking-[.16em]">YK / 001</span>
        <span>Make something of what you watch.</span>
      </footer>
    </div>
  );
}

function EmptyWorkspace() {
  return (
    <section className="grid gap-4 pt-12 lg:grid-cols-[1.4fr_.6fr] lg:pt-20" data-testid="empty-workspace">
      <div className="relative min-h-[280px] overflow-hidden rounded-[1.4rem] border border-foreground/10 bg-primary p-7 text-primary-foreground sm:p-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[34px] border-accent/80" />
        <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full border-[22px] border-[#e8dc77]/70" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary-foreground/60">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Your next useful rabbit hole
          </div>
          <div className="mt-16 max-w-md">
            <p className="text-3xl font-medium leading-[1.03] tracking-[-.055em] sm:text-4xl">Bring the video. Leave with a working brief.</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/65">No dashboards to configure. No library to maintain. Just a clear place to think after you press play.</p>
          </div>
        </div>
      </div>
      <div className="rounded-[1.4rem] border border-foreground/10 bg-card p-7 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-accent">The handoff</p>
        <ol className="mt-7 space-y-6">
          {[
            ['01', 'Paste', 'Any public watch or short link.'],
            ['02', 'Scan', 'A sharp summary and the details around it.'],
            ['03', 'Make', 'Five original angles ready to work from.'],
          ].map(([number, title, text]) => (
            <li key={number} className="flex gap-4" data-testid={`item-workflow-${number}`}>
              <span className="font-mono text-[11px] text-accent">{number}</span>
              <div><p className="font-semibold text-foreground">{title}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AnalysisLoading() {
  return (
    <div className="mt-6 border-t border-border pt-5" data-testid="status-analysis-loading">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent"><LoaderCircle size={15} className="animate-spin" /></div>
        <div>
          <p className="text-sm font-semibold text-foreground">Building your field notes</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Pulling out the signal, then finding the edges.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <div className="h-2 animate-pulse-soft rounded-full bg-muted" />
        <div className="h-2 animate-pulse-soft rounded-full bg-muted [animation-delay:180ms]" />
        <div className="h-2 animate-pulse-soft rounded-full bg-muted [animation-delay:360ms]" />
      </div>
    </div>
  );
}

function AnalysisReport({ analysis, copied, onCopy }: { analysis: AnalyzeVideoResponse; copied: string; onCopy: (key: string, text: string) => void }) {
  const { video } = analysis;
  const copyButton = (key: string, text: string, label = 'Copy') => (
    <button type="button" data-testid={`button-copy-${key}`} onClick={() => onCopy(key, text)} className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      {copied === key ? <Check size={13} className="text-[#4f9b76]" /> : <Copy size={13} />}
      <span>{copied === key ? 'Copied' : label}</span>
    </button>
  );

  return (
    <section className="animate-rise pt-12 lg:pt-20" data-testid="analysis-report">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-foreground/10 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-accent"><Check size={13} /> Analysis complete</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.055em] text-foreground sm:text-4xl">Your working brief</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Freshly pulled</span>
          <div className="h-1.5 w-1.5 rounded-full bg-[#4f9b76]" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(270px,.55fr)]">
        <div className="space-y-5">
          <article className="rounded-[1.4rem] border border-foreground/10 bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row">
              {video.thumbnail_url ? (
                <img src={video.thumbnail_url} alt="" data-testid="img-video-thumbnail" className="aspect-video w-full rounded-xl object-cover sm:w-56" />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-primary text-primary-foreground sm:w-56"><Youtube size={30} /></div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">Source video</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-.04em] text-foreground" data-testid="text-video-title">{video.title || 'Untitled video'}</h3>
                  </div>
                  {video.video_id && <a href={`https://www.youtube.com/watch?v=${video.video_id}`} target="_blank" rel="noreferrer" data-testid="link-source-video" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><ExternalLink size={16} /></a>}
                </div>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {video.channel && <span className="font-medium text-foreground/75">{video.channel}</span>}
                  {video.duration && <span className="flex items-center gap-1"><Clock3 size={13} />{video.duration}</span>}
                  <span className="flex items-center gap-1"><FileText size={13} />{analysis.transcript_word_count.toLocaleString()} words</span>
                </div>
              </div>
            </div>
            {analysis.transcript_truncated && <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">The transcript was long, so this brief is based on the strongest available section of the conversation.</p>}
          </article>

          <article className="rounded-[1.4rem] border border-foreground/10 bg-card p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">The short version</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.045em] text-foreground">Summary</h3></div>
              {copyButton('summary', analysis.summary)}
            </div>
            <p className="mt-6 max-w-3xl text-[17px] leading-8 text-foreground/80" data-testid="text-analysis-summary">{analysis.summary}</p>
          </article>

          <article className="rounded-[1.4rem] border border-foreground/10 bg-card p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">Keep these close</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.045em] text-foreground">Key takeaways</h3></div>
              {copyButton('takeaways', analysis.key_takeaways.map((item, index) => `${index + 1}. ${item}`).join('\n'))}
            </div>
            <div className="mt-7 space-y-5">
              {analysis.key_takeaways.map((takeaway, index) => (
                <div key={`${takeaway}-${index}`} className="flex gap-4" data-testid={`item-key-takeaway-${index}`}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">{index + 1}</span>
                  <p className="pt-1 text-sm leading-6 text-foreground/80">{takeaway}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-5">
          <article className="rounded-[1.4rem] border border-foreground/10 bg-[#e8dc77] p-6 text-primary sm:p-7">
            <div className="flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-[.18em]">At a glance</p><BookOpenText size={19} /></div>
            <p className="mt-10 text-5xl font-semibold tracking-[-.08em]">{analysis.transcript_word_count.toLocaleString()}</p>
            <p className="mt-1 text-sm font-medium">transcript words scanned</p>
            <div className="mt-8 border-t border-primary/20 pt-4 text-xs leading-5 text-primary/70">The raw material is now arranged for a second look.</div>
          </article>

          <article className="rounded-[1.4rem] border border-foreground/10 bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-accent"><ListTree size={17} /><p className="font-mono text-[10px] uppercase tracking-[.18em]">Structured notes</p></div>
            <div className="mt-7 space-y-7">
              {analysis.structured_notes.map((note, index) => (
                <div key={`${note.heading}-${index}`} data-testid={`note-structured-${index}`}>
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Hash size={14} className="text-accent" />{note.heading}</p>
                  <ul className="mt-3 space-y-2.5 pl-5">
                    {note.points.map((point, pointIndex) => <li key={`${point}-${pointIndex}`} className="list-disc text-sm leading-5 text-muted-foreground">{point}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>

      <IdeasSection ideas={analysis.content_ideas} onCopy={onCopy} copied={copied} />
    </section>
  );
}

function IdeasSection({ ideas, onCopy, copied }: { ideas: ContentIdea[]; onCopy: (key: string, text: string) => void; copied: string }) {
  return (
    <section className="mt-5 rounded-[1.4rem] border border-foreground/10 bg-primary p-6 text-primary-foreground sm:p-8 lg:p-10" data-testid="content-ideas-section">
      <div className="flex flex-col justify-between gap-5 border-b border-primary-foreground/15 pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-accent"><Lightbulb size={15} /> Make it yours</p>
          <h3 className="mt-3 max-w-xl text-3xl font-semibold leading-none tracking-[-.06em] sm:text-4xl">Five ways to take the idea somewhere new.</h3>
        </div>
        <p className="max-w-[220px] text-sm leading-5 text-primary-foreground/60">These are starting points, not scripts. Add your own lived experience.</p>
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {ideas.slice(0, 5).map((idea, index) => {
          const copyKey = `idea-${index}`;
          const copyValue = `${idea.title}\n\nHook: ${idea.hook}\nFormat: ${idea.format}\n\n${idea.explanation}`;
          return (
            <article key={`${idea.title}-${index}`} className="group flex min-h-[285px] flex-col rounded-xl border border-primary-foreground/15 bg-primary-foreground/[.06] p-5 transition-transform hover:-translate-y-1" data-testid={`card-content-idea-${index}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-accent">0{index + 1}</span>
                <button type="button" data-testid={`button-copy-idea-${index}`} onClick={() => onCopy(copyKey, copyValue)} className="rounded-md p-1.5 text-primary-foreground/55 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  {copied === copyKey ? <Check size={14} className="text-accent" /> : <Clipboard size={14} />}
                </button>
              </div>
              <h4 className="mt-7 text-lg font-semibold leading-tight tracking-[-.035em]" data-testid={`text-content-idea-title-${index}`}>{idea.title}</h4>
              <p className="mt-3 text-sm font-medium leading-5 text-accent">{idea.hook}</p>
              <div className="mt-auto pt-7">
                <span className="inline-flex rounded-full border border-primary-foreground/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[.13em] text-primary-foreground/65">{idea.format}</span>
                <p className="mt-3 text-xs leading-5 text-primary-foreground/55">{idea.explanation}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const value = (error as { error?: unknown }).error;
    if (typeof value === 'string') return value;
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Check the link and try once more.';
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
