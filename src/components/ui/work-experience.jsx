import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const formatRange = (start, end) => {
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const opts = { month: 'short', year: 'numeric' };
  return `${s.toLocaleDateString('en-US', opts)} - ${e ? e.toLocaleDateString('en-US', opts) : 'Present'}`;
};

const WorkExperience = ({ workExperience = [], activeWork, setActiveWork }) => {
  const contentRefs = useRef({});
  const [heights, setHeights] = useState({});

  // measure heights for each content area
  const measureHeights = () => {
    const newHeights = {};
    workExperience.forEach((w) => {
      const el = contentRefs.current[w.id];
      newHeights[w.id] = el ? `${el.scrollHeight}px` : '0px';
    });
    setHeights(newHeights);
  };

  useEffect(() => {
    measureHeights();

    // re-measure after images/fonts load a bit later
    const t = setTimeout(measureHeights, 300);

    const onResize = () => {
      // small debounce
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(measureHeights, 120);
    };
    const resizeTimer = { current: null };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(t);
      clearTimeout(resizeTimer.current);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workExperience]);

  const toggle = (id) => {
    if (activeWork === id) {
      setActiveWork(null);
      // allow collapse transition
      setTimeout(measureHeights, 200);
    } else {
      setActiveWork(id);

      // measure now and after next paint, then scroll into view if needed
      requestAnimationFrame(() => {
        measureHeights();
        // small delay to let transition start and layout settle
        setTimeout(() => {
          const el = contentRefs.current[id];
          if (!el) return;

          // if bottom of content is below viewport, scroll so it's visible
          const rect = el.getBoundingClientRect();
          const padding = 24; // offset from bottom
          if (rect.bottom > window.innerHeight - padding) {
            window.scrollBy({
              top: rect.bottom - window.innerHeight + padding,
              left: 0,
              behavior: 'smooth',
            });
          } else if (rect.top < 0) {
            // if top of content is above viewport, bring it into view
            el.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
      });
    }
  };

  return (
    <section id="experience" className="py-20">
      <div className="flex items-center gap-4 mb-10">
        <span className="text-[#64ffda] font-mono text-xl flex-shrink-0">02.</span>
        <h2 className="text-[#ccd6f6] text-2xl md:text-3xl font-bold flex-shrink-0">Where I've Worked</h2>
        <div className="flex-1 h-px bg-[#233554] ml-4" />
      </div>

      <div className="where-i-have-worked-container mt-8">
        <div className="flex flex-col gap-4">
          {workExperience.map((work) => {
            const open = activeWork === work.id;
            return (
              <div key={work.id} className="bg-transparent border-l-2 border-[#233554] rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggle(work.id)}
                  aria-expanded={open}
                  className={`w-full flex items-center justify-between px-4 py-4 text-left text-[#a8b2d1] hover:text-[#64ffda] transition-colors
                    ${open ? 'text-[#64ffda] bg-[#0b1a2a]' : ''}`}
                >
                  <div>
                    <div className="text-sm md:text-base font-semibold text-[#ccd6f6]">
                      {work.position}
                      <span className="text-[#8892b0]"> &nbsp;@&nbsp; </span>
                      <span className="text-[#64ffda]">{work.company}</span>
                    </div>
                    <div className="text-xs text-[#a8b2d1] mt-1">{formatRange(work.start_date, work.end_date)}</div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-[#64ffda] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  ref={(el) => (contentRefs.current[work.id] = el)}
                  className="px-6 text-[#8892b0] transition-[max-height] duration-300 overflow-hidden"
                  style={{ maxHeight: open ? heights[work.id] || '1000px' : '0px' }}
                >
                  <ul className="list-none pl-5 space-y-3 py-4">
                    {work.description?.map((d, i) => (
                      <li key={i} className="relative pl-5">
                        <span className="absolute left-0 text-[#64ffda]">▹</span>
                        <div className="break-words">{d}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;