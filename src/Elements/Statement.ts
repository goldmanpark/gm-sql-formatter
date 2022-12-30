/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { FROM } from './clauses/FROM';
import { SELECT } from './clauses/SELECT';
import { Element, ElementType, Clause } from './definition';

export class Statement implements Element{
    elementType = ElementType.statement;
    depth: number;
    items: Array<Clause>;
    alias: string | null;

    constructor(ast: nsp.AST, d: number)
    {
        this.depth = d;
        this.items = new Array<Clause>();
        this.alias = null;

        switch (ast.type) {
            case 'select':
                this.items.push(new SELECT(ast, 0));
                if(ast.from !== null) this.items.push(new FROM(ast.from, 0));
                //this.items.push(new WHERE(ast.where, 0));
                break;
            default:
                console.log('not Select');
        }
    }

    getSQL():string
    {
        let str = '';
        this.items.forEach(x => {str += x.getSQL();});
        return str;
    }
}