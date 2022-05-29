import { terminal } from '../deps.ts';
// import { renderAligned } from "./util.ts";
import { Row } from './row.class.ts';
interface TableOptions {
  fullWidth: boolean;
}

export class Table {
  // Private stuff
  #columnLengths: number[] = [];
  #expandableColumns: Set<number> = new Set();
  #rowMaxLength = 0;

  // Public stuff.
  rows: string[][] = [];
  #rows: Row[] = [];

  tableOptions: TableOptions = {
    fullWidth: false,
  };

  terminalSize: terminal.TerminalSize = {
    cols: 0,
    rows: 0,
  };

  constructor(tableOptions?: Partial<TableOptions>) {
    this.tableOptions = Object.assign(this.tableOptions, tableOptions);
    if (this.tableOptions.fullWidth) {
      this.terminalSize = terminal.getSize();
    }
  }

  setExpandableColumns(colIndex: number) {
    this.#expandableColumns.add(colIndex);
    return this;
  }

  addRow(row: string[]) {
    const r = new Row(row);
    this.#columnLengths = r.columnWidths.map((v, i) =>
      Math.max(v, this.#columnLengths[i] || 0)
    );
    this.#rows.push(r);
    this.#rowMaxLength = Math.max(r.renderedRowLength, this.#rowMaxLength);
    this.#rows.forEach((row) => row.columnWidths = this.#columnLengths);
    return this;
  }

  #renderBorderRow(): string {
    let start = '|';
    for (const length of this.#columnLengths) {
      start += '*'.repeat(length + 2) + '|';
    }
    return start;
  }

  render(): string {
    const updatedSizes = this.#columnLengths;

    if (this.tableOptions.fullWidth) {
      let totalSize = this.terminalSize.cols;
      totalSize -= 4;
      totalSize -= this.#rows[0].columnWidths.length * 2;
      totalSize -= this.#columnLengths.reduce(
        (cum, cur, colIndex) =>
          cum + (this.#expandableColumns.has(colIndex) ? 0 : cur),
        0,
      );

      for (const col of this.#expandableColumns.values()) {
        updatedSizes[col] = Math.floor(
          totalSize / this.#expandableColumns.size,
        );
      }
    }

    return [
      '',
      ...this.#rows.map((row) => {
        row.columnWidths = updatedSizes;
        return row.render();
      }),
      '',
    ].join('\n' + this.#renderBorderRow() + '\n').trim();
  }
}
