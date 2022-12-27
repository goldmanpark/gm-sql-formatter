/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { SELECT } from './statements/SELECT';

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
    console.log(ast);
    let parser: nsp.Parser = new nsp.Parser();
    try
    {
        switch (ast.type)
        {
            case 'select':
                let item = new SELECT(depth, ast);
                return item.getSQL();
            default:
                throw new Error('non select');
        }
    }
    catch (error)
    {
        return parser.sqlify(ast);
    }
}