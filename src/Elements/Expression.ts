/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Element, ElementType, RN, S2, S3, S4 } from './definition';
import { Statement } from './Statement';

export class Expression implements Element
{
    elementType = ElementType.expression;
    depth: number;

    lhs: string | Expression | Statement;
    operator: '+' | '-' | '/' | '*' | '%';
    rhs: string | Expression | Statement;

    constructor(ast: any, depth: number)
    {
        this.depth = depth;
        this.lhs = this.getSide(ast.left);
        this.operator = ast.operator;
        this.rhs = this.getSide(ast.right);
    }

    getSide(source: any): string | Expression | Statement
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
        else if(this.lhs instanceof Expression)
            sql += this.lhs.getSQL().trim();

        sql += ' ' + this.operator + ' ';

        if(typeof(this.rhs) === 'string')
            sql += this.rhs;
        else if(this.rhs instanceof Statement)
            sql += '(' + this.rhs.getSQL().trim() + ')';
        else if(this.rhs instanceof Expression)
            sql += this.rhs.getSQL().trim();
        return sql;
    }
}