/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, ElementType, RN, S2, S3, S4 } from '../definition';
import { CASE } from '../expressions/CASE';
import { Function } from '../expressions/function';
import { Statement } from '../Statement';

export class SELECT implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.select;
    items: Array<string | Statement | CASE | Function>;
    depth: number;

    distinct: boolean = false;
    top: number = 0;

    constructor(ast: nsp.Select, depth: number)
    {
        this.items = new Array<string | Statement | CASE | Function>();
        this.depth = depth;
        this.distinct = ast.distinct !== null;

        if(ast.columns === '*')
            this.items.push('*');
        else if (ast.columns instanceof Array)
        {
            ast.columns.forEach(x => {
                this.items.push(this.createCOLUMN(x));
            });
        }
    }

    createCOLUMN(col: nsp.Column): string | Statement | CASE | Function
    {
        try
        {
            let expr: any = col.expr;
            let str = '';
            switch (expr.type) {
                case 'number':
                    str += expr.value.toString();
                    break;
                case 'null':
                    str += 'NULL';
                    break;
                case 'var':
                    str += expr.prefix + expr.name;
                    break;
                case 'single_quote_string':
                    str += ("'" + expr.value.toString() + "'");
                    break;
                case 'column_ref': //ordinary column
                    str += expr.table === null ? '' : (expr.table + '.');
                    str += expr.column;
                    break;
                case 'case':
                    let c = new CASE(expr.args, this.depth);
                    if(col.as) c.alias = col.as;
                    return c;
                case 'function':
                case 'aggr_func': //aggregate function
                    let f =  new Function(expr, this.depth + 1);
                    if(col.as) f.alias = col.as;
                    return f;
                default:
                    if(expr.ast !== null)
                    {
                        //subquery
                        let sq = new Statement(expr.ast as nsp.AST, this.depth + 1);
                        sq.alias = col.as;
                        return sq;
                    }
                    break;
            }

            str += col.as === null ? '' : ' AS ' + col.as;
            return str;
        }
        catch (error)
        {
            console.log(error);
            return '';
        }
    }

    getSQL(): string
    {
        let indent = new Array(this.depth * 12 + 4).fill(' ').join('');
        let colIndent = indent + S4 + ',' + S3;
        let sql = indent + 'SELECT' + S2;
        if(this.distinct) sql += 'DISTINCT' + ' ';
        if(this.top > 0) sql += ('TOP ' + this.top.toString());

        for (let i = 0; i < this.items.length; i++)
        {
            const item = this.items[i];
            if(i > 0) sql += colIndent;

            if(typeof(item) === 'string')
                sql += item + RN;
            else if(item instanceof Statement)
            {
                //Subquery
                sql += '(' + S3 + item.getSQL().trim() + RN;
                sql += indent + S4 + S4 + ')';
                if (item.alias) sql += ' AS ' + item.alias;
                sql += RN;
            }
            else
                sql += item.getSQL();
        }
        return sql;
    }
}