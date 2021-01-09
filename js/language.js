class Language {
    static db = {
        weird: [
            'shady',
            'questionable',
            'weird',
            'mysterious',
            'fishy',
        ]
    }
}

String.prototype.randomize = function() {
    let regex = /{{([a-zA-Z.]+)}}/gm;
    let match = this.match(regex);
    let toReturn = this;
    if (!match)
        return this;
    match.forEach((group) => {
        let base = group;
        let formula = group.replace('{{', '');
        formula =     formula.replace('}}', '');
        let random = Math.floor(Math.random()*Language.db[formula].length);
        toReturn = toReturn.replace(group, Language.db[formula][random]);
    });
    return toReturn;
}
