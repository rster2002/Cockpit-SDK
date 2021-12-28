export default class FilterBuilder {
    build: { [key: string]: any } = {};
    currentKey: string;
    currentFunction: object;
    mode: string = "default";
    currentOr: any[] = [];

    getFilter() {
        console.log(this.build);
        return this.build;
    }

    setKey(key: string) {
        this.currentKey = key;
    }

    setValue(value: any) {
        switch (this.mode) {
            case "or":
                this.currentOr.push({
                    [this.currentKey]: value,
                });
                break;

            default:
                this.build[this.currentKey] = value;
                break;
        }

        this.mode = "default";
        this.currentKey = null;
    }

    where(key: string) {
        this.setKey(key);
        return this;
    }

    whereId() {
        this.where("_id");
        return this;
    }

    whereCreated() {
        this.where("_created");
        return this;
    }

    whereModified() {
        this.where("_modified");
        return this;
    }

    before(date: Date) {
        let timestamp = date.getTime() / 1000;
        this.lessThan(timestamp);

        return this;
    }

    after(date: Date) {
        let timestamp = date.getTime() / 1000;
        this.greaterThan(timestamp);

        return this;
    }

    is(value: any) {
        this.setValue(value);
        return this;
    }

    isNot(value: any) {
        this.setValue({
            $ne: value,
        });

        return this;
    }

    equals(value: any) {
        return this.is(value);
    }

    notEqual(value: any) {
        this.isNot(value);
    }

    in(options: any[]) {
        this.setValue({
            $in: options,
        });

        return this;
    }

    notIn(options: any[]) {
        this.setValue({
            $nin: options,
        });

        return this;
    }

    lessThan(number: number) {
        this.setValue({
            $lt: number,
        });

        return this;
    }

    lessOrEqualThan(number: number) {
        this.setValue({
            $lte: number,
        });

        return this;
    }

    greaterThan(number: number) {
        this.setValue({
            $gt: number,
        });

        return this;
    }

    greaterOrEqualThan(number: number) {
        this.setValue({
            $gte: number,
        });

        return this;
    }

    or() {
        if (this.currentOr.length === 0) {
            this.currentOr = [this.build];
            this.build = {
                $or: this.currentOr,
            };
        }

        this.mode = "or";
        return this;
    }

    and() {
        return this;
    }
}