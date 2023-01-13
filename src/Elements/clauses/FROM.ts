/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, S4, S2, S3, RN, S6 } from '../definition';
import { Statement } from '../Statement';
import { Predicate } from '../Predicate';

export class FROM implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.from;
    items: Array<string | Statement | 'ON' | 'AND' | 'OR' | ',' | Predicate>;
    depth: number;

    constructor(from: Array<nsp.From | nsp.Dual | any>, depth: number)
    {
        this.items = new Array<string | Statement | 'ON' | 'AND' | 'OR' | Predicate>();
        this.depth = depth;

        for (let i = 0; i < from.length; i++)
        {
            const item = from[i];
            //connection between table/subquery
            if(item.join)
                this.items.push(item.join);
            else if(i > 0)
                this.items.push(',');

            if(item.type === 'dual')
                this.items.push('DUAL');
            else if(item.table)
            {
                let t = item.db ? item.db + '.' + item.table : item.table;
                if(item.as) t += ' AS ' + item.as;
                this.items.push(t);
            }
            else if(item.expr && item.expr.ast)
            {
                let x = new Statement(item.expr.ast, this.depth + 1);
                x.alias = item.as;
                this.items.push(x);
            }

            //join + on
            if(item.on)
            {
                this.items.push('ON');
                this.createPredicate(item.on);
            }
        }
    }

    createPredicate(expr: any)
    {
        if(expr.operator === 'AND' || expr.operator === 'OR')
        {
            this.createPredicate(expr.left);
            this.items.push(expr.operator);
            this.createPredicate(expr.right);
        }
        else
        {
            let p: Predicate = new Predicate(expr, this.depth);
            this.items.push(p);
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
            if(typeof(item) === 'string')
            {
                switch (item)
                {
                    case 'ON':
                    case 'OR':
                        sql += onIndent + 'ON' + S2;
                        break;
                    case 'AND':
                        sql += fromIndent + ' ' + 'AND' + S2;
                        break;
                    case ',':
                        sql += fromIndent + S2 + ',' + S3;
                        break;
                    default:
                        if(item.includes(' JOIN'))
                            sql += joinIndent + (item.includes('LEFT') ? ' ' : '') + item + S2;
                        else
                            sql += item + RN;
                        break;
                }
            }
            else
            {
                if(item instanceof Statement)
                {
                    sql += '(' + S3 + item.getSQL().trim() + RN;
                    sql += fromIndent + S6 + ')';
                    if(item.alias) sql += ' AS ' + item.alias;
                }
                else if(item instanceof Predicate)
                    sql += item.getSQL();
                sql += RN;
            }
        }
        return sql;
    }
}