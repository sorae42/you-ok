import { DateTime, type DurationUnits } from "luxon";

export function getFormattedDiff(time: string) {
    let hours = getDiff(time, 'hours').hours || 0;
    return timeFormatter(hours);
}

export function timeFormatter(hours: number) {
    let output: string;

    switch(true) {
        case (hours >= 24):
            output = Math.floor((hours) / 24) + "d";
            break;
        case (hours >= 1):
            output = Math.floor(hours) + "h";
            break;
        case (hours >= 0.1):
            output = Math.floor((hours * 60)) + "m";
            break;
        default:
            output = "<1m";
    }

    return output;
}

export function getDiff(time: string, type: DurationUnits) {
    const now = DateTime.now();
    const toDiff = DateTime.fromISO(time);

    return now.diff(toDiff, type).toObject();
}