import fs from "fs";

function spinLayer(id, color, size, cx, cy) {
  return {
    ddd: 0,
    ind: id,
    ty: 4,
    nm: `layer${id}`,
    sr: 1,
    ks: {
      o: { a: 0, k: 100, ix: 11 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [0], i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] } },
          { t: 45, s: [360] },
        ],
        ix: 10,
      },
      p: { a: 0, k: [cx, cy, 0], ix: 2 },
      a: { a: 0, k: [0, 0, 0], ix: 1 },
      s: { a: 0, k: [100, 100, 100], ix: 6 },
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          {
            ty: "el",
            d: 1,
            s: { a: 0, k: [size, size], ix: 2 },
            p: { a: 0, k: [0, 0], ix: 3 },
            nm: "E",
            mn: "ADBE Vector Shape - Ellipse",
            hd: false,
          },
          {
            ty: "st",
            c: { a: 0, k: color, ix: 3 },
            o: { a: 0, k: 100, ix: 4 },
            w: { a: 0, k: 4, ix: 5 },
            lc: 2,
            lj: 1,
            ml: 4,
            bm: 0,
            nm: "S",
            mn: "ADBE Vector Graphic - Stroke",
            hd: false,
          },
          {
            ty: "tr",
            p: { a: 0, k: [0, 0], ix: 2 },
            a: { a: 0, k: [0, 0], ix: 1 },
            s: { a: 0, k: [100, 100], ix: 3 },
            r: { a: 0, k: 0, ix: 6 },
            o: { a: 0, k: 100, ix: 7 },
            sk: { a: 0, k: 0, ix: 4 },
            sa: { a: 0, k: 0, ix: 5 },
            nm: "T",
          },
        ],
        nm: "G",
        np: 3,
        cix: 2,
        bm: 0,
        ix: 1,
        mn: "ADBE Vector Group",
        hd: false,
      },
    ],
    ip: 0,
    op: 45,
    st: 0,
    bm: 0,
  };
}

function popStar(id, color, x, y, delay) {
  return {
    ddd: 0,
    ind: id,
    ty: 4,
    nm: `star${id}`,
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          { t: delay, s: [0], i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] } },
          { t: delay + 8, s: [100], i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] } },
          { t: delay + 40, s: [0] },
        ],
        ix: 11,
      },
      r: { a: 0, k: 0, ix: 10 },
      p: { a: 0, k: [x, y, 0], ix: 2 },
      a: { a: 0, k: [0, 0, 0], ix: 1 },
      s: {
        a: 1,
        k: [
          { t: delay, s: [0, 0, 100], i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] } },
          { t: delay + 12, s: [120, 120, 100] },
        ],
        ix: 6,
      },
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          {
            ty: "sr",
            sy: 1,
            d: 1,
            pt: { a: 0, k: 4, ix: 3 },
            p: { a: 0, k: [0, 0], ix: 4 },
            r: { a: 0, k: 0, ix: 5 },
            ir: { a: 0, k: 2, ix: 6 },
            is: { a: 0, k: 0, ix: 8 },
            or: { a: 0, k: 6, ix: 7 },
            os: { a: 0, k: 0, ix: 9 },
            ix: 1,
            nm: "P",
            mn: "ADBE Vector Shape - Star",
            hd: false,
          },
          {
            ty: "fl",
            c: { a: 0, k: color, ix: 4 },
            o: { a: 0, k: 100, ix: 5 },
            r: 1,
            bm: 0,
            nm: "F",
            mn: "ADBE Vector Graphic - Fill",
            hd: false,
          },
          {
            ty: "tr",
            p: { a: 0, k: [0, 0], ix: 2 },
            a: { a: 0, k: [0, 0], ix: 1 },
            s: { a: 0, k: [100, 100], ix: 3 },
            r: { a: 0, k: 0, ix: 6 },
            o: { a: 0, k: 100, ix: 7 },
            sk: { a: 0, k: 0, ix: 4 },
            sa: { a: 0, k: 0, ix: 5 },
            nm: "T",
          },
        ],
        nm: "G",
        np: 3,
        cix: 2,
        bm: 0,
        ix: 1,
        mn: "ADBE Vector Group",
        hd: false,
      },
    ],
    ip: 0,
    op: 50,
    st: 0,
    bm: 0,
  };
}

const gold = [0.831, 0.686, 0.216, 1];
const cyan = [0.024, 0.714, 0.831, 1];
const purple = [0.545, 0.361, 0.965, 1];
const green = [0.133, 0.773, 0.369, 1];

const files = {
  "accent-chip.json": {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 45,
    w: 80,
    h: 80,
    nm: "Chip",
    ddd: 0,
    assets: [],
    layers: [
      spinLayer(1, gold, 56, 40, 40),
      {
        ...spinLayer(2, [0.2, 0.15, 0.05, 1], 40, 40, 40),
        ks: {
          ...spinLayer(2, gold, 40, 40, 40).ks,
          r: {
            a: 1,
            k: [
              { t: 0, s: [0], i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] } },
              { t: 45, s: [-360] },
            ],
            ix: 10,
          },
        },
      },
    ],
  },
  "accent-sparkle.json": {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 50,
    w: 80,
    h: 80,
    nm: "Sparkle",
    ddd: 0,
    assets: [],
    layers: [
      popStar(1, gold, 40, 40, 0),
      popStar(2, cyan, 22, 18, 4),
      popStar(3, purple, 58, 22, 8),
      popStar(4, gold, 62, 58, 6),
    ],
  },
  "accent-trophy.json": {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 50,
    w: 80,
    h: 80,
    nm: "Trophy",
    ddd: 0,
    assets: [],
    layers: [
      popStar(1, gold, 40, 28, 0),
      popStar(2, gold, 40, 28, 3),
      {
        ddd: 0,
        ind: 3,
        ty: 4,
        nm: "cup",
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: {
            a: 1,
            k: [
              { t: 0, s: [40, 52, 0], i: { x: 0.2, y: 1 }, o: { x: 0.8, y: 0 } },
              { t: 18, s: [40, 44, 0] },
            ],
            ix: 2,
          },
          a: { a: 0, k: [0, 0, 0], ix: 1 },
          s: {
            a: 1,
            k: [
              { t: 0, s: [70, 70, 100], i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] } },
              { t: 18, s: [100, 100, 100] },
            ],
            ix: 6,
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "rc",
                d: 1,
                s: { a: 0, k: [24, 20], ix: 2 },
                p: { a: 0, k: [0, 0], ix: 3 },
                r: { a: 0, k: 4, ix: 4 },
                nm: "R",
                mn: "ADBE Vector Shape - Rect",
                hd: false,
              },
              {
                ty: "fl",
                c: { a: 0, k: gold, ix: 4 },
                o: { a: 0, k: 100, ix: 5 },
                r: 1,
                bm: 0,
                nm: "F",
                mn: "ADBE Vector Graphic - Fill",
                hd: false,
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [100, 100], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: "T",
              },
            ],
            nm: "G",
            np: 3,
            cix: 2,
            bm: 0,
            ix: 1,
            mn: "ADBE Vector Group",
            hd: false,
          },
        ],
        ip: 0,
        op: 50,
        st: 0,
        bm: 0,
      },
    ],
  },
  "accent-star-burst.json": {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 45,
    w: 80,
    h: 80,
    nm: "StarBurst",
    ddd: 0,
    assets: [],
    layers: [
      popStar(1, green, 40, 40, 0),
      popStar(2, gold, 40, 40, 2),
      popStar(3, cyan, 18, 40, 5),
      popStar(4, cyan, 62, 40, 5),
      popStar(5, purple, 40, 16, 7),
      popStar(6, purple, 40, 64, 7),
    ],
  },
};

fs.mkdirSync("public/lottie", { recursive: true });
for (const [name, data] of Object.entries(files)) {
  const json = JSON.stringify(data);
  fs.writeFileSync(`public/lottie/${name}`, json);
  console.log(name, json.length, "bytes");
}
