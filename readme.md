# Cockpit SDK
An unofficial SDK for interacting with [Cockpit CMS](https://getcockpit.com/) applications. It's primary use is to 
make it easier to interact with collections.

## NOTE
This is very much in active development and should probably not be used in any production environment.

## Usage
First, create a cockpit instance using:

```ts
import Cockpit from "./Cockpit";

let instance = new Cockpit({
    root: "http://localhost:8078",
    token: "7wPVJkMzQdPt30o3ill8GrB88UA",
});
```

Then you can get an instance of a collection using:

```ts
let usersCollection = instance.collection("users");
```

### Getting data
#### `.all()`
```ts
let entries = await usersCollection.all();
```

Returns all entries in the collection.

#### `.clear()`
```ts
await usersCollection.clear();
```

Removes all entries from the collection.

#### `.filter()`
```ts
let entries = await usersCollection.filter()
    .whereId().in(["abc", "def"])
    .get();
```

Allows you to build complex queries.