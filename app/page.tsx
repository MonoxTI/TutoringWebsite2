"use client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── SECTION 1: HERO ─────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000 0%, #0a1628 40%, #1d4ed8 100%)",
        color: "#fff",
        padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) 4rem",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: "55vw", height: "55vw", maxWidth: 700,
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 800, position: "relative", zIndex: 1 }}>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.5rem,7vw,5.5rem)",
            lineHeight: 0.95, letterSpacing: "-0.01em",
            textTransform: "uppercase", marginBottom: "0.5rem",
          }}>
            GRADE 12
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(3rem,8vw,6.5rem)",
            lineHeight: 0.95, marginBottom: "1rem",
          }}>
            Mathematics
          </p>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.8rem,4vw,3.5rem)",
            textTransform: "uppercase", marginBottom: "1.25rem",
          }}>
            Monthly Subscription
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1.8rem,4vw,3rem)",
              color: "#60a5fa",
            }}>
              15% OFF
            </span>{" "}
            <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)" }}>
              valid only for March
            </span>
          </p>
          <p style={{
            fontSize: "clamp(1rem,2vw,1.25rem)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 580, marginBottom: "1.5rem",
          }}>
            Mathematics is a language that requires understanding the fundamentals
            & the underlying basics of all its topics — post psychological transformation.
          </p>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.2rem,2.5vw,1.6rem)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            borderBottom: "2px solid #fff",
            display: "inline-block",
            paddingBottom: "0.35rem",
            marginBottom: "2.5rem",
          }}>
            Making Education Fashionable
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/appointments" style={{
              background: "#2563b8", color: "#fff",
              padding: "0.95rem 2.5rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: "0.95rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              borderRadius: 4, textDecoration: "none",
              display: "inline-block",
            }}>
              BOOK A SESSION
            </Link>
            <Link href="/services" style={{
              background: "transparent", color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.4)",
              padding: "0.95rem 2.5rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: "0.9rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              borderRadius: 4, textDecoration: "none",
              display: "inline-block",
            }}>
              VIEW SERVICES
            </Link>
          </div>
        </div>

        {/* Logo watermark — top right */}
        <div style={{
          position: "absolute", right: "clamp(1rem,5vw,4rem)",
          top: "50%", transform: "translateY(-50%)",
          opacity: 0.08, pointerEvents: "none",
        }}>
          <img
            src="/images/logo.png"
            alt=""
            style={{ height: "clamp(200px,35vw,500px)", width: "auto" }}
          />
        </div>
      </section>

      {/* ── SECTION 2: MISSION ──────────────────────────── */}
      <section style={{
        background: "#fff",
        color: "#111",
        padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)",
      }}>
        <div style={{ maxWidth: 780 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: "0.72rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#2563b8", marginBottom: "0.5rem",
          }}>
            Our Philosophy
          </div>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2rem,5vw,3.5rem)",
            lineHeight: 0.95, letterSpacing: "-0.01em",
            textTransform: "uppercase", marginBottom: "0.5rem",
          }}>
            ABOUT
          </h2>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(1.5rem,3vw,2.5rem)",
            color: "#374151", marginBottom: "2rem",
          }}>
            Mission
          </h3>

          {[
            <>The barrier encountered in learning is often not a lack of "logic," but a psychological block. Our aim commences with addressing the Cognitive, Affective, and Metacognitive layers of learning. Simply, <strong>Psychological Transformation</strong> is a technique we use to psychologically infiltrate & remove the thought(s) that certain subjects are unattainable (e.g., "Mathematics is hard"). Once the learner's psychological thoughts are realigned, constant engagement with the work is required.</>,
            <>Mathematics requires memory — the ability to hold multiple pieces of information (like a formula, a carry-over digit, and a negative sign) all at once. Thus, for better interaction, we offer monthly subscriptions. We have noted in the past that the more interaction with the work, the easier it is for their minds to absorb fundamental underlying principles.</>,
            <>We use <strong>cognitive offloading</strong> to 'offload' the mental agony into intermediate steps that are constantly practised, and free up the 'mental script' for complex problem-solving.</>,
          ].map((text, i) => (
            <p key={i} style={{
              fontSize: "clamp(0.95rem,1.5vw,1.05rem)",
              lineHeight: 1.8, color: "#374151",
              marginBottom: "1.25rem",
            }}>
              {text}
            </p>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: FOUNDER ──────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #000 0%, #0a1628 40%, #1d4ed8 100%)",
        color: "#fff",
        padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem", alignItems: "center",
          maxWidth: 1100,
        }}>
          <div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: "0.72rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#60a5fa", marginBottom: "0.5rem",
            }}>
              Meet the Team
            </div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem,5vw,3.5rem)",
              lineHeight: 0.95, textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}>
              ABOUT
            </h2>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(1.5rem,3vw,2.5rem)",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2rem",
            }}>
              Founder
            </h3>
            <p style={{
              fontSize: "clamp(0.95rem,1.5vw,1.05rem)",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.75)",
            }}>
              A proud alumna of Pretoria High School for Girls, a BCom Law and LLB
              graduate from the University of Pretoria. She aspires to become an
              Advocate of the Republic, driven by her passion for justice and
              commitment to guiding the youth beyond the courtroom — offering career
              mentorship and transforming the belief that mathematics is complicated.
              She strongly upholds the ethos of rewiring, instilling confidence and
              unlocking the capability of any learner, especially those deemed inattentive.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
              borderRadius: 12, padding: 8,
              border: "1px solid rgba(59,130,246,0.2)",
            }}>
              <img
                src="/images/pic1.png"
                alt="Founder of Assembled Tutoring"
                style={{ height: 320, width: "auto", objectFit: "contain", borderRadius: 8 }}
              />
            </div>
            <blockquote style={{
              textAlign: "center",
              fontStyle: "italic",
              color: "rgba(147,197,253,0.9)",
              borderLeft: "3px solid #60a5fa",
              paddingLeft: "1rem",
              fontSize: "0.9rem", lineHeight: 1.6,
              maxWidth: 320,
            }}>
              "Mathematics is a language that requires understanding the fundamentals
              & the underlying basics of all its topics."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: METHODOLOGY ──────────────────────── */}
      <section style={{
        background: "#fff",
        padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          {/* Alumni image */}
          <div style={{
            maxWidth: 700, margin: "0 auto 3rem",
            border: "1px solid #e5e7eb",
            borderRadius: 10, overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}>
            <img
              src="/images/pic2.jpg"
              alt="Assembled Tutoring Alumni"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          {/* Why sections */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", marginBottom: "3rem" }}>
            {[
              {
                title: "Why Psychometric Testing?",
                body: "To assess whether the learner is to the standard of their grade, by identifying their loopholes from past grades, to ensure underlying principles are understood. We cannot move forward without addressing previous loopholes — a loopholed foundation collapses the next phase.",
              },
              {
                title: "Why Weekly Tests?",
                body: "Engagement is crucial — constant practice leads to success. When learners write weekly tests they become more engaged with the work, they study weekly, and personalised feedback on their tests is sent to parents/guardians.",
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ borderLeft: "3px solid #2563b8", paddingLeft: "1.5rem" }}>
                <h4 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800, fontSize: "1.1rem",
                  textTransform: "uppercase", color: "#0a1628",
                  marginBottom: "0.75rem",
                }}>
                  {title}
                </h4>
                <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#374151" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          <h3 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: "1.2rem",
            textTransform: "uppercase", color: "#0a1628",
            marginBottom: "1.5rem",
          }}>
            Additional Services
          </h3>

          {/* Additional services image */}
          <div style={{
            maxWidth: 700, margin: "0 auto",
            border: "1px solid #e5e7eb",
            borderRadius: 10, overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}>
            <img
              src="/images/pic4.jpg"
              alt="Additional Services"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 5: SERVICES PREVIEW ─────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #000 0%, #0a1628 40%, #1d4ed8 100%)",
        color: "#fff",
        padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2rem,5vw,3.5rem)",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}>
            SERVICES
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { grade: "", monthly: "Monthly Subscription: 2 hrs/week (4 sessions)", perLesson: "Rate per lesson (2 hrs)" },
              { grade: "GRADE 4–7",   monthly: "R1 500", perLesson: "R500" },
              { grade: "GRADE 8–9",   monthly: "R1 800", perLesson: "R600" },
              { grade: "GRADE 10",    monthly: "R2 000", perLesson: "R650" },
              { grade: "GRADE 11–12", monthly: "R2 300", perLesson: "R700" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1.5fr",
                alignItems: "center",
                background: i === 0 ? "transparent" : "rgba(0,0,0,0.25)",
                border: `1px solid ${i === 0 ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.2)"}`,
                borderRadius: 6, padding: "1rem 1.5rem",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: i === 0 ? 700 : 600,
                fontSize: i === 0 ? "0.75rem" : "1.05rem",
                letterSpacing: i === 0 ? "0.12em" : "0.02em",
                color: i === 0 ? "rgba(147,197,253,0.9)" : "#fff",
                textTransform: i === 0 ? "uppercase" : "none",
              }}>
                <span>{item.grade}</span>
                <span>{item.monthly}</span>
                <span>{item.perLesson}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2.5rem" }}>
            <Link href="/services" style={{
              background: "#2563b8", color: "#fff",
              padding: "0.95rem 2.5rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: "0.95rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              borderRadius: 4, textDecoration: "none",
              display: "inline-block",
            }}>
              VIEW FULL SERVICES →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}