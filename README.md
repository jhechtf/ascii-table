# ASCII Table

This was meant to be a fork of the ASCII table available on deno.land... but
unfortunately trying to modify that was a little more annoying than I'd hoped.

So we get a different project.

## Usage

**NOTE** To use this library you will need both the `--unstable` flag as well as
`-A` permissions. If you are trying to ensure least necessary scope, _do not_
use this project. It relies on Deno's Foreign Function Interface (FFI) to make
calls from a Rust library.

## Installation

To use this library add the following to your `deps.ts` file

```ts
export * from 'https://deno.land/x/asciii@0.1.0/mod.ts';
```

In your code you can now use it like so

```ts
// mod.ts

import { Table } from './deps.ts';

const table = new Table();
// Add header row
table
  .addRow([
    'Header 1',
    'Header 2',
    'Header 3',
  ])
  .addRow([
    'Row 1',
    'Row 2',
    'Row 3',
  ]);

console.log(table.render());
/* Outputs the following when run:
|**********|**********|**********|
| Header 1 | Header 2 | Header 3 |
|**********|**********|**********|
|  Row 1   |  Row 2   |  Row 3   |
|**********|**********|**********|
 */
```
