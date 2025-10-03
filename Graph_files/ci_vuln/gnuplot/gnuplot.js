var run = require('comandante');
const v36 = function () {
    const v19 = [];
    var plot = run('gnuplot', v19);
    const v24 = function (data, options) {
        const v20 = plot.write(data);
        v20;
        const v21 = options.end;
        const v22 = options && v21;
        if (v22) {
            const v23 = plot.end();
            v23;
        }
        return plot;
    };
    plot.print = v24;
    const v27 = function (data, options) {
        const v25 = data + '\n';
        const v26 = plot.print(v25, options);
        return v26;
    };
    plot.println = v27;
    const v28 = [
        'set',
        'unset',
        'plot',
        'splot',
        'replot'
    ];
    const v34 = function (name) {
        const v33 = function (data, options) {
            if (data) {
                const v29 = name + ' ';
                const v30 = v29 + data;
                const v31 = plot.println(v30, options);
                return v31;
            }
            const v32 = plot.println(name, options);
            return v32;
        };
        plot[name] = v33;
    };
    const v35 = v28.forEach(v34);
    v35;
    return plot;
};
module.exports = v36;