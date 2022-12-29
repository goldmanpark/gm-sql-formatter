export const S2 = '  ';
export const S3 = '   ';
export const S4 = '    ';
export const S5 = '     ';
export const S6 = '      ';
export const RN = '\r\n';

export enum ElementType{
    statement,
    clause,
    identifier,
    expression,
    predicate
}

export enum ClauseType{
    select,
    from,
    where,
    groupby,
    orderby
}

export interface Element{
    readonly elementType: ElementType
    getSQL: () => string
}

export interface Clause extends Element{
    readonly clauseType: ClauseType
    items: Array<string | Element>
}

export interface Expression{
    lhs: string | Expression
    operator: string
    rhs: string | Expression
}

export interface Predicate{
    lhs: string | Expression
    operator: string
    rhs: string | Expression
}