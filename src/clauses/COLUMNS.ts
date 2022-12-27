import { Clause, ClauseType } from '../gmf_definition';

export class COLUMNS implements Clause
{
    depth: number;
    type: ClauseType = ClauseType.columns;
    columns: Array<string | object>;

    constructor(d: number){
        this.depth = d;
        this.columns = new Array<string | object>;
    }
}