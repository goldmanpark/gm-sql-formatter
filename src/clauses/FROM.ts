import { Clause, ClauseType } from '../gmf_definition';

export class FROM implements Clause
{
    depth: number;
    type: ClauseType = ClauseType.from;
    froms: Array<string | object>;

    constructor(d: number){
        this.depth = d;
        this.froms = new Array<string | object>;
    }
}