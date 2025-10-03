const { execFile } = require('child_process');
const path = require('path');

// Function to run Python script with input as argument
function runPythonScript(question, stationName) {
  const q = String(question ?? '');
  const s = String(stationName ?? '');

  const scriptPath = path.join(__dirname, 'inference.py');

  execFile('python3', [scriptPath, q, s], (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
      return;
    }

    // Ignore stderr warnings unless critical
    if (stderr && !stderr.includes('check_gcp_environment')) {
      console.error(`Error in Python script: ${stderr}`);
      return;
    }

    console.log(stdout);  // Output from Python script
  });
}

// Example: Call the function with a question and station name
runPythonScript('請介紹國父紀念館', '國父紀念館');

