export type ErrorData = {
  detail:
    | {
        loc: string[];
        msg: string;
        type: string;
      }[]
    | string;
};
