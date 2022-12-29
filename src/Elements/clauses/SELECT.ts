/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { formatSQL } from '../../gmf_main';
import { Clause, ClauseType, Element, ElementType } from '../definition';

export class SELECT implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.select;
    items: Array<string | Element>;

    distinct: boolean = false;
    top: string = '';

    constructor(ast: nsp.Select, depth: number)
    {
        this.items = new Array<string | Element>();
        this.distinct = ast.distinct !== null;

        if (!(ast.columns instanceof Array))
            this.items.push('*');
        else
        {
            ast.columns.forEach(x => {
                this.items.push(this.formatCOLUMN(x, depth));
            });
        }
    }

    formatCOLUMN(col: nsp.Column, depth: number): string | Element
    {
        let str = '';
        let expr: any = col.expr;
        if (expr.type === 'column_ref')
        {
            //ordinary column
            str += expr.table === null ? '' : expr.table + '.';
            str += expr.column;
        }        
        else if (expr.type === 'aggr_func' && expr.args !== null)
        {
            //aggregate function
            let content = '';
            if(expr.args.type === 'column_ref'){

            }
            else if(expr.args.type === 'aggr_func'){
                
            }
            else if(expr.args.type === 'star'){
                content = '*';
            }
            str += (expr.name + '(' + content + ')');
        }
        else if(expr instanceof Object)
        {
            //subquery
            str += formatSQL(expr.ast as nsp.AST, depth + 1);
        }

        str += col.as === null ? '' : ' AS ' + col.as;
        return str;
    }

    getSQL(): string{
        let sql = '';
        this.items.forEach(x => {
            if(typeof(x) === 'string'){

            }
            else{

            }
        });
        return sql;
    }
}