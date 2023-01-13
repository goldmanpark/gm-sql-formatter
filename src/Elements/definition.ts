import { Expression } from "./Expression";
import { Predicate } from "./Predicate";

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
    predicate,
    function
}

export enum ClauseType{
    with,
    select,
    from,
    where,
    groupby,
    having,
    orderby
}

export interface Element{
    readonly elementType: ElementType
    readonly depth: number
    getSQL: () => string
}

export interface Clause extends Element{
    readonly clauseType: ClauseType
    items: Array<string | Element | Expression | Predicate | any>
}