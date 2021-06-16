import data from "../store.js";

export default (param, resultsByParam, minCount, maxCount, thresholds) => {
    const average = (nums) => {
        return nums.reduce((a, b) => (a + b)) / nums.length;
    };
    const sort = (a, b) => {
        if (a.value > b.value)
            return 1;
        else if (a.value < b.value)
            return -1;
        else
            return 0;
    };
    const entries = {};
    data.forEach((item) => {
        entries[item[param]] = entries[item[param]] || {results: []};
        entries[item[param]].results.push(parseInt(item.result));
    });
    const results = [];
    let max, min;

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
            count: count
        });
    });
    results.sort(sort);
    resultsByParam.value = results;
    minCount.value = min;
    maxCount.value = max;
    if (thresholds.value[param] === undefined)
        thresholds.value[param] = Math.round((max - min) / 5);
}
