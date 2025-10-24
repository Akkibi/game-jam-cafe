import { Vector3 } from 'three';

type BaseSceneElementType = {
  size: Vector3;
  position: Vector3;
  lifeSpan: number | null;
};

type PlateformType = BaseSceneElementType & {
  type: 'p' | 'pc' | 'pv' | 'pcg';
  isMoving?: boolean;
};

type WaterfallType = BaseSceneElementType & {
  length: number;
  type: 'wc' | 'wl';
};

type Block = {
  addDelay: number;
  stagger: number;
  id: number;
  location: 0 | 1 | 2 | 3;
  blockElements: (PlateformType | WaterfallType)[];
};

const BLOCK_STAGGER = 2; // s
const BLOCK_DELAY = 5; // s

const PLATEFORM_LIFESPAN = 20;
const PLATEFORM_LIFESPAN_PHASE_1 = PLATEFORM_LIFESPAN;
const PLATEFORM_LIFESPAN_PHASE_2 = PLATEFORM_LIFESPAN * 0.8;

const PLATFORM_WIDTH = 0.8;
const PLATFORM_HEIGHT = 0.2;
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
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'p',
      },
      {
        position: new Vector3(-1.5, 0.4, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
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
        position: new Vector3(0, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
      {
        position: new Vector3(1.6, 0.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'p',
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
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
      {
        position: new Vector3(-0.8, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'p',
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
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'p',
      },
      {
        position: new Vector3(1.5, -1.3, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
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
        position: new Vector3(-3, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
      {
        position: new Vector3(-2, 0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pv',
      },
      {
        position: new Vector3(-0.5, 0.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
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
        position: new Vector3(0.5, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
      {
        position: new Vector3(1.6, 0.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: 10,
        type: 'pc',
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
        position: new Vector3(-2.5, -1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
      {
        position: new Vector3(-0.2, -1.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pv',
      },
      {
        position: new Vector3(-1.2, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
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
        position: new Vector3(2.4, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pv',
      },
      {
        position: new Vector3(1.5, -1.3, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
    ],
  },

  /********************/
  /*      PHASE 3     */
  /********************/

  // Phase 3 - Bloc 1
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 8,
    location: 0,
    blockElements: [
      {
        position: new Vector3(-3, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
      {
        position: new Vector3(-2, 0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pv',
      },
      {
        position: new Vector3(-0.5, 0.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
    ],
  },
  // Phase 3 - Bloc 2
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 9,
    location: 1,
    blockElements: [
      {
        position: new Vector3(0.5, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
      {
        position: new Vector3(1.6, 0.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: 10,
        type: 'pcg',
      },
    ],
  },
  // Phase 3 - Bloc 3
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 10,
    location: 2,
    blockElements: [
      {
        position: new Vector3(-2.5, -1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
      {
        position: new Vector3(-0.2, -1.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pv',
      },
      {
        position: new Vector3(-1.2, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
    ],
  },
  // Phase 3 - Bloc 4
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 11,
    location: 3,
    blockElements: [
      {
        position: new Vector3(2.4, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pv',
      },
      {
        position: new Vector3(1.5, -1.3, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_1,
        type: 'pc',
      },
    ],
  },

  /********************/
  /*      PHASE 4     */
  /********************/

  // Phase 4 - Bloc 1
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 12,
    location: 0,
    blockElements: [
      {
        position: new Vector3(-2.5, 1.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2,
        type: 'pcg',
      },
      {
        position: new Vector3(-0.5, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2,
        type: 'pv',
      },
    ],
  },
  // Phase 4 - Bloc 2
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 13,
    location: 1,
    blockElements: [
      {
        position: new Vector3(2, 0.3, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2,
        type: 'pcg',
      },
    ],
  },
  // Phase 4 - Bloc 3
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 14,
    location: 2,
    blockElements: [
      {
        position: new Vector3(-1.4, -1.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2,
        type: 'pv',
      },
    ],
  },
  // Phase 4 - Bloc 4
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 15,
    location: 3,
    blockElements: [
      {
        position: new Vector3(0.3, -0.8, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2,
        type: 'pcg',
      },
      {
        position: new Vector3(2.8, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2,
        type: 'pv',
      },
    ],
  },

  /********************/
  /*      PHASE 5     */
  /********************/

  // Phase 5 - Bloc 1
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 16,
    location: 0,
    blockElements: [
      {
        position: new Vector3(-2.5, 1.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2 * (Math.random() + 0.5),
        type: 'pcg',
      },
      {
        position: new Vector3(-0.5, 1, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2 * (Math.random() + 0.5),
        type: 'pv',
      },
    ],
  },
  // Phase 5 - Bloc 2
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 17,
    location: 1,
    blockElements: [
      {
        position: new Vector3(2, 0.3, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2 * (Math.random() + 0.5),
        type: 'pcg',
      },
    ],
  },
  // Phase 5 - Bloc 3
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 18,
    location: 2,
    blockElements: [
      {
        position: new Vector3(-1.4, -1.2, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2 * (Math.random() + 0.5),
        type: 'pv',
      },
    ],
  },
  // Phase 5 - Bloc 4
  {
    addDelay: BLOCK_DELAY,
    stagger: BLOCK_STAGGER,
    id: 19,
    location: 3,
    blockElements: [
      {
        position: new Vector3(0.3, -0.8, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2 * (Math.random() + 0.5),
        type: 'pcg',
      },
      {
        position: new Vector3(2.8, -0.5, 0),
        size: new Vector3(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_DEPTH),
        lifeSpan: PLATEFORM_LIFESPAN_PHASE_2 * (Math.random() + 0.5),
        type: 'pv',
      },
    ],
  },
];
