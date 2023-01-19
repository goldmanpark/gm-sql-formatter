/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { WITH } from './clauses/WITH';
import { SELECT } from './clauses/SELECT';
import { FROM } from './clauses/FROM';
import { WHERE } from './clauses/WHERE';
import { GROUPBY } from './clauses/GROUPBY';
import { HAVING } from './clauses/HAVING';
import { ORDERBY } from './clauses/ORDERBY';
import { Element, ElementType, Clause, RN, S4, S3 } from './definition';

export class Statement implements Element{
    elementType = ElementType.statement;
    depth: number;
    items: Array<Clause | string>;
    alias: string | null;

    constructor(ast: nsp.AST, depth: number)
    {
        this.depth = depth;
        this.items = new Array<Clause | string>();
        this.alias = null;

        switch (ast.type) {
            case 'select':
                if(ast.with) this.items.push(new WITH(ast.with, this.depth));
                this.items.push(new SELECT(ast, this.depth));
                if(ast.from) this.items.push(new FROM(ast.from, this.depth));
                if(ast.where) this.items.push(new WHERE(ast.where, this.depth));
                if(ast.groupby) this.items.push(new GROUPBY(ast.groupby, this.depth));
                if(ast.having) this.items.push(new HAVING(ast.having, this.depth));
                if(ast.orderby) this.items.push(new ORDERBY(ast.orderby, this.depth));
                
                let u = ast as any;
                if(u && u.union)
                {
                    this.items.push(u.union.toUpperCase());
                    this.items = this.items.concat(new Statement(u._next, this.depth).items);
                }
                break;
            default:
                console.log('not Select');
        }
    }

    getSQL():string
    {
        let indent = new Array(this.depth * 12).fill(' ').join('');
        let sql = this.items.map((x) => {
            if(typeof(x) === 'string'){//집합 연산자
                switch (x) 
                {
                    case 'UNION':
                    case 'MINUS':
                        return RN + indent + S4 + ' ' + x + RN + RN;
                    case 'UNION ALL':
                    case 'INTERSECT':
                        return RN + indent + ' ' + x + RN + RN;
                    default:
                        return RN + x + RN + RN;
                }
            }
            else
                return x.getSQL();
        }).join('');

        if(this.depth > 0)
            return sql + RN;
        else
            return sql.trimEnd() + ';' + RN + RN;
    }
}