import Collection from "./Collection";

interface CockpitSettings {
    baseUrl: string
    token: string
}

export default class Cockpit {
    private readonly baseUrl: string;
    private readonly token: string;

    constructor({ baseUrl, token }: CockpitSettings) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    collection(name: string) {
        return new Collection(this, name);
    }

    async fetch(endpoint: string, options?: RequestInit) {
        if (typeof options !== "object" || options === null) {
            options = {};
        }

        if (options.headers === undefined) {
            options.headers = {};
        }

        options.headers["Cockpit-Token"] = this.token;
        options.headers["Content-Type"] = "application/json";

        return await fetch(this.baseUrl + endpoint, options);
    }

    async authenticate(user: string, password: string) {
        await this.fetch("/api/cockpit/authUser", {
            method: "POST",
            body: JSON.stringify({
                user,
                password,
            }),
        });
    }
}