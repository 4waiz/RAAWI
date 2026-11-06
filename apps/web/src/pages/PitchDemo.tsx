import { useEffect } from 'react';
import { ExperienceShell } from '../components/ExperienceShell';
import { resetDemo } from '../lib/pitch';

export default function PitchDemo() {
  useEffect(() => {
    document.title = 'Presenter — NAZAR';
    resetDemo();
  }, []);
  return <ExperienceShell presenter />;
}
