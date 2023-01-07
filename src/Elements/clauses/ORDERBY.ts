/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, S4, S2, S3, RN, S6 } from '../definition';

export class ORDERBY implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.orderby;
    items: Array<any>;    
    depth: number;
    
    constructor(orderby: Array<any>, depth: number)
    {
        this.items = orderby;
        this.depth = depth;
    }

    getSQL(): string
    {
        let indent = this.depth === 0 ? '  ' : new Array(this.depth * 12 + 2).fill(' ').join('');
        let sql = indent + 'ORDER BY' + S2;
        
        for (let i = 0; i < this.items.length; i++)
        {
            const item = this.items[i];
            if(item.expr)
            {
                const expr = item.expr;
                let str = '';
                switch (expr.type) {
                    case 'column_ref':
                        str = expr.table ? expr.table + '.' + expr.column : expr.column;
                        break;
                    default:
                        break;
                }
                if(item.type) str += ' ' + item.type;
                sql += str + ', ';
            }
        }

        return sql.slice(0, -2) + RN;
    }
}