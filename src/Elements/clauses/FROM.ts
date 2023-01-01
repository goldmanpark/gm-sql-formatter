/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, S4, S2, S3, RN } from '../definition';
import { Statement } from '../Statement';

export class FROM implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.from;
    items: Array<string | Statement>;
    depth: number;

    constructor(from: Array<nsp.From | nsp.Dual | any>, depth: number)
    {
        this.items = new Array<string | Statement>();
        this.depth = depth;

        for (let i = 0; i < from.length; i++)
        {
            this.items.push(this.createFROM(from[i]));
        }
    }

    createFROM(item: nsp.From | nsp.Dual | any): string | Statement
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
        else if(item.expr.ast !== null)
        {
            //subquery
            return new Statement(item.expr.ast, this.depth + 1);
        }
        return '';
    }

    getSQL(): string{
        let indent = new Array(this.depth).fill(S4 + S4).join('') + (this.depth > 0 ? S4 : '');
        let sql = indent + S4 + S2 + 'FROM' + S2;

        //for first table item
        if(typeof(this.items[0]) === 'string')
            sql += (this.items[0] + RN);
        else
        {
            //Subquery(Statement)
            sql += '(' + this.items[0].getSQL() + indent + S4 + S4 + S4 + ')';
            if (this.items[0].alias !== null) 
                sql += ' AS ' + this.items[0].alias;
        }
            
        
        //rest columns
        for (let i = 1; i < this.items.length; i++) 
        {
            const item = this.items[i];
            if (typeof(item) === 'string')
                sql += indent + S4 + ',' + S3 + item + RN;
            else
            {
                sql += indent + S4 + ',' + S3 + '(' + S3 + item.getSQL().trim() + RN;
                sql += indent + S4 + S4 + S4 + ')';
                if (item.alias !== null) 
                    sql += ' AS ' + item.alias;
                sql += RN;
            }
        }
        return sql;
    }
}