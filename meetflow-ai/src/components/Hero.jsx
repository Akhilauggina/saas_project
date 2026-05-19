import { ArrowRight, Play } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__badge">
            <span className="glow-dot" />
            AI-Powered Meeting Intelligence
          </div>

          <h1 className="hero__title">
            Master Your Meetings <span className="hero__title-accent">With AI</span>
          </h1>

          <p className="hero__desc">
            Transform your chaotic recordings into actionable clarity. Empower your team with automated transcripts, intelligent task extraction, and collaborative dashboards designed to turn every spoken word into a measurable step toward collective success.
          </p>

          <div className="hero__actions">
            <a href="#contact" className="btn-primary hero__cta">
              Get Started Free <ArrowRight size={16} />
            </a>
            <button className="hero__play">
              <div className="hero__play-icon">
                <Play size={14} fill="currentColor" />
              </div>
              Know more
            </button>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__dashboard">
            <div className="hero__dash-header">
              <div className="hero__dash-dots">
                <span /><span /><span />
              </div>
              <span className="hero__dash-title">Meeting Dashboard</span>
            </div>
            <div className="hero__dash-body">
              <div className="hero__dash-transcript">
                <div className="hero__dash-label">Live Transcript</div>
                <div className="hero__dash-lines">
                  {['Discuss Q3 roadmap priorities...', 'Assign backend tasks to team...', 'Review deployment timeline...', 'Schedule follow-up meeting...'].map((t, i) => (
                    <div key={i} className="hero__dash-line" style={{ animationDelay: `${i * 0.4}s` }}>
                      <div className="hero__dash-avatar" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hero__dash-tasks">
                <div className="hero__dash-label">Extracted Tasks</div>
                {[
                  { t: 'Update API docs', tag: 'Dev', done: true },
                  { t: 'Design review', tag: 'Design', done: false },
                  { t: 'Deploy staging', tag: 'Dev', done: false },
                ].map((task, i) => (
                  <div key={i} className={`hero__task ${task.done ? 'hero__task--done' : ''}`}>
                    <div className="hero__task-check">{task.done && '✓'}</div>
                    <span className="hero__task-text">{task.t}</span>
                    <span className="hero__task-tag">{task.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hero__stat hero__stat--1">
            <div className="hero__stat-num">98%</div>
            <div className="hero__stat-label">Accuracy</div>
          </div>
          <div className="hero__stat hero__stat--2">
            <div className="hero__stat-num">10x</div>
            <div className="hero__stat-label">Faster</div>
          </div>
        </div>
      </div>
    </section>
  );
}
