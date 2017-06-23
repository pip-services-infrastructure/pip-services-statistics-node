export class StatCounterIncrementV1 {
    public constructor(group: string, name: string, time: Date, value: number) {
        this.group = group;
        this.name = name;
        this.time = time;
        this.value = value;
    }

    public group: string;
    public name: string;
    public time?: Date;
    public value: number;
}