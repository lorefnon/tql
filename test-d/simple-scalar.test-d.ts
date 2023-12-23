import freeze from "deep-freeze";
import { expectType } from "tsd";

import { field, Result, selectionSet } from "../src";

interface Schema {
  Query: Query;
}

interface Query {
  __typename: "Query";
  hello: string;
}

const selection = selectionSet([field("__typename"), field("hello")]);

type Test = Result<Schema, Query, typeof selection>;

expectType<Test>(freeze({ __typename: "Query", hello: "foo" }));
