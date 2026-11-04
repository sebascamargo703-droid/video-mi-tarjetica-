import React from "react";
import { Still } from "remotion";
import { C1, C2, Post, Stories } from "./Slides";
import "./fonts";

const pad = (n: number) => String(n + 1).padStart(2, "0");

export const RemotionRoot: React.FC = () => (
  <>
    {C1.map((S, i) => (
      <Still key={`a${i}`} id={`carrusel1-${pad(i)}`} component={S} width={1080} height={1350} />
    ))}
    {C2.map((S, i) => (
      <Still key={`b${i}`} id={`carrusel2-${pad(i)}`} component={S} width={1080} height={1350} />
    ))}
    <Still id="post-frase" component={Post} width={1080} height={1350} />
    {Stories.map((S, i) => (
      <Still key={`s${i}`} id={`historia-${pad(i)}`} component={S} width={1080} height={1920} />
    ))}
  </>
);
