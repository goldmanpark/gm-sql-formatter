/* eslint-disable curly */
import * as nsp from 'node-sql-parser';
import { formatSQL } from '../gmf_main';
import { Clause, ClauseType } from '../gmf_definition';

export class FROM implements Clause
{
    depth: number;
    type: ClauseType = ClauseType.from;
    lines: string[];

    constructor(d: number, from: Array<nsp.From | nsp.Dual | any>)
    {
        this.depth = d;
        this.lines = new Array<string>();

        let firstLine = 'FROM';
        if(from[0].type === 'dual') firstLine += 'DUAL';
        else if (from[0].table !== undefined)
        {
            if (from[0].as === null)
                firstLine += from[0].table;
            else
                firstLine += (from[0].table + ' AS ' + from[0].as);
        }
        else if(from[0].expr !== undefined)
        {
            //subquery
        }
        for (let i = 1; i < from.length; i++)
        {
            this.lines.push(this.formatFROM(from[i]));
        }
    }

    formatFROM(item: nsp.From | nsp.Dual | any): string
    {
        if (item.type === 'dual') 
            return 'DUAL';
        else if (item.table !== undefined)
        {
            if (item.as === null)
                return item.table;
            else
                return item.table + ' AS ' + item.as;
        }
        else if(item.expr !== undefined)
        {
            //subquery
            return '';
        }
        return '';
    }
}