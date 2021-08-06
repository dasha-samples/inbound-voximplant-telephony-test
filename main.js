const dasha = require("@dasha.ai/sdk");

async function main() {
  const app = await dasha.deploy(`${__dirname}/dsl`,{groupName: 'Default'});
  
  app.ttsDispatcher = () => "dasha";

  app.connectionProvider = () =>
    dasha.sip.connect(new dasha.sip.Endpoint("default"));

  app.queue.on("ready", async (key, conv, info) => {
    console.log(info.sip);

    const result = await conv.execute();
    console.log(result.output);
  });

  await app.start();

  process.on("SIGINT", async () => {
    await app.stop();
    app.dispose();
  });

  console.log(`Waiting for calls`);
}

main();