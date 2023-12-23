import type { SelectionSet } from "../src";

import { $, Episode, IMutation, ISchema, mutation, Result, Variables } from "./generated";

const ExampleMutation = mutation(t => [
  t.createReview({
    episode: $("episode"),
    review: $("review"),
  }, t => [
    t.__typename(),
    t.commentary(),
    t.stars(),
  ]),
]);

const variables: Variables<ISchema, IMutation, SelectionSet<typeof ExampleMutation>> = {
  episode: Episode.EMPIRE,
  review: {
    stars: 1,
    commentary: "Awesome!",
  },
};
const result = {} as Result<ISchema, IMutation, SelectionSet<typeof ExampleMutation>>;

result.createReview?.__typename;
result.createReview?.commentary;
result.createReview?.stars;
