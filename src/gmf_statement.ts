/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import * as gmfc from './gmf_clause';

const s2 = '  ';
const s3 = '   ';
const s4 = '    ';
const s5 = '     ';
const s6 = '      ';
const rn = '\r\n';


export function formatSQL(ast: nsp.AST, depth: number = 0): string
{
    console.log(ast);
    let parser: nsp.Parser = new nsp.Parser();
    try
    {
        switch (ast.type)
        {
            case 'select':
                return formatSELECT(parser, ast, depth);
            default:
                throw new Error('non select');
        }
    }
    catch (error)
    {
        return parser.sqlify(ast);
    }
}

export function formatSELECT(parser: nsp.Parser, ast: nsp.Select, depth: number = 0): string
{
    try {
        const indent = new Array(depth).fill(s4).join('');
        
        let SELECT: string[] = new Array<string>;
        let firstLine = 'SELECT';
        if (ast.distinct !== null)
            firstLine += '  DISTINCT';
        if (!(ast.columns instanceof Array))
        {
            firstLine += "*";
            SELECT.push(firstLine);
        }
        else
        {            
            firstLine += (gmfc.formatCOLUMN(ast.columns[0]));
            SELECT.push(firstLine);
            for (let i = 1; i < ast.columns.length; i++)
            {
                SELECT.push(gmfc.formatCOLUMN(ast.columns[i]));
            }
        }

        let FROM: string[] = new Array<string>;
        

        //5. JOIN
        //6. WHERE
        let WHERE: string = '';
        if(ast.where !== null)
        {
            WHERE += (s5 + 'WHERE' + s2);
            if(ast.where.type === 'binary_expr')
            {
                if(ast.where.operator === 'AND' || ast.where.operator === 'OR')
                {

                }
                else 
                {

                }
            }
        }
        //7. GROUP BY
        //8. ORDER BY

        //return SELECT + FROM + WHERE;
        return '';
    } catch (error) {
        return parser.sqlify(ast);
    }
}