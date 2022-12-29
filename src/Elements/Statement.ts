import * as nsp from 'node-sql-parser';
import { Element, ElementType, Clause } from './definition';

export class Statement implements Element{
    elementType = ElementType.statement;
    depth: number;
    items: Array<Clause>;

    constructor(d: number, ast: nsp.AST){
        this.depth = d;
        this.items = new Array<Clause>();
    }

    getSQL():string {
        return '';
    }    
}