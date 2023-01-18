/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Statement } from './Elements/Statement';

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
        ast.forEach(x => { sql += formatSQL(x);});
    else
        sql = formatSQL(ast);
    return sql; 
}

export function formatSQL(ast: nsp.AST, depth: number = 0): string
{
    try
    {
        let item = new Statement(ast, depth);
        return item.getSQL();
    }
    catch (error)
    {
        console.log(error);
        let parser: nsp.Parser = new nsp.Parser();
        return parser.sqlify(ast, {database : 'transactsql'});
    }
}