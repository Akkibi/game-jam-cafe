import { Vector3 } from "three";

type BaseSceneElementType = {
  size: Vector3;
  position: Vector3;
  lifeSpan: number | null;
};

type PlateformType = BaseSceneElementType & {
  type: "p" | "pc" | "pv" | "pcg";
  isMoving?: boolean;
};

type WaterfallType = BaseSceneElementType & {
  length: number;
  type: "wc" | "wl";
};

type Block = {
  addDelay: number;
  stagger: number;
  id: number;
  location: 0 | 1 | 2 | 3;
  blockElements: (PlateformType | WaterfallType)[];
};

const BLOCK_STAGGER = 2; // s
const BLOCK_DELAY = 2000; // ms

const PLATEFORM_LIFESPAN = 10;
const PLATFORM_WIDTH = 0.8;
const PLATFORM_HEIGHT = 0.1;
const PLATFORM_DEPTH = 1.9;

export const Blocks: Block[] = [
  // ========== PHASE 1 ==========
  // Phase 1 - Bloc 1
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 0,
    location: 0,
    blockElements: [
      {
        position: new Vector3(-3, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "p",
      },
      {
        position: new Vector3(-2, 0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pv",
      },
      {
        position: new Vector3(-0.5, 0.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pc",
      },
    ],
  },
  // Phase 1 - Bloc 2
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 1,
    location: 1,
    blockElements: [
      {
        position: new Vector3(0.5, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "p",
      },
      {
        position: new Vector3(1.6, 0.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: 10,
        type: "pcg",
      },
    ],
  },
  // Phase 1 - Bloc 3
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 2,
    location: 2,
    blockElements: [
      {
        position: new Vector3(-2.5, -1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pc",
      },
      {
        position: new Vector3(-0.2, -1.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pv",
      },
      {
        position: new Vector3(-1.2, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "p",
      },
    ],
  },
  // Phase 1 - Bloc 4
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 3,
    location: 3,
    blockElements: [
      {
        position: new Vector3(0.5, -0.3, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "p",
      },
      {
        position: new Vector3(2.4, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pv",
      },
      {
        position: new Vector3(1.5, -1.3, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pc",
      },
    ],
  },

  /********************/
  /*      PHASE 2     */
  /********************/

  // Phase 2 - Bloc 1
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 4,
    location: 0,
    blockElements: [
      {
        position: new Vector3(-2.5, 1.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pcg",
      },
      {
        position: new Vector3(-1.4, 0.4, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "p",
      },
      {
        position: new Vector3(-0.5, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pv",
      },
    ],
  },
  // Phase 2 - Bloc 2
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 5,
    location: 1,
    blockElements: [
      {
        position: new Vector3(1.2, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "p",
      },
      {
        position: new Vector3(2, 0.3, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pcg",
      },
    ],
  },
  // Phase 2 - Bloc 3
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 6,
    location: 2,
    blockElements: [
      {
        position: new Vector3(-2.3, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "p",
      },
      {
        position: new Vector3(-1.4, -1.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pv",
      },
    ],
  },
  // Phase 2 - Bloc 4
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 7,
    location: 3,
    blockElements: [
      {
        position: new Vector3(0.3, -0.8, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pcg",
      },
      {
        position: new Vector3(1.5, -1.1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "p",
      },
      {
        position: new Vector3(2.8, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN,
        type: "pv",
      },
    ],
  },
];
