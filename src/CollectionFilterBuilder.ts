import FilterBuilder from "./FilterBuilder";
import Collection from "./Collection";
import Entry from "./Entry";

export default class CollectionFilterBuilder extends FilterBuilder {
    $collection: Collection;

    constructor(collection: Collection) {
        super();

        this.$collection = collection;
    }

    async get(): Promise<Entry[]> {
        return await this.$collection.get(this.getFilter());
    }

    async delete() {
        return await this.$collection.delete(this.getFilter());
    }
}