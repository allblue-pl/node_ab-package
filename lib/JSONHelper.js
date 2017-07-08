'use strict';


function JSONHelper()
{ let $this = this;

}


JSONHelper.ReplaceInStrings = (json, search, replace) =>
{
    for (let key in json) {
        if (typeof json[key] === 'string') {
            let regexp = new RegExp('\{\{' + search + '\}\}', 'g');
            json[key] = json[key].replace(regexp, replace);
        }
        else if (typeof json[key] === 'object')
            JSONHelper.ReplaceInStrings(json[key], search, replace);
    }
};

JSONHelper.ReplaceValue = (json, search_key, replace) =>
{
    for (let key in json) {
        if (key === search_key)
            json[key] = replace;
        else if (typeof json[key] === 'object')
            JSONHelper.ReplaceValue(json[key], search_key, replace);
    }
}


JSONHelper.prototype = {

};


module.exports = JSONHelper;
