/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { DialogueState, DialogueOption } from "../types";
import { sound } from "../engine/sound";
import { MessageSquareText } from "lucide-react";

interface DialogueBoxProps {
  dialogue: DialogueState;
  onClose: () => void;
  onSelectOption?: (option: DialogueOption | string, index: number) => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onClose, onSelectOption }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const textIndex = useRef(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // Reset typing state on new dialogue text
    setDisplayedText("");
    setIsTyping(true);
    textIndex.current = 0;

    if (timer.current) clearInterval(timer.current);

    timer.current = window.setInterval(() => {
      if (textIndex.current < dialogue.text.length) {
        setDisplayedText((prev) => prev + dialogue.text[textIndex.current]);
        
        // Play short speech synth blip periodically
        if (textIndex.current % 2 === 0) {
          const nameLower = dialogue.speaker.toLowerCase();
          const pitchOffset = nameLower.includes("kakek") || nameLower.includes("elrick") || nameLower.includes("sage") 
            ? 0.7 
            : nameLower.includes("penyihir") || nameLower.includes("jeral") || nameLower.includes("wiz")
            ? 1.3
            : 1.0;
          sound.playTalk(pitchOffset);
        }

        textIndex.current += 1;
      } else {
        setIsTyping(false);
        if (timer.current) {
          clearInterval(timer.current);
          timer.current = null;
        }
      }
    }, 18); // Speedy prints (18 ms per letter)

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [dialogue.text, dialogue.speaker]);

  // Handler to skip compilation and print all text
  const handleBoxClick = (e: React.MouseEvent) => {
    // If clicking an option button, ignore
    if ((e.target as HTMLElement).closest(".dialogue-option-button")) {
      return;
    }

    if (isTyping) {
      if (timer.current) clearInterval(timer.current);
      setDisplayedText(dialogue.text);
      setIsTyping(false);
    } else {
      // Only close if there are NO options remaining to choose from!
      const hasOptions = dialogue.options && dialogue.options.length > 0;
      if (!hasOptions) {
        if (dialogue.onComplete) {
          dialogue.onComplete();
        }
        onClose();
      }
    }
  };

  // Determine avatar icon drawing or theme colors based on speaker name
  const getSpeakerTheme = () => {
    const name = dialogue.speaker.toLowerCase();
    if (name.includes("kakek") || name.includes("elrick") || name.includes("sage") || name.includes("xian")) {
      return {
        bg: "bg-blue-950/95 border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
        title: "text-blue-400 border-blue-800",
        avatar: "👴",
      };
    }
    if (name.includes("paman") || name.includes("bardo") || name.includes("barnaby") || name.includes("blacksmith")) {
      return {
        bg: "bg-emerald-950/95 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        title: "text-emerald-400 border-emerald-800",
        avatar: "🧑‍🏭",
      };
    }
    if (name.includes("kapten") || name.includes("austin") || name.includes("ken") || name.includes("guard") || name.includes("sersan")) {
      return {
        bg: "bg-red-950/95 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
        title: "text-red-400 border-red-800",
        avatar: "🛡️",
      };
    }
    if (name.includes("penyihir") || name.includes("jeral") || name.includes("wizard")) {
      return {
        bg: "bg-purple-950/95 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        title: "text-purple-400 border-purple-800",
        avatar: "🧙‍♂️",
      };
    }
    if (name.includes("walikota") || name.includes("roland") || name.includes("mayor")) {
      return {
        bg: "bg-amber-950/95 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
        title: "text-amber-400 border-amber-800",
        avatar: "🎩",
      };
    }
    return {
      bg: "bg-slate-900/95 border-slate-500/80 shadow-2xl",
      title: "text-cyan-400 border-slate-800",
      avatar: "💬",
    };
  };

  const theme = getSpeakerTheme();
  const hasOptions = dialogue.options && dialogue.options.length > 0;

  return (
    <div className="absolute bottom-16 left-0 right-0 w-full flex justify-center p-4 z-25 font-sans pointer-events-auto">
      <div 
        onClick={handleBoxClick}
        className={`w-full max-w-2xl ${theme.bg} border-2 p-5 rounded-lg flex flex-col md:flex-row gap-4 cursor-pointer select-none`}
      >
        <div className="flex gap-4">
          {/* Avatar Square */}
          <div className="w-14 h-14 bg-black/60 border border-gray-700 rounded-md flex items-center justify-center text-3xl shadow-inner shrink-0">
            {theme.avatar}
          </div>

          {/* Text Section */}
          <div className="flex flex-col flex-grow justify-between min-h-[80px]">
            <div>
              <div className={`text-sm font-bold tracking-wide uppercase border-b pb-1 mb-1.5 flex items-center gap-1.5 ${theme.title}`}>
                <MessageSquareText className="w-4 h-4" />
                <span>{dialogue.speaker}</span>
              </div>
              <p className="text-gray-100 text-sm leading-relaxed font-medium">
                {displayedText}
                {isTyping && <span className="w-1 h-3.5 bg-cyan-400 inline-block animate-pulse ml-0.5" />}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Branching Options list */}
        {!isTyping && hasOptions && (
          <div className="w-full flex flex-col gap-2 border-t md:border-t-0 md:border-l border-gray-800/80 pt-3 md:pt-0 md:pl-4 mt-1 md:mt-0 shrink-0 md:w-[240px]">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-1">
              PILIH DIALOG:
            </div>
            {dialogue.options!.map((opt, idx) => {
              const optionText = typeof opt === "string" ? opt : opt.text;
              return (
                <button
                  key={idx}
                  className="dialogue-option-button w-full text-left text-xs bg-slate-950/80 border border-slate-700/80 hover:border-cyan-400/80 hover:bg-cyan-950/20 text-slate-200 hover:text-cyan-300 px-3 py-2 rounded transition font-medium cursor-pointer active:scale-98"
                  onClick={() => {
                    sound.playPickup();
                    if (onSelectOption) {
                      onSelectOption(opt, idx);
                    }
                  }}
                >
                  {idx + 1}. {optionText}
                </button>
              );
            })}
          </div>
        )}

        {/* Proceed Blinker (Only show if there are NO branching dialogue nodes options) */}
        {!hasOptions && (
          <div className="text-right text-[10px] uppercase font-bold font-mono text-gray-500 tracking-wider pt-2 border-t border-gray-850/40 w-full mt-auto">
            {isTyping ? "KLIK / TEKAN [E] UNTUK LEWATI..." : "KLIK / TEKAN [E] UNTUK LANJUT ➔"}
          </div>
        )}
      </div>
    </div>
  );
};
