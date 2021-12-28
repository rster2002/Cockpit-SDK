import Collection from "./Collection";

interface EntryResponse {
    _id: string
    _by: string | null,
    _created: number,
    _modified: number,
}

//
// function resolveLinks(value) {

//

// }

export default class Entry implements EntryResponse {
    public _by: string | null;
    public _created: number;
    public _id: string;
    public _modified: number;
    private $collection: Collection;
    [key: string]: any;

    constructor(collection: Collection, data: any) {
        this.$collection = collection;

        data = this.resolveLinks(data);

        Object.assign(this, data);
    }

    resolveLinks(value: any) {
        if (Array.isArray(value)) {
            if (value.every(item => this.isLink(item))) {
                return this.$collection.createLazyCollection(value);
            }

            return value.map(item => this.resolveLinks(item));
        }

        if (typeof value === "object") {
            if (this.isLink(value)) {
                return this.$collection.createLazyEntry(value);
            }

            return Object.fromEntries(
                Object.entries(value).map(([key, value]) => {
                    return [key, this.resolveLinks(value)];
                })
            );
        }

        return value;
    }

    isLink(value) {
        return typeof value === "object" && "link" in value && "_id" in value
    }

    getCreatedTimestamp() {
        return this._created * 1000;
    }

    getLastModifierTimestamp() {
        return this._modified * 1000;
    }

    getId() {
        return this._id;
    }

    asJson() {
        let json = { ...this };
        delete json.$collection;

        return json;
    }
}