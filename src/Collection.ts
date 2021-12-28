import Cockpit from "./Cockpit";
import Entry from "./Entry";
import CollectionFilterBuilder from "./CollectionFilterBuilder";
import LazyEntry from "./LazyEntry";
import LazyCollection from "./LazyCollection";

interface CockpitCollectionResponse {
    fields: {
        [key: string]: any
    },
    entries: {
        _id: string
        _by: string | null,
        _created: number,
        _modified: number,
        [key: string]: any
    }[],
    total: number
}

export default class Collection {
    cockpit: Cockpit;
    name: string;

    constructor(cockpit: Cockpit, name: string) {
        this.cockpit = cockpit;
        this.name = name;
    }

    async all() {
        let response = await this.cockpit.fetch(`/api/collections/get/${this.name}`);
        let json = <CockpitCollectionResponse> await response.json();

        return this.mapEntries(json.entries);
    }

    async getCollection() {
        let response = await this.cockpit.fetch(`/api/collections/collection/${this.name}`);
        return await response.json();
    }

    mapEntries(entries) {
        return entries.map(entry => this.mapEntry(entry));
    }

    mapEntry(entry) {
        return new Entry(this, entry);
    }

    async duplicateInto(secondCollection: Collection) {
        let collection = await this.getCollection();
        let entries = await this.all();

        await secondCollection.clear();
        await secondCollection.changeFields(collection.fields);
        await secondCollection.addAll(entries);
    }

    async changeFields(fields) {
        await this.cockpit.fetch(`/api/collections/updateCollection/${this.name}`, {
            method: "POST",
            body: JSON.stringify({
                data: { fields },
            }),
        });
    }

    async clear() {
        await this.cockpit.fetch(`/api/collections/remove/${this.name}`, {
            method: "POST",
            body: JSON.stringify({
                filter: { "_id": true }
            }),
        });
    }

    async delete(filter: {[p: string]: any}) {
        if (Object.values(filter).length === 0) {
            return;
        }

        let response = await this.cockpit.fetch(`/api/collections/remove/${this.name}`, {
            method: "POST",
            body: JSON.stringify({
                filter,
            }),
        });

        let json = <CockpitCollectionResponse> await response.json();
        return this.mapEntries(json.entries);
    }

    async deleteAll(entries: Entry[]) {
        return await this.delete({
            _id: {
                $in: entries.map(entry => entry.getId()),
            },
        });
    }

    private async addAll(entries: any) {
        let data = entries.map(entry => {
            if (entry instanceof Entry) {
                entry = entry.asJson();
                delete entry._id;
            }

            return entry;
        });

        await this.cockpit.fetch(`/api/collections/save/${this.name}`, {
            method: "POST",
            body: JSON.stringify({
                data,
            }),
        });
    }

    filter() {
        return new CollectionFilterBuilder(this);
    }

    async get(filter: {[p: string]: any}) {
        let response = await this.cockpit.fetch(`/api/collections/get/${this.name}`, {
            method: "POST",
            body: JSON.stringify({
                filter,
            }),
        });

        return await this.processResponse(response);
    }

    async processResponse(response: Response) {
        let json = await response.json();

        return this.mapEntries(json.entries);
    }

    async getById(id: string) {
        return await this.get({
            _id: id,
        });
    }

    createLazyEntry(link: any) {
        return new LazyEntry(this.cockpit, link);
    }

    createLazyCollection(links: any[]) {
        return new LazyCollection(this.cockpit, links);
    }
}