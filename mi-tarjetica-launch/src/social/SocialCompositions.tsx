import React from "react";
import { Composition, Folder } from "remotion";
import {
  PostBusiness,
  PostCompare,
  PostFraud,
  PostHero,
  PostManifesto,
  PostPricing,
} from "./Posts";
import {
  StoryCta,
  StoryNearby,
  StoryPaper,
  StoryPricing,
  StoryStamps,
  StoryTrio,
} from "./Stories";

const FPS = 30;

/** Historias animadas (MP4) — también se exportan como PNG en su último frame. */
export const STORIES = [
  { id: "Historia01-Papel", component: StoryPaper, sec: 7 },
  { id: "Historia02-SinApp", component: StoryTrio, sec: 6 },
  { id: "Historia03-Cerca", component: StoryNearby, sec: 7 },
  { id: "Historia04-Sellos", component: StoryStamps, sec: 7 },
  { id: "Historia05-PlanGratis", component: StoryPricing, sec: 6 },
  { id: "Historia06-CTA", component: StoryCta, sec: 6 },
] as const;

/** Publicaciones 4:5 — se exportan como PNG en su último frame (y opcionalmente MP4). */
export const POSTS = [
  { id: "Post01-Manifiesto", component: PostManifesto, sec: 4 },
  { id: "Post02-Producto", component: PostHero, sec: 4 },
  { id: "Post03-AntesAhora", component: PostCompare, sec: 4 },
  { id: "Post04-Antifraude", component: PostFraud, sec: 4 },
  { id: "Post05-Negocios", component: PostBusiness, sec: 4 },
  { id: "Post06-Precio", component: PostPricing, sec: 4 },
] as const;

export const SocialCompositions: React.FC = () => (
  <>
    <Folder name="Historias">
      {STORIES.map((st) => (
        <Composition
          key={st.id}
          id={st.id}
          component={st.component}
          durationInFrames={st.sec * FPS}
          fps={FPS}
          width={1080}
          height={1920}
        />
      ))}
    </Folder>
    <Folder name="Publicaciones">
      {POSTS.map((p) => (
        <Composition
          key={p.id}
          id={p.id}
          component={p.component}
          durationInFrames={p.sec * FPS}
          fps={FPS}
          width={1080}
          height={1350}
        />
      ))}
    </Folder>
  </>
);
