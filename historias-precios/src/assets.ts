import { getStaticFiles, staticFile } from "remotion";

/**
 * Logo opcional en /public:
 *   public/logo.svg         logo de Mi Tarjetica (fondos claros)
 *   public/logo-light.svg   logo claro #F6F4EB (fondos verdes)
 * Si no existen, se usa un wordmark provisional "MiTarjetica" en Inter 800.
 */
const has = (name: string) => getStaticFiles().some((f) => f.name === name);

export const assets = {
  logo: () => (has("logo.svg") ? staticFile("logo.svg") : null),
  logoLight: () => (has("logo-light.svg") ? staticFile("logo-light.svg") : null),
};
