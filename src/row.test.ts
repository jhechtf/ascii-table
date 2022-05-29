import { Row } from './row.class.ts';

import { assert } from '../deps.ts';

Deno.test('Basic Row', () => {
  const row = new Row(
    [
      'one',
      'two',
      'three',
    ],
  );

  assert.assertArrayIncludes(
    row.row,
    ['one', 'two', 'three'],
  );

  let rendered = row.render();

  assert.assertEquals(
    rendered,
    '| one | two | three |',
  );

  // Update the values
  row.row = ['two', 'three', 'four'];

  rendered = row.render();

  assert.assertArrayIncludes(
    row.row,
    ['two', 'three', 'four'],
  );

  assert.assertEquals(
    rendered,
    '| two | three | four  |',
  );

  const json = JSON.stringify(row);
  assert.assertEquals(
    json,
    '["two","three","four"]',
  );
});

Deno.test('Row with multiple lines', () => {
  const row = new Row(
    [
      'one',
      'two',
      'three\nand a half',
    ],
  );

  const rendered = row.render();
  const splitLines = rendered.split('\n');

  assert.assertEquals(
    splitLines.length,
    2,
  );

  assert.assert(
    splitLines.every((line) => line.startsWith('| ') && line.endsWith(' |')),
    'Malformation of row setup',
  );

  assert.assert(
    splitLines[0].length == splitLines[1].length,
    'sub rows are different lengths',
  );

  const cells = splitLines.map((line) => line.split(' | '));

  for (let col = 0; col < cells[0].length; col++) {
    assert.assertEquals(cells[0][col].length, cells[1][col].length);
  }
});

Deno.test('Row with multiple cells that have multiple lines', () => {
  const row = new Row(
    [
      'one\ntwo',
      'three',
      'four\nfive\nsix',
    ],
  );
  const rendered = row.render();
  const lines = rendered.split('\n');
  assert.assertEquals(lines.length, 3);
  const cols = lines.map((line) => line.split(' | '));
  for (let rowIndex = 0; rowIndex < cols.length; rowIndex++) {
    for (let colIndex = 0; colIndex < cols[rowIndex].length; colIndex++) {
      assert.assertEquals(
        cols[(rowIndex + 1) % cols.length][colIndex].length,
        cols[rowIndex][colIndex].length,
        `Column length mismatch between rows ${
          (rowIndex + 1) % cols.length
        } and ${rowIndex} on column ${colIndex}`,
      );
    }
  }
});

Deno.test('Row with different sizes and alignments', () => {
  const row = new Row(
    [
      'one',
      'two',
      'potato\ntomatillo',
    ],
    [
      10,
      5,
      30,
    ],
    [
      'left',
      'center',
      'right',
    ],
  );
  const rendered = row.render();

  // Check to make sure the lines count is correct.
  const lines = rendered.split('\n');
  assert.assertEquals(lines.length, 2);

  // check the things for the first line

  let line = lines[0].split(' | ');

  assert.assertEquals(
    line[0],
    '| one       ',
  );
  assert.assertEquals(
    line[1],
    ' two ',
  );

  assert.assertEquals(
    line[2],
    ' '.repeat(24) + 'potato |',
  );

  line = lines[1].split(' | ');

  assert.assertEquals(
    line[0],
    `| ${' '.repeat(10)}`,
  );

  assert.assertEquals(
    line[1],
    ' '.repeat(5),
  );

  assert.assertEquals(
    line[2],
    ' '.repeat(21) + 'tomatillo |',
  );
});
