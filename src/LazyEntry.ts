import Cockpit from "./Cockpit";
import Collection from "./Collection";

export default class LazyEntry {
    id: string;
    cockpit: Cockpit;
    collection: Collection;

    constructor(cockpit, link) {
        this.id = link._id;
        this.cockpit = cockpit;
        this.collection = cockpit.collection(link.link);
    }

    async resolve() {
        return await this.collection.getById(this.id);
    }
}