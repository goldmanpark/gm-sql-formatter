/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { formatSQL } from '../gmf_main';
import { Statement, StatementType } from '../gmf_definition';
import { FROM } from '../clauses/FROM';
import { WHERE } from '../clauses/WHERE';

export class SELECT implements Statement
{
    depth: number;
    type: StatementType = StatementType.select;
    lines: string[];

    constructor(d: number, ast: nsp.Select)
    {
        this.depth = d;
        this.lines = new Array<string>();

        let firstLine: string = '';
        if (ast.distinct !== null)
            firstLine += '  DISTINCT';
        if (!(ast.columns instanceof Array))
            firstLine += '*';
        else
        {            
            firstLine += this.formatCOLUMN(ast.columns[0]);
            for (let i = 1; i < ast.columns.length; i++)
            {
                this.lines.push(this.formatCOLUMN(ast.columns[i]));
            }
        }
    }

    formatCOLUMN(col: nsp.Column): string
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
            str += formatSQL(expr.ast as nsp.AST, this.depth + 1);
        }

        str += col.as === null ? '' : ' AS ' + col.as;
        return str;
    }

    getSQL(): string{
        return '';
    }
}