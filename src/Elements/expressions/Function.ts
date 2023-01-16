/* eslint-disable curly */
import { Element, ElementType, RN, S2, S3, S4 } from '../definition';
import { CASE } from './CASE';
import { Statement } from '../Statement';
import { Expression } from "../Expression";

export class Function implements Element
{
    elementType = ElementType.function;
    depth: number;
    name: string;
    content: Array<string | CASE | Function | Expression | Statement> | CASE | null;
    alias: string | null;

    constructor(func: any, depth: number)
    {
        this.depth = depth;
        this.name = func.name.toUpperCase();
        this.alias = null;

        if(func.args.type === 'expr_list')
            this.content = func.args.value.map((x: any) => { return this.createParam(x); });
        else if(func.args.expr)
            this.content = [this.createParam(func.args.expr)];
        else
            this.content = null;
    }

    createParam(expr: any): string | CASE | Function | Expression | Statement
    {
        switch (expr.type) 
        {
            case 'star':
                return '*';
            case 'var':
                return expr.prefix + expr.name;
            case 'function':
                return new Function(expr, this.depth + 1);
            case 'single_quote_string':
                return "'" + expr.value.toString() + "'";
            case 'column_ref':
                return expr.table ? expr.table + '.' + expr.column : expr.column;
            case 'number':
                return expr.value.toString();
            case 'case':
                return new CASE(expr.args, this.depth + 1);
            default:
                return '';
        }
    }

    getSQL(): string
    {
        let indent = new Array(this.depth * 12 + 4).fill(' ').join('');
        let sql = this.name;

        if(this.content === null)
            sql += '()';
        else if(this.content instanceof CASE)
            sql += '(' + this.content.getSQL().trim() + ')';
        else if(this.content instanceof Array)
        {
            sql += '(' + this.content.map(x => {
                if(typeof(x) === 'string') return x;
                else return x.getSQL();
            }).join(', ') + ')';
        }

        if(this.alias) sql += ' AS ' + this.alias + RN;
        return sql;
    }
}