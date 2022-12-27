import { Clause, ClauseType } from '../gmf_definition';

export class WHERE implements Clause
{
    depth: number;
    type: ClauseType = ClauseType.where;
    lines: string[];

    constructor(d: number){
        this.depth = d;
        this.lines = new Array<string>();
    }
}