function tesseract_CLI(image, callBack) {
  var out = "";
  
  const { spawn } = require('child_process');
  const ls = spawn('tesseract', [image, 'stdout']);

  ls.stdout.on('data', (data) => {
    out += data.toString();
  });

  ls.on('close', (code) => {
    callBack(code, out);
  });
}

tesseract_CLI('tst.jpeg', (exit_status, sout) => {
  console.log(sout);
});
