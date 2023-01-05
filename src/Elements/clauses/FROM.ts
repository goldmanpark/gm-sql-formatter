/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, S4, S2, S3, RN, S6 } from '../definition';
import { Statement } from '../Statement';

export class FROM implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.from;
    items: Array<any>;
    depth: number;

    constructor(from: Array<nsp.From | nsp.Dual | any>, depth: number)
    {
        this.items = new Array<any>();
        this.depth = depth;

        for (let i = 0; i < from.length; i++)
        {
            this.items.push(this.createFROM(from[i]));
        }
    }

    createFROM(item: nsp.From | nsp.Dual | any): any
    {
        if(item.type === 'dual' || typeof(item.table) === 'string')
            return item;
        else if(item.expr !== null && item.expr.ast !== null)
        {
            //subquery
            return {
                statement : new Statement(item.expr.ast, this.depth + 1),
                on : item.on,
                join : item.join,
                as : item.as
            };
        }
    }

    getSQL(): string
    {
        let fromIndent = new Array(this.depth * 12 + 6).fill(' ').join('');
        let joinIndent = this.depth === 0 ? '' : new Array(this.depth * 12).fill(' ').join('');
        let onIndent = fromIndent + S2;
        let sql = fromIndent + 'FROM' + S2;

        //rest columns
        for (let i = 0; i < this.items.length; i++)
        {
            const item = this.items[i];
            if(item.type === 'dual')
                sql += fromIndent + S2 + ',' + S3 + item + RN;
            else
            {
                if(item.join)
                    sql += joinIndent + (item.join === 'LEFT JOIN' ? ' LEFT JOIN' : item.join) + S2;
                else
                    sql += i === 0 ? '' : fromIndent;

                if(item.table)
                {
                    let db = item.db !== null ? item.db : '';
                    sql += db + item.table;
                }
                else if (item.statement instanceof Statement)
                {
                    if(item.join)
                    {
                        sql += '(' + S3 + item.statement.getSQL().trim() + RN;
                        sql += S6 + ')';
                    }
                    else
                    {
                        sql += S2 + ',' + S3 + '(' + S3 + item.statement.getSQL().trim() + RN;
                        sql += S6 + ')';
                    }
                }
            }

            if (item.alias)
                sql += ' AS ' + item.as;
            sql += RN;

            if(item.on)
                sql += fromIndent + 'ON' + S2 + item.on.left + ' ' + item.on.operator + ' ' + item.on.right + RN;
        }
        return sql;
    }
}