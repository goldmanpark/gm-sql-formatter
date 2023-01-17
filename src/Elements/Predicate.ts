/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Element, ElementType, RN, S2, S3, S4 } from './definition';
import { Statement } from './Statement';
import { Expression } from './Expression';
import { Function } from './expressions/function';

export class Predicate implements Element
{
    elementType = ElementType.predicate;
    depth: number;

    lhs: string | Expression | Statement | Function;
    operator: '=' | '<' | '<=' | '>' | '>=' | 'IS' | 'IS NOT' | 'BETWEEN';
    rhs: string | Expression | Statement | Function;

    constructor(ast: any, depth: number)
    {
        this.depth = depth;
        this.lhs = this.getSide(ast.left);
        this.operator = ast.operator;
        this.rhs = this.getSide(ast.right);
    }

    getSide(source: any): string | Expression | Statement | Function
    {
        try
        {
            switch (source.type) {
                case 'column_ref':
                    let s = '';
                    if(source.db) s += source.db + '.';
                    if(source.table) s += source.table + '.';
                    if(source.column) s += source.column;
                    return s;
                case 'number':
                    return source.value.toString();
                case 'binary_expr':
                    return new Expression(source, this.depth);
                case 'null':
                    return 'NULL';
                case 'var':
                    return source.prefix + source.name;
                case 'function':
                case 'aggr_func': //aggregate function
                    return new Function(source, this.depth + 1);
                case 'expr_list':
                    if(this.operator === 'BETWEEN')
                    {
                        let l = this.createBETWEEN(source.value[0]);
                        let r = this.createBETWEEN(source.value[1]);
                        return l + ' AND ' + r;
                    }                        
                    else
                        return new Statement(source.value[0].ast, this.depth + 1);
                default:
                    return "'" + source.value.toString() + "'";
            }
        }
        catch (error)
        {
            console.log(error);
            return '';
        }
    }

    createBETWEEN(side: any): string
    {
        switch (side.type) {
            case 'number':
                return side.value.toString();
            case 'single_quote_string':
                return "'" + side.value.toString() + "'";
            case 'function':
                let f =  new Function(side.value, this.depth + 1);
                return f.getSQL();
            default:
                return '';
        }
    }

    getSQL(): string
    {
        let sql = '';
        if(typeof(this.lhs) === 'string')
            sql += this.lhs;
        else if(this.lhs instanceof Statement)
            sql += '(' + this.lhs.getSQL().trim() + ')';
        else
            sql += this.lhs.getSQL().trim();

        sql += ' ' + this.operator + ' ';

        if(typeof(this.rhs) === 'string')
            sql += this.rhs;
        else if(this.rhs instanceof Statement)
            sql += '(' + RN + this.rhs.getSQL().trimEnd() + ')';
        else
            sql += this.rhs.getSQL().trim();
        return sql;
    }
}