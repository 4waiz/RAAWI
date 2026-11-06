import { useEffect } from 'react';
import { useNazar } from '../store';
import { ExperienceShell } from '../components/ExperienceShell';

export default function Experience() {
  useEffect(() => {
    document.title = 'Experience — NAZAR';
    const s = useNazar.getState();
    if (s.overview && !s.focusEntryId) s.focus('barjeel-al-fahidi');
  }, []);
  return <ExperienceShell />;
}
