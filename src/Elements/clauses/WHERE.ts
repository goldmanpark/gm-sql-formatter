/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, RN, S2, S3, S4 } from '../definition';
import { Statement } from '../Statement';
import { Expression } from '../Expression';
import { Predicate } from '../Predicate';

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
        if(item.operator === 'AND' || item.operator === 'OR')
        {
            this.createPredicate(item.left);
            this.items.push(item.operator);
            this.createPredicate(item.right);
        }
        else
        {
            let p: Predicate = new Predicate(item, this.depth);
            this.items.push(p);
        }
    }

    getSQL(): string
    {
        let indent = new Array(this.depth * 12 + 5).fill(' ').join('');
        let sql = indent + 'WHERE';
        
        for (let i = 0; i < this.items.length; i++)
        {
            const x = this.items[i];
            if(typeof(x) === 'string') //AND, OR
                sql += S4 + S3 + x;
            else //predicate
            {
                let l: string = x.lhs instanceof Statement 
                    ? '(' + RN + indent + S4 + S4 + S3 + x.lhs.getSQL().trim() + ')'
                    : x.lhs.toString();
                let r: string = x.rhs instanceof Statement
                    ? '(' + RN + indent + S4 + S4 + S3 + x.rhs.getSQL().trim() + ')'
                    : x.rhs.toString();
                sql += S2 + l + ' ' + x.operator + ' ' + r + RN;
            }                
        }
        
        return sql;
    }
}