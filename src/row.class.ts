import { renderAligned } from './util.ts';
import { CellAlignment } from './alignment.d.ts';

export class Row {
  #rowParts: string[][] = [];
  #alignments: CellAlignment[];
  #columnWidths: number[] = [];
  #row: string[] = [];
  constructor(
    row: string[],
    columnWidths: number[] = [],
    alignments: CellAlignment[] = [],
  ) {
    this.#row = row;

    this.#updateRowParts();

    this.#columnWidths = columnWidths.length === row.length
      ? columnWidths
      : row.map((col) =>
        Math.max(...col.split('\n').map((line) => line.length))
      );

    this.#alignments = alignments.length === row.length
      ? alignments
      : Array.from({ length: row.length }, () => 'center');
  }

  #updateRowParts() {
    this.#rowParts = this.#row.reduce((cum, cur, colIndex, arr) => {
      const lines = cur.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (!cum[i]) {
          cum[i] = Array.from({ length: arr.length }, () => '');
        }
        cum[i][colIndex] = lines[i];
      }
      return cum;
    }, [] as string[][]);
  }

  get columnWidths() {
    return this.#columnWidths;
  }

  set columnWidths(widths: number[]) {
    if (widths.length !== this.#row.length) return;
    this.#columnWidths = widths;
  }

  get renderedRowLength(): number {
    return 4 + this.#row.length * 2 +
      this.#columnWidths.reduce((cum, cur) => cum + cur, 0);
  }

  get row() {
    return this.#row;
  }

  set row(newValue: string[]) {
    this.#row = newValue;
    this.#updateRowParts();
  }

  toJSON() {
    return this.#row;
  }

  render() {
    let output = '';
    for (const rowPartial of this.#rowParts) {
      output += `| ${
        rowPartial.map((col, i) =>
          renderAligned(col, this.#alignments[i], this.#columnWidths[i])
        ).join(' | ')
      } |\n`;
    }
    return output.trim();
  }
}
