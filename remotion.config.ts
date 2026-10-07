// Configuración de render por defecto (los flags de la CLI la sobrescriben).
// https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setCrf(15);
Config.setPixelFormat("yuv420p");
Config.setAudioCodec("aac");
Config.setAudioBitrate("320k");
// Renders 4K: más memoria para el caché de frames de video.
Config.setOffthreadVideoCacheSizeInBytes(2 * 1024 * 1024 * 1024);
