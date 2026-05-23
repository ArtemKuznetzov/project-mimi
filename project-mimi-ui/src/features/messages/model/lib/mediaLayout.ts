export const BUBBLE_MEDIA_MAX_WIDTH = 280;
export const BUBBLE_MEDIA_MAX_HEIGHT = 380;

const MIN_SINGLE_WIDTH = 96;
const MIN_SINGLE_HEIGHT = 96;

export type ImageSize = { width: number; height: number };

export function fitSingleMediaSize(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth = BUBBLE_MEDIA_MAX_WIDTH,
): ImageSize {
  if (naturalWidth <= 0 || naturalHeight <= 0) {
    return { width: maxWidth, height: Math.round(maxWidth * 0.75) };
  }

  const ratio = naturalWidth / naturalHeight;
  let width = naturalWidth;
  let height = naturalHeight;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / ratio;
  }

  if (height > BUBBLE_MEDIA_MAX_HEIGHT) {
    height = BUBBLE_MEDIA_MAX_HEIGHT;
    width = height * ratio;
  }

  if (width < MIN_SINGLE_WIDTH && height < MIN_SINGLE_HEIGHT) {
    const scale = Math.max(MIN_SINGLE_WIDTH / width, MIN_SINGLE_HEIGHT / height);
    width *= scale;
    height *= scale;
  }

  if (width > maxWidth) {
    width = maxWidth;
    height = width / ratio;
  }
  if (height > BUBBLE_MEDIA_MAX_HEIGHT) {
    height = BUBBLE_MEDIA_MAX_HEIGHT;
    width = height * ratio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

export function isPortrait(size: { width: number; height: number }): boolean {
  return size.height > size.width;
}

export type AlbumLayout = {
  rowCount: number;
  rowCols: number[];
  cells: { row: number; colSpan: number; rowSpan: number }[];
};

/**
 * Telegram like grid
 *
 * - 1 img: single
 * - 2 narrow (portrait): 1 row
 * - 2 wide: 2 row
 * - 3 narrow: 1 row
 * - 3 wide: 2 top + 1 bottom full width
 * - 4: 2x2
 * - 5: 3 top + 2 bottom
 * - 6+: 3 columns
 */
export function computeAlbumLayout(sizes: { width: number; height: number }[]): AlbumLayout {
  const count = sizes.length;

  if (count === 0) {
    return { rowCount: 0, rowCols: [], cells: [] };
  }

  if (count === 1) {
    return { rowCount: 1, rowCols: [1], cells: [{ row: 0, colSpan: 1, rowSpan: 1 }] };
  }

  const orientations = sizes.map((s) => isPortrait(s));

  const makeCell = (row: number, colSpan: number, rowSpan: number = 1) => ({ row, colSpan, rowSpan });
  if (count === 2) {
    const allWide = orientations.every((o) => !o);
    if (allWide) {
      // 2 wide  - 2 rows
      return {
        rowCount: 2,
        rowCols: [1, 1],
        cells: [makeCell(0, 1, 1), makeCell(1, 1, 1)],
      };
    }
    // 2 portrait (or mixed)
    return {
      rowCount: 1,
      rowCols: [2],
      cells: [makeCell(0, 1, 1), makeCell(0, 1, 1)],
    };
  }

  // 3 img
  if (count === 3) {
    const wideCount = orientations.filter((o) => !o).length;

    if (wideCount >= 2) {
      // 2-3 wide — 2 top, 1 bottom full width
      return {
        rowCount: 2,
        rowCols: [2, 2],
        cells: [
          makeCell(0, 1, 1),
          makeCell(0, 1, 1),
          makeCell(1, 2, 2)
        ],
      };
    }
    // 3 portrait or 1 wide — 1 row
    return {
      rowCount: 1,
      rowCols: [3],
      cells: [makeCell(0, 1, 1), makeCell(0, 1, 1), makeCell(0, 1, 1)],
    };
  }

  // 4 img — 2x2
  if (count === 4) {
    return {
      rowCount: 2,
      rowCols: [2, 2],
      cells: [
        makeCell(0, 1, 1),
        makeCell(0, 1, 1),
        makeCell(1, 1, 1),
        makeCell(1, 1, 1),
      ],
    };
  }

  // 5 img — 3 top + 2 bottom
  if (count === 5) {
    return {
      rowCount: 2,
      rowCols: [3, 2],
      cells: [
        makeCell(0, 1, 1),
        makeCell(0, 1, 1),
        makeCell(0, 1, 1),
        makeCell(1, 1, 1),
        makeCell(1, 1, 1),
      ],
    };
  }

  // 6+ img (always 3 rows)
  const maxCols = 3;
  const rowCount = Math.ceil(count / maxCols);
  const rowCols: number[] = [];
  for (let r = 0; r < rowCount; r++) {
    rowCols.push(Math.min(maxCols, count - r * maxCols));
  }

  const cells: { row: number; colSpan: number; rowSpan: number }[] = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / maxCols);
    const col = i % maxCols;
    cells.push(makeCell(row, col, 1));
  }

  return { rowCount, rowCols, cells };
}

export function getAlbumCols(count: number): number {
  if (count <= 1) return 1;
  if (count === 2) return 2;
  return 3;
}

export function getAlbumContainerWidth(textAndAttachments: boolean, embeddedInBubble: boolean): string {
  if (embeddedInBubble) return '100%';
  return textAndAttachments ? 'min(280px, 85vw)' : 'min(320px, 92vw)';
}

export const ALBUM_TILE_MIN_HEIGHT = 120;
export const ALBUM_TILE_MAX_HEIGHT = 220;

const ALBUM_GRID_GAP_PX = 2;

export function computeAlbumRowHeight(sizes: { width: number; height: number }[], cols: number): number {
  if (sizes.length === 0) return ALBUM_TILE_MIN_HEIGHT;

  const cellWidth = (BUBBLE_MEDIA_MAX_WIDTH - ALBUM_GRID_GAP_PX * (cols - 1)) / cols;
  const heights = sizes.map(({ width, height }) => Math.round((cellWidth * height) / width));
  const contentHeight = Math.max(...heights);

  return Math.max(ALBUM_TILE_MIN_HEIGHT, Math.min(ALBUM_TILE_MAX_HEIGHT, contentHeight));
}