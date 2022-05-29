import type { StringLike } from './types.d.ts';
import type { CellAlignment } from './alignment.d.ts';
export function renderAligned(
  value: StringLike,
  alignment: CellAlignment = 'center',
  totalSize: number,
): string {
  let leftPad = '',
    rightPad = '';

  const strValue = value.toString();
  switch (alignment) {
    case 'left':
      rightPad = ' '.repeat(totalSize - strValue.length);
      break;
    case 'right':
      leftPad = ' '.repeat(totalSize - strValue.length);
      break;
    default: {
      const remaining = (totalSize - strValue.length);
      const half = Math.max(0, Math.floor((totalSize - strValue.length) / 2));
      leftPad = rightPad = ' '.repeat(half);
      if (remaining % 2 == 1) {
        rightPad = rightPad + ' ';
      }
    }
  }
  return `${leftPad}${value.toString()}${rightPad}`;
}
