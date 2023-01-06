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
            this.items.push(new Predicate(item, this.depth));
    }

    getSQL(): string
    {
        let indent = new Array(this.depth * 12 + 5).fill(' ').join('');
        let sql = indent + 'WHERE';

        for (let i = 0; i < this.items.length; i++)
        {
            const x = this.items[i];
            if(typeof(x) === 'string') //AND, OR
                sql += indent + S2 + x;
            else if(x instanceof Predicate)
                sql += S2 + x.getSQL() + RN;
        }

        return sql;
    }
}