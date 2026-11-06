import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import { Notices } from './components/Notices';
import { useNazar } from './store';
import { checkHealth } from './lib/api';

const Experience = lazy(() => import('./pages/Experience'));
const PitchDemo = lazy(() => import('./pages/PitchDemo'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  useEffect(() => {
    checkHealth().then((h) => {
      useNazar.getState().set({
        apiStatus: { checked: true, live: Boolean(h?.liveAI), vision: Boolean(h?.vision), provider: h?.provider ?? 'none' },
      });
    });
  }, []);
  return (
    <BrowserRouter basename={basename}>
      <Notices />
      <Suspense fallback={<div className="min-h-[100dvh] bg-midnight" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/pitch-demo" element={<PitchDemo />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
