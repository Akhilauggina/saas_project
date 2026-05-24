import { ArrowRight, Play } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="hero__bg-orb hero__bg-orb--1" />
        <div className="hero__bg-orb hero__bg-orb--2" />
        <div className="hero__bg-orb hero__bg-orb--3" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        {/* Left: Content */}
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="badge">
              <span className="pulse-dot" />
              AI-Powered Meeting Intelligence
            </span>
          </div>

          <h1 className="hero__title">
            <span className="hero__title-line">Master Your</span>
            <span className="hero__title-line hero__title-accent">Meetings With AI</span>
          </h1>

          <p className="hero__desc">
            Transform chaotic recordings into actionable clarity. Automated transcripts, intelligent task extraction, and collaborative dashboards — built for modern teams.
          </p>

          <div className="hero__actions">
            <a href="#contact" className="btn-primary hero__cta">
              Get Started Free <ArrowRight size={15} />
            </a>
            <button className="hero__play">
              <div className="hero__play-ring">
                <Play size={13} fill="currentColor" />
              </div>
              Watch demo
            </button>
          </div>

          <div className="hero__trust">
            <div className="hero__avatars">
              {['AU','JW','SC','ER'].map((init, i) => (
                <div key={i} className="hero__avatar">{init}</div>
              ))}
            </div>
            <p className="hero__trust-text">
              Trusted by <strong>2,000+ teams</strong><br />across 40+ countries
            </p>
          </div>
        </div>

        {/* Right: Dashboard window */}
        <div className="hero__visual">
          <div className="hero__window">
            <div className="hero__win-bar">
              <div className="hero__win-dots">
                <span /><span /><span />
              </div>
              <span className="hero__win-title">Meeting Dashboard</span>
              <div className="hero__win-status">
                <span className="hero__win-status-dot" />
                Live
              </div>
            </div>
            <div className="hero__win-body">
              <div className="hero__transcript">
                <div className="hero__panel-label">Live Transcript</div>
                <div className="hero__lines">
                  {[
                    'Discuss Q3 roadmap priorities...',
                    'Assign backend tasks to team...',
                    'Review deployment timeline...',
                    'Schedule follow-up meeting...',
                  ].map((t, i) => (
                    <div key={i} className="hero__line" style={{ animationDelay: `${i * 0.35}s` }}>
                      <div className="hero__line-av" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hero__tasks">
                <div className="hero__panel-label">Extracted Tasks</div>
                {[
                  { t: 'Update API docs', tag: 'Dev', done: true },
                  { t: 'Design review', tag: 'Design', done: false },
                  { t: 'Deploy staging', tag: 'DevOps', done: false },
                ].map((task, i) => (
                  <div key={i} className={`hero__task-item ${task.done ? 'hero__task-item--done' : ''}`}>
                    <div className="hero__task-check">{task.done && '✓'}</div>
                    <span className="hero__task-name">{task.t}</span>
                    <span className="hero__task-tag">{task.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hero__badge-float hero__badge-float--1">
            <div className="hero__badge-num">98%</div>
            <div className="hero__badge-lbl">Accuracy</div>
          </div>
          <div className="hero__badge-float hero__badge-float--2">
            <div className="hero__badge-num">10×</div>
            <div className="hero__badge-lbl">Faster</div>
          </div>
        </div>
      </div>
    </section>
  );
}
