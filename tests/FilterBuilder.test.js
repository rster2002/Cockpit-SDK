import FilterBuilder from "../src/FilterBuilder.ts";

let query;
beforeEach(() => {
    query = new FilterBuilder();
});

test("Filter query can be created", () => {
    // THEN
    expect(query).not.toBeUndefined();
    expect(query).toBeInstanceOf(FilterBuilder);
});

test("Build filter is returned correctly", () => {
    // GIVEN
    query.build["hello"] = "world";
    let expectedFilter = {
        hello: "world",
    };

    // WHEN
    let filter = query.getFilter();

    // THEN
    expect(filter).toEqual(expectedFilter);
});

test("Builder can filter on exact value using is and exact", () => {
    // GIVEN
    let expectedFilter = {
        hello: "world",
        foo: "bar",
    };

    // WHEN
    query.where("hello").is("world");
    query.where("foo").equals("bar");

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("Not equal statements are correctly included in filter", () => {
    // GIVEN
    let expectedFilter = {
        hello: { $ne: "world" },
        foo: { $ne: "bar" },
    };

    // WHEN
    query.where("hello").isNot("world");
    query.where("foo").notEqual("bar");

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("Greater than statements are correctly included in filter", () => {
    // GIVEN
    let expectedFilter = {
        age: { $gt: 18 },
    };

    // WHEN
    query.where("age").greaterThan(18);

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("Greater than or equal statements are correctly included in filter", () => {
    // GIVEN
    let expectedFilter = {
        age: { $gte: 18 },
    };

    // WHEN
    query.where("age").greaterOrEqualThan(18);

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("Less than statements are correctly included in filter", () => {
    // GIVEN
    let expectedFilter = {
        age: { $lt: 18 },
    };

    // WHEN
    query.where("age").lessThan(18);

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("Less than or equal statements are correctly included in filter", () => {
    // GIVEN
    let expectedFilter = {
        age: { $lte: 18 },
    };

    // WHEN
    query.where("age").lessOrEqualThan(18);

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("In statements are correctly included in filter", () => {
    // GIVEN
    let expectedFilter = {
        name: { $in: ["Alice", "Bob"] },
    };

    // WHEN
    query.where("name").in(["Alice", "Bob"]);

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("Not in statements are correctly included in filter", () => {
    // GIVEN
    let expectedFilter = {
        name: { $nin: ["Alice", "Bob"] },
    };

    // WHEN
    query.where("name").notIn(["Alice", "Bob"]);

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("Or statements are correctly included in filter", () => {
    // GIVEN
    let expectedFilter = {
        $or: [
            {
                hello: "world",
            },
            {
                foo: "bar",
            },
        ]
    };

    // WHEN
    query
        .where("hello").is("world")
        .or().where("foo").is("bar");

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("Multiple or statements can be chained", () => {
    // GIVEN
    let expectedFilter = {
        $or: [
            {
                hello: "world",
            },
            {
                foo: "bar",
            },
            {
                foo: "fez",
            },
        ],
    };

    // WHEN
    query
        .where("hello").is("world")
        .or().where("foo").is("bar")
        .or().where("foo").is("fez");

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});

test("Where conditions after or statement are correctly added to the filter", () => {
    // GIVEN
    let expectedFilter = {
        $or: [
            {
                hello: "world",
            },
            {
                foo: "bar",
            },
            {
                foo: "fez",
            },
        ],
        test: true,
    };

    // WHEN
    query
        .where("hello").is("world")
        .or().where("foo").is("bar")
        .or().where("foo").is("fez")
        .where("test").is(true);

    // THEN
    expect(query.getFilter()).toEqual(expectedFilter);
});