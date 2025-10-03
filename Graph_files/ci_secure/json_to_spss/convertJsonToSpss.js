const v41 = require('child_process');
const execFile = v41.execFile;
const fs = require('fs');
const path = require('path');
const convertJsonToSpss = function (metadata, data, outputFile) {
    const metaArg = JSON.stringify(metadata);
    const dataArg = JSON.stringify(data);
    const outPath = path.resolve(outputFile);
    const bin = path.resolve('./dist/json_to_spss_v1');
    const v42 = `${ bin } <metadata> <data> ${ outPath }`;
    const v43 = console.log(v42);
    v43;
    const v44 = [
        metaArg,
        dataArg,
        outPath
    ];
    const v45 = 10 * 1024;
    const v46 = v45 * 1024;
    const v47 = {
        shell: false,
        maxBuffer: v46
    };
    const v60 = (error, stdout, stderr) => {
        if (stdout) {
            const v48 = console.log(stdout);
            v48;
        }
        if (error) {
            const v49 = error.message;
            const v50 = `Error executing command: ${ v49 }`;
            const v51 = console.error(v50);
            v51;
            if (stderr) {
                const v52 = console.error(stderr);
                v52;
            }
            return;
        }
        if (stderr) {
            const v53 = `Error: ${ stderr }`;
            const v54 = console.error(v53);
            v54;
        }
        const v55 = fs.existsSync(outPath);
        if (v55) {
            const v56 = `SPSS file created successfully: ${ outPath }`;
            const v57 = console.log(v56);
            v57;
        } else {
            const v58 = `Failed to create SPSS file.`;
            const v59 = console.error(v58);
            v59;
        }
    };
    const v61 = execFile(bin, v44, v47, v60);
    v61;
};
const v62 = {
    'LevelManagement': '1',
    'Gender': '1',
    'Age': '2',
    'EducationLevel': '2',
    'MaritalStatus': '2',
    'Date': '2023-01-15'
};
const v63 = {
    'LevelManagement': '2',
    'Gender': '2',
    'Age': '3',
    'EducationLevel': '3',
    'MaritalStatus': '1',
    'Date': '2023-02-20'
};
const v64 = {
    'LevelManagement': '1',
    'Gender': '1',
    'Age': '4',
    'EducationLevel': '4',
    'MaritalStatus': '3',
    'Date': '2023-03-18'
};
const v65 = {
    'LevelManagement': '2',
    'Gender': '2',
    'Age': '2',
    'EducationLevel': '1',
    'MaritalStatus': '4',
    'Date': '2023-04-10'
};
const v66 = {
    'LevelManagement': '1',
    'Gender': '1',
    'Age': '5',
    'EducationLevel': '2',
    'MaritalStatus': '2',
    'Date': '2023-05-12'
};
const v67 = {
    'LevelManagement': '2',
    'Gender': '2',
    'Age': '3',
    'EducationLevel': '1',
    'MaritalStatus': '1',
    'Date': '2023-06-25'
};
const v68 = {
    'LevelManagement': '1',
    'Gender': '1',
    'Age': '4',
    'EducationLevel': '3',
    'MaritalStatus': '3',
    'Date': '2023-07-09'
};
const v69 = {
    'LevelManagement': '2',
    'Gender': '2',
    'Age': '2',
    'EducationLevel': '4',
    'MaritalStatus': '2',
    'Date': '2023-08-30'
};
const v70 = {
    'LevelManagement': '1',
    'Gender': '2',
    'Age': '3',
    'EducationLevel': '2',
    'MaritalStatus': '4',
    'Date': '2023-09-14'
};
const v71 = {
    'LevelManagement': '2',
    'Gender': '1',
    'Age': '4',
    'EducationLevel': '3',
    'MaritalStatus': '1',
    'Date': '2023-10-03'
};
const data = [
    v62,
    v63,
    v64,
    v65,
    v66,
    v67,
    v68,
    v69,
    v70,
    v71
];
const v72 = {};
v72['1'] = 'Headquarter';
v72['2'] = 'Branches';
const v73 = {};
v73['1'] = 'Male';
v73['2'] = 'Female';
const v74 = {};
v74['1'] = 'Under 20';
v74['2'] = '21-29';
v74['3'] = '30-39';
v74['4'] = '40-65';
v74['5'] = 'Above 65';
const v75 = {};
v75['1'] = 'Diploma';
v75['2'] = 'Bachelor';
v75['3'] = 'Masters';
v75['4'] = 'PhD';
const v76 = {};
v76['1'] = 'Single';
v76['2'] = 'Married';
v76['3'] = 'Divorced';
v76['4'] = 'Separated';
const v77 = {};
v77['LevelManagement'] = v72;
v77['Gender'] = v73;
v77['Age'] = v74;
v77['EducationLevel'] = v75;
v77['MaritalStatus'] = v76;
const v78 = {};
v78['LevelManagement'] = 'nominal';
v78['Gender'] = 'nominal';
v78['Age'] = 'nominal';
v78['EducationLevel'] = 'nominal';
v78['MaritalStatus'] = 'nominal';
v78['Date'] = 'scale';
const v79 = {};
v79['LevelManagement'] = 'Level of Management';
v79['Gender'] = 'Gender';
v79['Age'] = 'Age';
v79['EducationLevel'] = 'Education Level';
v79['MaritalStatus'] = 'Marital Status';
v79['Date'] = 'Date of Response';
const metadata = {};
metadata['variable_value_labels'] = v77;
metadata['variable_measure'] = v78;
metadata['column_labels'] = v79;
const v80 = convertJsonToSpss(metadata, data, './output-file.sav');
v80;