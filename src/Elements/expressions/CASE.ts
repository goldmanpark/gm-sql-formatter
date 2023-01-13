/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Element, ElementType, S4, S2, S3, RN, S6 } from '../definition';
import { Expression } from '../Expression';
import { Predicate } from '../Predicate';

export class CASE implements Element
{
    elementType = ElementType.expression;
    depth: number;
    alias: string | null;

    when: Array<Predicate>;
    then: Array<string | Expression>;
    else: string | Expression;

    constructor(args: any[], depth: number)
    {
        this.depth = depth;
        this.when = new Array<Predicate>;
        this.then = new Array<string | Expression>;
        this.else = '';
        this.alias = null;

        args.forEach(x => {
            switch (x.type) {
                case 'when':
                    this.when.push(new Predicate(x.cond, this.depth));
                    this.then.push(this.createResult(x.result));
                    break;
                case 'else':
                    this.else = this.createResult(x.result);
                    break;
                default:
                    break;
            }
        });
    }

    createResult(res: any): string | Expression
    {
        switch (res.type) {
            case 'binary_expr':
                return new Expression(res, this.depth);
            case 'column_ref':
                return res.table ? res.table + '.' + res.column : res.column;
            case 'number':
                return res.value.toString();
            case 'single_quote_string':
                return "'" + res.value.toString() + "'";
            default:
                return '';
        }
    }

    getSQL(): string
    {
        let indent = new Array(this.depth * 4 + 12).fill(' ').join('');
        let sql = 'CASE';

        // only 1 line
        if(this.when.length === 1)
        {
            const w = this.when[0];
            const t = this.then[0];
            sql += ' WHEN ' + w.getSQL().trim() + ' THEN ';
            sql += typeof(t) === 'string' ? t : t.getSQL().trim();
            
            if(typeof(this.else) === 'string')
                sql += ' ELSE ' + this.else;
            else if(this.else instanceof Expression)
                sql += ' ELSE ' + this.else.getSQL().trim();
            sql += ' END';
            if(this.alias) sql += ' AS ' + this.alias;
            return sql;
        }

        //when & then
        sql += RN;
        for (let i = 0; i < this.when.length; i++) {
            const w = this.when[i];
            const t = this.then[i];
            sql += indent + S4 + 'WHEN ' + w.getSQL() + ' THEN ';
            if(typeof(t) === 'string')
                sql += t;
            else
                sql += t.getSQL();
            sql += RN;
        }

        //else
        if(typeof(this.else) === 'string')
            sql += indent + S4 + 'ELSE ' + this.else + RN;
        else if(this.else instanceof Expression)
            sql += indent + S4 + 'ELSE ' + this.else.getSQL() + RN;

        sql += indent + 'END';
        sql += this.alias ? ' AS ' + this.alias + RN : RN;
        return sql;
    }
}