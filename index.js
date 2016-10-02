const stringifyObject = require('stringify-object');
const bemFsScheme = require('bem-fs-scheme');
const path = require('path');
const fs = require('fs');

function getEntities(bemdecl, levels) {
    return bemdecl.reduce((result, entity) => {
        const bemPath = bemFsScheme('nested').path(entity, 'bemhtml.js');
        
        levels.map(level => path.resolve(level, bemPath))
            .forEach(filePath => {
                const checkPath = path => {
                    try {
                        fs.accessSync(path);

                        return true;
                    }
                    catch (err) {
                        return false;
                    };
                };

                if (checkPath(filePath)) {
                    result += fs.readFileSync(filePath, 'utf-8');
                }
            });
        return result;
    }, '');
}

function stringify(bemdecl, levels, opts) {
    opts = opts || {};
    opts.indent = opts.indent || '    ';

    return stringifyObject(getEntities(bemdecl, levels), opts);
}

module.exports = {
    convert: getEntities,
    stringify: stringify
};
