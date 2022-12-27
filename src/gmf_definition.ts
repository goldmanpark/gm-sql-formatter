export enum StatementType{
    select,
    insert,
    update,
    delete
}

export enum ClauseType{
    columns,
    from,
    where,
    groupby,
    orderby
}

export interface Statement{
    depth: number,
    type: StatementType
}

export interface Clause{
    depth: number,
    type: ClauseType
}