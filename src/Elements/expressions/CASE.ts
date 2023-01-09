/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Element, ElementType, S4, S2, S3, RN, S6 } from '../definition';
import { Expression } from '../Expression';
import { Predicate } from '../Predicate';

export class CASE implements Element
{
    elementType = ElementType.expression;
    depth: number;

    when: Array<Predicate>;
    then: Array<string | Expression>;
    else: string | Expression;

    constructor(args: any[], depth: number)
    {
        this.depth = depth;
        this.when = new Array<Predicate>;
        this.then = new Array<string | Expression>;
        this.else = '';

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
        let sql = 'CASE' + RN;

        //when & then
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

        return sql + indent + 'END' + RN;
    }
}