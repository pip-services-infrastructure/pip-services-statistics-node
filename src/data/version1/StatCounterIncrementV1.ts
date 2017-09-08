export class StatCounterIncrementV1 {
    public constructor(group: string, name: string,
        time: Date, timezone: string, value: number) {
        this.group = group;
        this.name = name;
        this.time = time;
        this.timezone = timezone;
        this.value = value;
    }

    public group: string;
    public name: string;
    public time?: Date;
    public timezone?: string;
    public value: number;
}