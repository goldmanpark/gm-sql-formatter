/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, S4, S2, S3, RN, S6 } from '../definition';

export class GROUPBY implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.groupby;
    items: Array<nsp.ColumnRef>;
    depth: number;

    constructor(groupby: Array<nsp.ColumnRef>, depth: number)
    {
        this.items = groupby;
        this.depth = depth;
    }

    getSQL(): string
    {
        let indent = this.depth === 0 ? '  ' : new Array(this.depth * 12 + 2).fill(' ').join('');
        let sql = indent + 'GROUP BY' + S2;

        for (let i = 0; i < this.items.length; i++)
        {
            const item = this.items[i];
            switch (item.type) {
                case 'column_ref':
                    sql += item.table + '.' + item.column + ', ';
                    break;
                default:
                    break;
            }
        }

        return sql.slice(0, -2) + RN;
    }
}