export default function(hbs) {
    hbs.registerHelper('json', function(context) {
        return JSON.stringify(context, null, 2);
    });
}