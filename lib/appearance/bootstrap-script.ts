import {
  ACCENT_COLOR_PRESETS,
  CUSTOM_ACCENT_COLOR_ID,
  DEFAULT_ACCENT_COLOR_ID,
  DEFAULT_APP_ICON_STYLE,
  DEFAULT_CUSTOM_ACCENT_HEX,
} from "@/config/appearance";
import { DEFAULT_GLASS_BLUR_LEVEL, getGlassBlurPx } from "@/config/glass-blur";
import {
  DEFAULT_GLASS_FILL_TRANSPARENCY,
  glassFillTransparencyToOpacity,
} from "@/config/glass-fill";
import {
  DEFAULT_WALLPAPER_ID,
  SYSTEM_WALLPAPER_DARK,
  SYSTEM_WALLPAPER_LIGHT,
  WALLPAPERS,
} from "@/config/wallpapers";
import {
  APPEARANCE_STORAGE_KEYS,
  APPEARANCE_USER_COOKIE,
} from "@/lib/appearance/constants";
import { createStandaloneAppHeightBootstrapSnippet } from "@/lib/viewport/standalone-app-height";
import { WALLPAPER_PAINT_CACHE_KEY } from "@/lib/wallpaper/paint-cache";

function buildPresetWallpaperMapJson(): string {
  const map: Record<string, { kind: string; light: string; dark: string }> = {};

  for (const wallpaper of WALLPAPERS) {
    map[wallpaper.id] = {
      kind: wallpaper.kind,
      light: wallpaper.themeVariants?.light.background ?? wallpaper.background,
      dark: wallpaper.themeVariants?.dark.background ?? wallpaper.background,
    };
  }

  return JSON.stringify(map);
}

/** Runs in root layout only — resolves user from cookie, then applies stored theme/accent/glass/wallpaper. */
export function createRootAppearanceBootstrapScript(): string {
  const presets = Object.fromEntries(
    ACCENT_COLOR_PRESETS.map((preset) => [
      preset.id,
      { hex: preset.hex, hoverHex: preset.hoverHex },
    ]),
  );
  const guestPrefix = `${APPEARANCE_STORAGE_KEYS.appearancePrefix}:guest`;
  const wallpaperPresets = buildPresetWallpaperMapJson();
  const defaultBlurPx = getGlassBlurPx(DEFAULT_GLASS_BLUR_LEVEL);
  const defaultFillOpacity = glassFillTransparencyToOpacity(
    DEFAULT_GLASS_FILL_TRANSPARENCY,
  );

  return `(function(){try{
${createStandaloneAppHeightBootstrapSnippet()}
var cookieName=${JSON.stringify(APPEARANCE_USER_COOKIE)};
var guestPrefix=${JSON.stringify(guestPrefix)};
var appearancePrefix=${JSON.stringify(APPEARANCE_STORAGE_KEYS.appearancePrefix)};
var presets=${JSON.stringify(presets)};
var defaultAccent=${JSON.stringify(DEFAULT_ACCENT_COLOR_ID)};
var customAccentId=${JSON.stringify(CUSTOM_ACCENT_COLOR_ID)};
var defaultCustomHex=${JSON.stringify(DEFAULT_CUSTOM_ACCENT_HEX)};
var defaultAppIconStyle=${JSON.stringify(DEFAULT_APP_ICON_STYLE)};
var defaultGlassBlur=${JSON.stringify(DEFAULT_GLASS_BLUR_LEVEL)};
var defaultBlurPx=${JSON.stringify(String(defaultBlurPx))};
var defaultFillOpacity=${JSON.stringify(String(defaultFillOpacity))};
var wallpaperPresets=${wallpaperPresets};
var wallpaperPaintKey=${JSON.stringify(WALLPAPER_PAINT_CACHE_KEY)};
var defaultWallpaperId=${JSON.stringify(DEFAULT_WALLPAPER_ID)};
var systemLight=${JSON.stringify(SYSTEM_WALLPAPER_LIGHT)};
var systemDark=${JSON.stringify(SYSTEM_WALLPAPER_DARK)};
var match=document.cookie.match(new RegExp("(?:^|;\\\\s*)"+cookieName+"=([^;]+)"));
var uid=match?decodeURIComponent(match[1]):"guest";
var p=uid==="guest"?guestPrefix:appearancePrefix+":"+uid;
var root=document.documentElement;
var theme=localStorage.getItem(p+":theme-mode");
var resolved=theme==="light"?"light":theme==="dark"?"dark":(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
var dark=resolved==="dark";
root.classList.remove("light","dark");
root.classList.add(resolved);
root.style.colorScheme=resolved;
var accentId=localStorage.getItem(p+":accent-color")||defaultAccent;
var customHex=localStorage.getItem(p+":custom-accent-hex")||defaultCustomHex;
var preset=accentId===customAccentId?{hex:customHex,hoverHex:customHex}:(presets[accentId]||presets[defaultAccent]);
var appIconStyle=localStorage.getItem(p+":app-icon-style")||defaultAppIconStyle;
var glassBorder=localStorage.getItem(p+":glass-border")==="on"?"on":"off";
var glassBlur=localStorage.getItem(p+":glass-blur")||defaultGlassBlur;
if(glassBlur==="on")glassBlur=defaultGlassBlur;
var blurMap={off:0,light:6,normal:12,strong:18,max:24};
var blurPx=blurMap[glassBlur];
if(typeof blurPx!=="number"){glassBlur=defaultGlassBlur;blurPx=Number(defaultBlurPx);}
var fillRaw=localStorage.getItem(p+":glass-fill-transparency");
var fillT=fillRaw?parseInt(fillRaw,10):NaN;
if(isNaN(fillT))fillT=40;
fillT=Math.min(85,Math.max(0,fillT));
var fillOpacity=0.94-(fillT/85)*(0.94-0.08);
root.dataset.appIcon=appIconStyle;
root.dataset.glassBorder=glassBorder;
root.dataset.glassBlur=glassBlur;
root.style.setProperty("--glass-backdrop-blur",blurPx+"px");
root.style.setProperty("--glass-fill-opacity",String(fillOpacity));
root.style.setProperty("--brand",preset.hex);
root.style.setProperty("--brand-hover",preset.hoverHex||preset.hex);
root.style.setProperty("--primary",preset.hex);
root.style.setProperty("--primary-foreground","#ffffff");
root.style.setProperty("--ring",preset.hex);
var wallpaperId=localStorage.getItem("scheduler:wallpaper")||defaultWallpaperId;
root.dataset.wallpaper=wallpaperId;
var kind="image";
var background=dark?systemDark:systemLight;
var maskOpacity=0;
var maskColor=dark?"black":"white";
var hasPaint=false;
try{
var paintRaw=localStorage.getItem(wallpaperPaintKey);
if(paintRaw){
var paint=JSON.parse(paintRaw);
if(paint&&paint.kind&&paint.backgroundLight&&paint.backgroundDark){
kind=paint.kind;
background=dark?paint.backgroundDark:paint.backgroundLight;
maskOpacity=typeof paint.maskOpacity==="number"?paint.maskOpacity:0;
maskColor=paint.maskColor==="white"?"white":"black";
if(paint.id)root.dataset.wallpaper=paint.id;
hasPaint=true;
}
}
}catch(e){}
if(!hasPaint){
var wp=wallpaperPresets[wallpaperId];
if(wp){kind=wp.kind;background=dark?wp.dark:wp.light;}
var maskRaw=localStorage.getItem("scheduler:wallpaper-mask");
if(maskRaw){var pm=parseInt(maskRaw,10);if(!isNaN(pm))maskOpacity=Math.min(100,Math.max(0,pm));}
var smc=localStorage.getItem("scheduler:wallpaper-mask-color");
if(smc==="white"||smc==="black")maskColor=smc;
}
var layer=document.getElementById("scheduler-wallpaper-boot-layer");
var mask=document.getElementById("scheduler-wallpaper-boot-mask");
if(!layer)return;
layer.style.backgroundSize="cover";
layer.style.backgroundPosition="center";
layer.style.backgroundRepeat="no-repeat";
var gradientSuffix=", var(--background)";
if(kind==="solid"){layer.style.backgroundColor=background;layer.style.backgroundImage="none";}
else if(kind==="image"){layer.style.backgroundColor="var(--background)";layer.style.backgroundImage=background.indexOf("url(")===0?background:'url("'+background+'")';}
else if(background==="var(--background)"){layer.style.backgroundColor=background;layer.style.backgroundImage="none";}
else if(background.length>=gradientSuffix.length&&background.slice(-gradientSuffix.length)===gradientSuffix){layer.style.backgroundColor="var(--background)";layer.style.backgroundImage=background.slice(0,-gradientSuffix.length);}
else{layer.style.backgroundColor="var(--background)";layer.style.backgroundImage=background;}
if(mask){var showMask=kind!=="solid"&&maskOpacity>0;mask.style.opacity=showMask?String(maskOpacity/100):"0";mask.style.backgroundColor=maskColor==="white"?"rgb(255 255 255)":"rgb(0 0 0)";}
}catch(e){}})();`;
}
