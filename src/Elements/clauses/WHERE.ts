/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, Predicate, RN, S2, S3, S4 } from '../definition';
import { Statement } from '../Statement';

export class WHERE implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.select;
    items: Array<string | Predicate | Statement>;
    depth: number;

    constructor(ast: any, depth: number)
    {
        this.items = new Array<string | Predicate | Statement>();
        this.depth = depth;
        this.createPredicate(ast);
    }

    createPredicate(item: any)
    {
        try 
        {
            if(item.type === 'binary_expr')
            {
                if(item.operator === 'AND' || item.operator === 'OR')
                {
                    this.createPredicate(item.left);
                    this.items.push(item.operator);
                    this.createPredicate(item.right);
                }
                else
                {
                    let p: Predicate = {
                        lhs : this.getChildValue(item.left),
                        rhs : this.getChildValue(item.right),
                        operator : item.operator
                    };
                    this.items.push(p);
                }
            }
            else if(item.ast !== null)
                this.items.push(new Statement(item.ast, this.depth + 1));
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    getChildValue(item: any): string
    {
        switch (item.type) 
        {
            case 'string':
            case 'number':
                return item.value.toString();
            case 'column_ref':
                let str = '';
                str += item.table === null ? '' : (item.table + '.');
                str += item.column;
                return str;
            default:
                return '';
        }
    }

    getSQL(): string
    {
        let indent = new Array(this.depth).fill(S4 + S4).join('') + (this.depth > 0 ? S4 : '');
        let sql = S4 + ' WHERE' + S2;
        console.log(this.items);
        
        //for first line
        const f: Predicate = this.items[0] as Predicate;
        sql += f.lhs + ' ' + f.operator + ' ' + f.rhs + RN;

        //rest columns
        for (let i = 1; i < this.items.length; i++)
        {
            const x = this.items[i];
            if(typeof(x) === 'string') //AND, OR
                sql += S4 + S3 + x;
            else if(x instanceof Statement)
            {
                sql += S2 + '(' + S3 + x.getSQL().trim(); + ')';
            }
            else //predicate
                sql += S2 + x.lhs + ' ' + x.operator + ' ' + x.rhs + RN;
        }
        
        return sql;
    }
}