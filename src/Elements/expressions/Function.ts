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

        if(func.args.value instanceof Array && func.args.value.length > 0)
        {
            this.content = func.args.value.map((param: any) =>
            {
                switch (param.type) 
                {
                    case 'star':
                        return '*';
                    case 'function':
                        return new Function(param, this.depth + 1);
                    case 'single_quote_string':
                        return "'" + param.value.toString() + "'";
                    case 'column_ref':
                        return param.table ? param.table + '.' + param.column : param.column;
                    case 'number':
                        return param.value.toString();
                    default:
                        break;
                }
            });
        }
        else if(func.args.expr && func.args.expr.type === 'case')
            this.content = new CASE(func.args.expr.args, this.depth + 1);
        else
            this.content = null;
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