import React from "react";

/**
 * Texto con emoji: los emoji de color traen píxeles #FFFFFF; se oscurecen un 4 % para que el
 * color más claro del render siga siendo #F6F4EB.
 */
export const WithEmoji: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/(\p{Extended_Pictographic}️?)/u).map((part, i) =>
      /\p{Extended_Pictographic}/u.test(part) ? (
        <span key={i} style={{ filter: "brightness(0.955)" }}>
          {part}
        </span>
      ) : (
        part
      ),
    )}
  </>
);
