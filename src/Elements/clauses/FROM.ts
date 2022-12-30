/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, Element, S4, S2, S3, RN } from '../definition';
import { Statement } from '../Statement';

export class FROM implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.from;
    items: Array<string | Element>;

    constructor(from: Array<nsp.From | nsp.Dual | any>, depth: number)
    {
        this.items = new Array<string | Element>();

        for (let i = 0; i < from.length; i++)
        {
            this.items.push(this.createFROM(from[i], depth));
        }
    }

    createFROM(item: nsp.From | nsp.Dual | any, depth: number): string | Element
    {
        if (item.type === 'dual') 
            return 'DUAL';
        else if (item.table !== undefined)
        {
            if (item.as === null)
                return item.table;
            else
                return item.table + ' AS ' + item.as;
        }
        else if(item.expr !== undefined)
        {
            //subquery
            return new Statement(item as nsp.AST, depth + 1);
        }
        return '';
    }

    getSQL(): string{
        let sql = S4 + S2 + 'FROM' + S2;

        if(typeof(this.items[0]) === 'string')
            sql += (this.items[0] + RN);
        else
            sql += '(' + this.items[0].getSQL() + ')';
        
        for (let i = 1; i < this.items.length; i++) 
        {
            const item = this.items[i];
            if(typeof(item) === 'string')
                return S4 + ',' + S3 + item + RN;
            else
                return '(' + item.getSQL() + ')';
        }
        return sql;
    }
}