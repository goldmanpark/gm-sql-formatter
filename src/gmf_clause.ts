/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import * as gmfs from './gmf_statement';

const s2 = '  ';
const s3 = '   ';
const s4 = '    ';
const s5 = '     ';
const s6 = '      ';
const rn = '\r\n';

export function formatCOLUMN(col: nsp.Column, depth: number = 0): string
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
        str += gmfs.formatSQL(expr.ast as nsp.AST);
    }

    str += col.as === null ? '' : ' AS ' + col.as;
    return str;
}

export function formatFROM(from: Array<nsp.From | nsp.Dual | any>, depth: number = 0): string[]
{
    let FROM: string[] = new Array<string>;
    let firstLine = 'FROM';
    from.forEach(x => {
        if (x.type === 'dual') FROM += ('DUAL' + rn);
        else if (x.table !== undefined)
        {
            if (x.as === null)
                FROM += (x.table + rn);
            else
                FROM += (x.table + ' AS ' + x.as + rn);
        }
        else if(x.expr !== undefined)
        {
            //subquery
        }
    });
    return FROM;
}