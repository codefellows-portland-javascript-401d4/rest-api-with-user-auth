module.exports = function userGroup(...groups) { // Spread array operator

    const checkGroup = groups.reduce((checkGroup, group) => {
        checkGroup[groups] = true;
        return lookup;
    }, Object.create(null));
    return function checkGroup(req, res, next) {
        const member = req.user.groups;
        if (member && member.some(role => checkGroup[groups])){
        next();
        } else {
            next({ code: 403, error: 'no Authorization found'});
        }
    };
}