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
    items: Array<'AND' | 'OR' | 'EXISTS' | 'NOT EXISTS' | Predicate | Statement>;
    depth: number;

    constructor(ast: any, depth: number)
    {
        this.items = new Array<'AND' | 'OR' | 'EXISTS' | 'NOT EXISTS' | Predicate | Statement>();
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
        else if(item.name === 'EXISTS')
        {
            this.items.push('EXISTS');
            this.items.push(new Statement(item.args.value[0].ast, this.depth + 1));
        }
        else if(item.operator === 'NOT EXISTS')
        {
            this.items.push('NOT EXISTS');
            this.items.push(new Statement(item.expr.ast, this.depth + 1));
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
            if(typeof(x) === 'string')
            {
                switch (x) {
                    case 'AND': 
                        sql += indent + S2 + x; break;
                    case 'OR': 
                        sql += indent + S3 + x; break;
                    case 'EXISTS':
                    case 'NOT EXISTS':
                        sql += S2 + x + RN; break;
                    default:
                        break;
                }
            }
                
            else if(x instanceof Predicate)
                sql += S2 + x.getSQL() + RN;
            else if(x instanceof Statement)
                sql += indent + S4 + S3 + '(' + S3 + x.getSQL().trim() + ')' + RN;
        }

        return sql;
    }
}