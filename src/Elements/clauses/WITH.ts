/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { Statement } from '../Statement';
import { Element, ElementType, Clause, RN, S4, S3, ClauseType } from '../definition';

interface WithItem{
    name : string;
    columns : string[] | null;
    statement : Statement;
}

export class WITH implements Clause
{
    elementType = ElementType.clause;
    clauseType = ClauseType.with;
    items = new Array<WithItem>(); // only 1 item
    depth: number;    

    constructor(withs: any[] | any, depth?: number)
    {
        this.depth = 0;
        this.items = withs.map((x: any) => {
            return {
                name : x.name.value,
                columns : x.columns instanceof Array 
                    ? x.columns.map((x: any) => { return x.column; })
                    : null,
                statement : new Statement(x.stmt.ast, 0)
            };
        });
    }

    getSQL(): string{
        let sql = 'WITH ' + this.items.map(x => {
            let sql = x.name;
            sql += x.columns 
                ? ' (' + x.columns.join(', ') + ')'
                : '';
            sql += ' AS ' + '(' + RN + x.statement.getSQL() + RN;
            return sql + ')';
        }).join(',' + RN);

        if(this.items.length > 1)
            return sql.slice(0, -1);
        else
            return sql + RN;
    }
}