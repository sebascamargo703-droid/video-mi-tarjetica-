import { getStaticFiles, staticFile } from "remotion";

/**
 * Archivos opcionales en /public. Si existen se usan; si no, hay alternativa hecha con código.
 *   public/logo.svg            logo de Mi Tarjetica (fondos claros)
 *   public/logo-light.svg      logo claro #F6F4EB (fondos verdes)
 */
const has = (name: string) => getStaticFiles().some((f) => f.name === name);

export const assets = {
  logo: () => (has("logo.svg") ? staticFile("logo.svg") : null),
  logoLight: () => (has("logo-light.svg") ? staticFile("logo-light.svg") : null),
};
