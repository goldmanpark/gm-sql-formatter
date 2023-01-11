/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, Element, ElementType, RN, S2, S3, S4 } from '../definition';
import { Predicate } from '../Predicate';

export class HAVING implements Clause{
    elementType = ElementType.clause;
    clauseType = ClauseType.having;
    items: Array<Predicate>;
    depth: number;

    constructor(having: any, depth: number)
    {
        this.items = new Array<Predicate>();
        this.depth = depth;
        this.createPredicate(having);
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
        let indent = new Array(this.depth * 12 + 4).fill(' ').join('');
        let sql = indent + 'HAVING';

        for (let i = 0; i < this.items.length; i++)
        {
            const x = this.items[i];
            if(typeof(x) === 'string' && x === 'AND')
                sql += indent + S3 + x;
            else if(typeof(x) === 'string' && x === 'OR')
                sql += indent + S4 + x;
            else if(x instanceof Predicate)
                sql += S2 + x.getSQL() + RN;
        }

        return sql;
    }
}