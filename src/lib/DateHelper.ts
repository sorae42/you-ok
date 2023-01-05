export function timeFormatter(hours: number) {
    let output: string;

    switch(true) {
        case (hours >= 24):
            output = (Math.floor(hours) / 24) + "d ago";
            break;
        case (hours >= 1):
            output = Math.floor(hours) + "h ago";
            break;
        case (hours >= 0.1):
            output = Math.floor((hours * 60)) + "m ago";
            break;
        default:
            output = "Just now";
    }

    return output;
}