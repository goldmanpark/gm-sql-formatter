/* eslint-disable curly */
import { Element, ElementType, RN, S2, S3, S4 } from '../definition';
import { Statement } from '../Statement';
import { Expression } from "../Expression";
import { Function } from './Function';

export class BETWEEN implements Element
{
    elementType = ElementType.predicate;
    depth: number;

    lhs: string | Expression | Statement | Function;
    rhs: string | Expression | Statement | Function;
    
    constructor(source: any, depth: number)
    {
        this.depth = depth;
        this.lhs = this.createSide(source.value[0]);
        this.rhs = this.createSide(source.value[1]);
    }

    createSide(side: any): string | Expression | Statement | Function
    {
        switch (side.type) {
            case 'number':
                return side.value.toString();
            case 'single_quote_string':
                return "'" + side.value.toString() + "'";
            case 'function':
                return new Function(side.value, this.depth + 1);
            default:
                return '';
        }
    }
    
    getSQL():string
    {
        let l = typeof(this.lhs) === 'string' ? this.lhs : this.lhs.getSQL();
        let r = typeof(this.rhs) === 'string' ? this.rhs : this.rhs.getSQL();
        return l + ' AND ' + r;
    }
}