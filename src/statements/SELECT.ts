import { Statement, StatementType } from '../gmf_definition';
import { COLUMNS } from '../clauses/COLUMNS';
import { FROM } from '../clauses/FROM';
import { WHERE } from '../clauses/WHERE';

export class SELECT implements Statement
{
    depth: number;
    type: StatementType = StatementType.select;
    
    constructor(d: number){
        this.depth = d;
    }

    /**
     * 
     * @returns assemble SELECT statement elements and return it's SQL text
     */
    assemble():string
    {
        return '';
    }
}