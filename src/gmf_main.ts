/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import * as gmfs from './gmf_statement';

const s2 = '  ';
const s3 = '   ';
const s4 = '    ';
const s5 = '     ';
const s6 = '      ';
const rn = '\r\n';

export function createATS(query: string): nsp.AST | nsp.AST[] | null
{
    try
    {
        let parser: nsp.Parser = new nsp.Parser();
        return parser.astify(query);
    }
    catch (error)
    {
        console.log(error);
        return null;
    }
}

export function createSQL(ast: nsp.AST | nsp.AST[]): string
{
    let sql = '';
    if(ast instanceof Array)
        ast.forEach(x => { sql += gmfs.formatSQL(x);});
    else
        sql = gmfs.formatSQL(ast);
    return sql;
}