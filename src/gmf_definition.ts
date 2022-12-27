export const s2 = '  ';
export const s3 = '   ';
export const s4 = '    ';
export const s5 = '     ';
export const s6 = '      ';
export const rn = '\r\n';

export enum StatementType{
    select,
    insert,
    update,
    delete
}

export enum ClauseType{
    from,
    where,
    groupby,
    orderby
}

export interface Statement{
    depth: number,
    type: StatementType,
    lines: string[]
}

export interface Clause{
    depth: number,
    type: ClauseType,
    lines: string[]
}