import { Table } from './table.class.ts';
import { assert } from '../deps.ts';
import { terminal } from '../deps.ts';

Deno.test('Basic', () => {
  const table = new Table();
  table.addRow(['one', 'two', 'three']);
  const rendered = table.render();
  const lines = rendered.split('\n');
  assert.assertEquals(
    rendered.split('\n').length,
    3,
  );
  // first and last line should be spacer lines
  assert.assertMatch(lines[0], /^[*|]+$/);
  assert.assertMatch(lines[2], /^[*|]+$/);

  // Check that each value is present in the array.
  assert.assertStringIncludes(lines[1], ' one ');
  assert.assertStringIncludes(lines[1], ' two ');
  assert.assertStringIncludes(lines[1], ' three ');

  // Check that every single is the same length
  assert.assert(
    lines.every((line, i, arr) =>
      line.length === (arr[(i + 1) % arr.length].length)
    ),
    'One line does is not equal',
  );
});

Deno.test('Test with multiple lines', () => {
  const table = new Table();
  table
    .addRow(['two\nlines', 'one line', 'another line']);
  const rendered = table.render();
  const lines = rendered.split('\n');

  assert.assertEquals(
    lines.length,
    4,
    'Incorrect lines length',
  );

  assert.assertStringIncludes(
    lines[1],
    'two',
  );
  assert.assertStringIncludes(
    lines[1],
    'one line',
  );
  assert.assertStringIncludes(
    lines[1],
    'another line',
  );

  // verify that it handles multiple cells with varying lengths and rows
  const table2 = new Table();
  table2.addRow(['one line', 'three\nlines\nhere', 'two\nlines'])
    .addRow(['all', 'one', 'line']);
  const rendered2 = table2.render();
  const lines2 = rendered2.split('\n');
  assert.assertEquals(lines2.length, 7, 'Incorrect line count');

  // Make sure we have the correct amount of spacer rows.
  const spacerText = lines2[0];
  const spacerCount = lines2.reduce(
    (cum, cur) => cur === spacerText ? cum + 1 : cum,
    0,
  );
  assert.assertEquals(spacerCount, 3);
});

Deno.test('FullWidth', {
  ignore: Deno.env.get('NO_TTY') == 'true',
}, () => {
  const table = new Table({
    fullWidth: true,
  });

  table.setExpandableColumns(1);

  table.addRow(['one', 'two', 'three'])
    .addRow(['four', 'five', 'six']);

  // Grab the rendered output
  const rendered = table.render();
  const lines = rendered.split('\n');
  assert.assertEquals(
    lines[0].length,
    terminal.getWidth(),
  );
});
