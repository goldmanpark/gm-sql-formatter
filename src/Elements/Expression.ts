/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Element, ElementType, RN, S2, S3, S4 } from './definition';
import { Statement } from './Statement';
import { Function } from './expressions/function';

export class Expression implements Element
{
    elementType = ElementType.expression;
    depth: number;

    lhs: string | Expression | Statement | Function;
    operator: '+' | '-' | '/' | '*' | '%';
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
        if(source.ast)
            return new Statement(source.ast, this.depth + 1);
        switch (source.type) {
            case 'column_ref':
                let s = '';
                if(source.db) s += source.db + '.';
                if(source.table) s += source.table + '.';
                if(source.column) s += source.column;
                return s;
            case 'number':
                return source.value.toString();
            case 'null':
                return 'NULL';
            case 'var':
                return source.prefix + source.name;
            case 'function':
            case 'aggr_func': //aggregate function
                return new Function(source, this.depth + 1);
            default:
                return "'" + source.value.toString() + "'";
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
            sql += '(' + this.rhs.getSQL().trim() + ')';
        else
            sql += this.rhs.getSQL().trim();
        return sql;
    }
}