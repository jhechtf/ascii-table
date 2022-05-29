import { renderAligned } from './util.ts';
import { assert } from '../deps.ts';
import type { CellAlignment } from './alignment.d.ts';
Deno.test('RenderAligned', () => {
  const alignments: CellAlignment[] = [
    'left',
    'center',
    'right',
  ];

  const baseString = 'Testing Something';

  alignments.forEach((alignment) => {
    const returned = renderAligned(baseString, alignment, 50);
    switch (alignment) {
      case 'left': {
        assert.assertEquals(
          returned.startsWith(baseString),
          true,
        );
        assert.assertEquals(
          returned.length,
          50,
        );
        break;
      }
      case 'right':
        assert.assertEquals(
          returned.endsWith(baseString),
          true,
        );
        assert.assertEquals(
          returned.length,
          50,
        );
        break;
      default:
        assert.assertEquals(
          returned.startsWith(' '),
          true,
        );
        assert.assertEquals(
          returned.endsWith(' '),
          true,
        );
        assert.assertNotEquals(
          returned.indexOf(baseString),
          -1,
        );
        assert.assertEquals(
          returned.indexOf(baseString) > 0,
          true,
        );
        assert.assertEquals(
          returned.length,
          50,
        );
    }
  });

  const tooLong = 'this value is much longer than the cell width';
  const valueTooLong = renderAligned(tooLong, 'center', 10);

  assert.assertEquals(
    tooLong.length,
    valueTooLong.length,
  );
});
