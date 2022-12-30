/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Clause, ClauseType, Element, ElementType, RN, S2, S3, S4 } from '../definition';
import { Statement } from '../Statement';

export class SELECT implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.select;
    items: Array<string | Element>;

    distinct: boolean = false;
    top: number = 0;

    constructor(ast: nsp.Select, depth: number)
    {
        this.items = new Array<string | Element>();
        this.distinct = ast.distinct !== null;

        if(ast.columns === '*')
            this.items.push('*');
        else if (ast.columns instanceof Array)
        {
            ast.columns.forEach(x => {
                this.items.push(this.createCOLUMN(x, depth));
            });
        }
    }

    createCOLUMN(col: nsp.Column, depth: number): string | Element
    {
        try 
        {
            let expr: any = col.expr;
            let str = '';
            switch (expr.type) {
                case 'number':
                    str += expr.value.toString();
                    break;
                case 'single_quote_string':
                    str += ("'" + expr.value.toString() + "'");
                    break;
                case 'column_ref': //ordinary column
                    str += expr.table === null ? '' : (expr.table + '.');
                    str += expr.column;
                    break;
                case 'aggr_func': //aggregate function
                    let content = '';
                    if(expr.args.type === 'column_ref'){

                    }
                    else if(expr.args.type === 'aggr_func'){

                    }
                    else if(expr.args.type === 'star'){
                        content = '*';
                    }
                    str += (expr.name + '(' + content + ')');
                    break;
                default:
                    if(expr.ast !== null)
                    {
                        //subquery
                        let sq = new Statement(expr.ast as nsp.AST, depth + 1);
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
        let sql = S4 + 'SELECT' + S2;
        if(this.distinct) sql += 'DISTINCT';
        if(this.top > 0) sql += ('TOP ' + this.top.toString());

        if(typeof(this.items[0]) === 'string')
            sql += (this.items[0] + RN);
        else
            sql += '(' + this.items[0].getSQL() + ')';

        for (let i = 1; i < this.items.length; i++)
        {
            const item = this.items[i];
            if(typeof(item) === 'string')
                sql += (S4 + S4 + ',' + S3 + item + RN);
            else
                sql += '(' + item.getSQL() + ')';
        }
        return sql;
    }
}