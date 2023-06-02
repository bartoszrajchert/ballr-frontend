export type ErrorData = {
  detail:
    | {
        loc: string[];
        msg: string;
        type: string;
      }[]
    | string;
};

export type ProtoExtends<T, U> = U & Omit<T, keyof U>;
