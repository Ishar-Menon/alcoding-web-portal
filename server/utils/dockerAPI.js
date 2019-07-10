var Docker = require("dockerode");
var docker = new Docker({ socketPath: "/var/run/docker.sock" });

const getOutput = async jsonObj => {

  var container = null;
  var containerOutput = "";
  var strJson = null;

  container = await docker.createContainer({
    Image: "alcoding/compiler_store",
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: true,
    StdinOnce: false
  });

  container.attach(
    {
      stream: true,

      stdin: true,
      stdout: true,
      stderr: true
    },
    function(err, stream) {
      if (err) throw err;
      strJson = JSON.stringify(jsonObj);
      stream.write(strJson + "\n");
    }
  );

  container = await container.start();

  await container.wait();

  containerOutput = await container.logs({
    stdout: true
  });

  var outputArray = containerOutput.split(strJson + "\r" + "\n");
  
  container = await container.remove();

  return JSON.parse(outputArray[1]);
};

module.exports = getOutput;
