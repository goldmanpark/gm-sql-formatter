/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, Expression, Predicate, RN, S2, S3, S4 } from '../definition';
import { Statement } from '../Statement';

export class WHERE implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.select;
    items: Array<string | Predicate>;
    depth: number;

    constructor(ast: any, depth: number)
    {
        this.items = new Array<string | Predicate>();
        this.depth = depth;
        this.createPredicate(ast);
    }

    createPredicate(item: any)
    {
        try 
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
        catch (error) 
        {
            console.log(error);
        }
    }

    getChildValue(item: any): string | Expression | Statement
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
                break;
        }
        if(item.ast !== null)
            return new Statement(item.ast, this.depth + 1);
        else
            return '';
    }

    getSQL(): string
    {
        let indent = new Array(this.depth).fill(S4 + S4).join('') + (this.depth > 0 ? S4 : '');
        let sql = S4 + ' WHERE';
        
        for (let i = 0; i < this.items.length; i++)
        {
            const x = this.items[i];
            if(typeof(x) === 'string') //AND, OR
                sql += S4 + S3 + x;
            else //predicate
            {
                let l: string = x.lhs instanceof Statement 
                    ? '(' + RN + indent + x.lhs.getSQL() + ')'
                    : x.lhs.toString();
                let r: string = x.rhs instanceof Statement
                    ? '(' + RN + indent + x.rhs.getSQL() + ')'
                    : x.rhs.toString();
                sql += i === 0 ? '' : indent;
                sql += S2 + l + ' ' + x.operator + ' ' + r + RN;
            }                
        }
        
        return sql;
    }
}