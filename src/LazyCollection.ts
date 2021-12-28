import Cockpit from "./Cockpit";

export default class LazyCollection {
    cockpit: Cockpit;
    links: any;

    constructor(cockpit: Cockpit, links) {
        this.cockpit = cockpit;
        this.links = links;
    }

    async resolve() {
        let result = [];
        let collections = <string[]> [...new Set(this.links.map(link => link.link))];

        for (let collectionName of collections) {
            let items = this.links.filter(link => link.link === collectionName);
            let collection = this.cockpit.collection(collectionName);

            let entries = await collection.filter()
                .whereId().in(items.map(item => item._id))
                .get();

            for (let entry of entries) {
                let index = this.links.findIndex(link => link._id === entry.getId());
                result[index] = entry;
            }
        }

        return result;
    }
}