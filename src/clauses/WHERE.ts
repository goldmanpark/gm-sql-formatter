import { Clause, ClauseType } from '../gmf_definition';

export class WHERE implements Clause
{
    depth: number;
    type: ClauseType = ClauseType.where;
    where: string = '';

    constructor(d: number){
        this.depth = d;
    }
}