const srcset = (name, widths, extension) =>
  widths.map((width) => `/images/${name}-${width}.${extension} ${width}w`).join(", ");

const responsiveImage = (name, widths, { srcWidth, width, height }) => ({
  src: `/images/${name}-${srcWidth}.webp`,
  width,
  height,
  webpSrcset: srcset(name, widths, "webp"),
  avifSrcset: srcset(name, widths, "avif"),
});

export const heroImages = {
  chapel: responsiveImage("chapel", [640, 960, 1280, 1920], {
    srcWidth: 1280,
    width: 1920,
    height: 1280,
  }),
  celebrations: responsiveImage("celebrations", [640, 960, 1280, 1600], {
    srcWidth: 1280,
    width: 1600,
    height: 2400,
  }),
  connect: responsiveImage("connect", [640, 960, 1280, 1600], {
    srcWidth: 1280,
    width: 1600,
    height: 1067,
  }),
  about: responsiveImage("about", [640, 960, 1280, 1600], {
    srcWidth: 1280,
    width: 1600,
    height: 1281,
  }),
  pastor: responsiveImage("pastor", [640, 960, 1200], {
    srcWidth: 960,
    width: 1200,
    height: 1741,
  }),
  avatar: responsiveImage("avatar", [320, 640], {
    srcWidth: 320,
    width: 320,
    height: 320,
  }),
};
