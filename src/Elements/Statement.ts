/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { FROM } from './clauses/FROM';
import { GROUPBY } from './clauses/GROUPBY';
import { HAVING } from './clauses/HAVING';
import { ORDERBY } from './clauses/ORDERBY';
import { SELECT } from './clauses/SELECT';
import { WHERE } from './clauses/WHERE';
import { Element, ElementType, Clause, RN } from './definition';

export class Statement implements Element{
    elementType = ElementType.statement;
    depth: number;
    items: Array<Clause>;
    alias: string | null;

    constructor(ast: nsp.AST, depth: number)
    {
        this.depth = depth;
        this.items = new Array<Clause>();
        this.alias = null;

        switch (ast.type) {
            case 'select':
                this.items.push(new SELECT(ast, this.depth));
                if(ast.from) this.items.push(new FROM(ast.from, this.depth));
                if(ast.where) this.items.push(new WHERE(ast.where, this.depth));
                if(ast.groupby) this.items.push(new GROUPBY(ast.groupby, this.depth));
                if(ast.having) this.items.push(new HAVING(ast.having, this.depth));
                if(ast.orderby) this.items.push(new ORDERBY(ast.orderby, this.depth));
                break;
            default:
                console.log('not Select');
        }
    }

    getSQL():string
    {
        let str = '';
        this.items.forEach(x => {str += x.getSQL();});
        return str + RN;
    }
}