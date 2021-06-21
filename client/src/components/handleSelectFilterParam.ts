const data = require('!!raw-loader!../../../server/store.txt').default;
import { Ref } from "@vue/reactivity";
import { DataEntry, DataEntryGroup } from "@/components/interface";
import moment from "moment";

export default (param: keyof DataEntry,
                resultsByParam: Ref<DataEntryGroup[]>,
                minCount: Ref<number>,
                maxCount: Ref<number>,
                thresholds: Ref<Partial<Record<keyof DataEntry, number>>>,
                lastRecordAddTime: Ref<string>,
                totalRecords: Ref<number>) => {
    const average = (nums: number[]) => {
        return nums.reduce((a: number, b: number) => (a + b)) / nums.length;
    };
    const sort = (a: DataEntryGroup, b: DataEntryGroup): number => {
        if (a.value > b.value)
            return 1;
        else if (a.value < b.value)
            return -1;
        else
            return 0;
    };
    const entries: Record<string, { results: number[], average: number, flagImg?: string }> = {};
    const dataEntries = (JSON.parse(`[${data.split("\n").filter((line: string) => line).join(",")}]`) as DataEntry[]);
    dataEntries.forEach((item) => {
        entries[item[param]] = entries[item[param]] || {
            results: [],
            flagImg: param === "countryName" ? item.flagImg : undefined
        };
        entries[item[param]].results.push(parseInt(item.result));
    });
    const results: DataEntryGroup[] = [];
    let max: number, min: number;

    Object.keys(entries).forEach((param) => {
        entries[param].average = Math.round(average(entries[param].results));
        const count = entries[param].results.length;
        if (count > max || max === undefined)
            max = count;
        else if (count < min || min === undefined)
            min = count;
        results.push({
            name: param,
            value: entries[param].average,
            count: count,
            flagImg: entries[param].flagImg
        });
    });
    results.sort(sort);
    resultsByParam.value = results;
    minCount.value = min!;
    maxCount.value = max!;
    totalRecords.value = dataEntries.length;
    const lastRecord: DataEntry = dataEntries[dataEntries.length - 1];
    lastRecordAddTime.value = moment(new Date(lastRecord!.datetime * 1000)).fromNow();
    if (thresholds.value[param] === undefined)
        thresholds.value[param] = Math.round((max! - min!) / 5);
}
