"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { SpeakerIcon } from "./Icons";

// Reads the plain-text content of the article aloud using the browser's
// built-in Web Speech API (SpeechSynthesis) — no external service, no
// API key. Kannada voice availability depends entirely on the reader's
// browser/OS, which is called out in the note under the button.
export default function ReadAloudButton({ text }) {
  const { t, lang } = useSite();
  const [state, setState] = useState("idle"); // idle | playing | paused
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  function handleClick() {
    const synth = window.speechSynthesis;
    if (state === "idle") {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "en" ? "en-IN" : "kn-IN";
      utterance.rate = 0.98;
      utterance.onend = () => setState("idle");
      utterance.onerror = () => setState("idle");
      utteranceRef.current = utterance;
      synth.cancel();
      synth.speak(utterance);
      setState("playing");
    } else if (state === "playing") {
      synth.pause();
      setState("paused");
    } else {
      synth.resume();
      setState("playing");
    }
  }

  const label = state === "playing" ? t("read_aloud_pause") : t("read_aloud");

  return (
    <>
      <button className={`read-aloud-btn${state === "playing" ? " playing" : ""}`} onClick={handleClick}>
        <SpeakerIcon />
        <span>{label}</span>
      </button>
      <p className="read-aloud-note" style={{ marginTop: -16 }}>{t("read_aloud_note")}</p>
    </>
  );
}
