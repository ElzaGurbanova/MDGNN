const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

function convertJsonToSpss(metadata, data, outputFile) {
  const metaArg = JSON.stringify(metadata);
  const dataArg = JSON.stringify(data);
  const outPath = path.resolve(outputFile);

  const bin = path.resolve('./dist/json_to_spss_v1');

  console.log(`${bin} <metadata> <data> ${outPath}`);

  execFile(bin, [metaArg, dataArg, outPath], { shell: false, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
    if (stdout) console.log(stdout);

    if (error) {
      console.error(`Error executing command: ${error.message}`);
      if (stderr) console.error(stderr);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      // continue; some binaries print non-fatal logs to stderr
    }

    if (fs.existsSync(outPath)) {
      console.log(`SPSS file created successfully: ${outPath}`);
    } else {
      console.error(`Failed to create SPSS file.`);
    }
  });
}

const data = [
  {
    "LevelManagement": "1",
    "Gender": "1",
    "Age": "2",
    "EducationLevel": "2",
    "MaritalStatus": "2",
    "Date": "2023-01-15"
  },
  {
    "LevelManagement": "2",
    "Gender": "2",
    "Age": "3",
    "EducationLevel": "3",
    "MaritalStatus": "1",
    "Date": "2023-02-20"
  },
  {
    "LevelManagement": "1",
    "Gender": "1",
    "Age": "4",
    "EducationLevel": "4",
    "MaritalStatus": "3",
    "Date": "2023-03-18"
  },
  {
    "LevelManagement": "2",
    "Gender": "2",
    "Age": "2",
    "EducationLevel": "1",
    "MaritalStatus": "4",
    "Date": "2023-04-10"
  },
  {
    "LevelManagement": "1",
    "Gender": "1",
    "Age": "5",
    "EducationLevel": "2",
    "MaritalStatus": "2",
    "Date": "2023-05-12"
  },
  {
    "LevelManagement": "2",
    "Gender": "2",
    "Age": "3",
    "EducationLevel": "1",
    "MaritalStatus": "1",
    "Date": "2023-06-25"
  },
  {
    "LevelManagement": "1",
    "Gender": "1",
    "Age": "4",
    "EducationLevel": "3",
    "MaritalStatus": "3",
    "Date": "2023-07-09"
  },
  {
    "LevelManagement": "2",
    "Gender": "2",
    "Age": "2",
    "EducationLevel": "4",
    "MaritalStatus": "2",
    "Date": "2023-08-30"
  },
  {
    "LevelManagement": "1",
    "Gender": "2",
    "Age": "3",
    "EducationLevel": "2",
    "MaritalStatus": "4",
    "Date": "2023-09-14"
  },
  {
    "LevelManagement": "2",
    "Gender": "1",
    "Age": "4",
    "EducationLevel": "3",
    "MaritalStatus": "1",
    "Date": "2023-10-03"
  }
];

const metadata = {
  "variable_value_labels": {
    "LevelManagement": { "1": "Headquarter", "2": "Branches" },
    "Gender": { "1": "Male", "2": "Female" },
    "Age": {
      "1": "Under 20",
      "2": "21-29",
      "3": "30-39",
      "4": "40-65",
      "5": "Above 65"
    },
    "EducationLevel": { "1": "Diploma", "2": "Bachelor", "3": "Masters", "4": "PhD" },
    "MaritalStatus": {
      "1": "Single",
      "2": "Married",
      "3": "Divorced",
      "4": "Separated"
    }
  },
  "variable_measure": {
    "LevelManagement": "nominal",
    "Gender": "nominal",
    "Age": "nominal",
    "EducationLevel": "nominal",
    "MaritalStatus": "nominal",
    "Date": "scale"
  },
  "column_labels": {
    "LevelManagement": "Level of Management",
    "Gender": "Gender",
    "Age": "Age",
    "EducationLevel": "Education Level",
    "MaritalStatus": "Marital Status",
    "Date": "Date of Response"
  }
};

convertJsonToSpss(metadata, data, './output-file.sav');

