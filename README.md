### Preparatory actions on the Dasha side
 
Make sure you have node.js version 13+ and npm installed. You will also want the latest version of Visual Studio Code running to edit and test the Dasha app.
1. Join [Dasha Community](https://community.dasha.ai) - you will get your API key here automatically
2. Open VSCode and install the [Dasha Studio Extension](https://marketplace.visualstudio.com/items?itemName=dasha-ai.dashastudio&ssr=false) from the extension store.  You’ll get all the DSL syntax highlighting and a GUI interface for debugging your conversation flow.
3. Run __`npm i -g "@dasha.ai/cli@latest"`__ to install the latest Dasha CLI.
 
You’ll want to load up a Dasha conversational AI app. For the purposes of this tutorial, you may want to load up either the [inbound tester app](https://github.com/dasha-samples/dasha-sip-test) for inbound calls.  Or the [outbound tester app](https://dasha.ai/en-us/blog/customer-feedback-survey) for outbound calls. 
 
## Setting things up on the side of Voximplant (telephony vendor) 
 
1. [Login to your Voximplant account](https://manage.voximplant.com/auth) or [create an account](https://manage.voximplant.com/auth/sign_up) if you don’t have one.
2. Create a Voximplant [application](https://manage.voximplant.com/applications).
3. Purchase a Voximplant phone number in the [Numbers](https://manage.voximplant.com/numbers/my_numbers) section of the control panel and attach it to the app. This number will be used as callerid. 
4. Go to your [applications](https://manage.voximplant.com/applications), click on the app you had created. Click on Numbers > Available and "attach". This number will be used as __callerid__. 
 
### For Inbound calls: 
Connect your sip trunk with Dasha's using this command:
 
```bash
dasha sip create-inbound --application-name <your_app_name> <config_name>
```
 
- `your_app_name` is your Voximplant application name;
- `config_name` is the name of the config we’ll use later.
 
For example:
```bash
dasha sip create-inbound --application-name exampleApp vox_inbound
```
This command will give us a Dasha’s SIP URI to call. For example: sip:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@sip.us.dasha.ai
 
To see the URI, write: `dasha sip list-inbound`.
Let’s put it in our Voximplant scenario instead of "your_SIP_URI".
 
Create a scenario inside the app by pressing a plus icon and paste this code in there:
 
   ```javascript
    // SIP URI that we get in the next step
    const sipURI = <your_SIP_URI>;
    VoxEngine.addEventListener(AppEvents.CallAlerting, (e) => {
      const call = e.call;
      call.addEventListener(CallEvents.Connected, () => {
        const callToDasha = VoxEngine.callSIP(sipURI);
        VoxEngine.easyProcess(call, callToDasha);
      });
      call.answer();
    });
 ```
 
   This is the scenario that will be run when we set everything up. We use the [callSIP](https://voximplant.com/docs/references/voxengine/voxengine/callsip) method to make a call to our SIP URI. On an incoming SIP call from Voximplant, the SIP URI that we want to call is passed to the callSIP method. This is how we connect two call legs. Once the call is answered, Dasha will start a conversation.
 
If you are using SIP Registrations on your PBX, you need to create a [SIP Registration](https://voximplant.com/docs/howtos/integration/sip/registration) and use it instead of the SIP URI.

Click on __Routing__ in the left hand menu. Create a new rule (leave the pattern as default), and attach your scenario to this rule.
 

 
## Get your backend in order and start calling 
 
The setup is ready, now we need a local app or backend to run our Voximplant scenario using Dasha.
 
### Taking inbound calls: 
1. Open up your VS Code with the Dasha project open.
2. In the __package.json__ file, replace the __`name`__ field with your config name. To see all the available configs for sip inbound, run the __`dasha sip list-inbound`__ command.
In the inbound.dashaapp file, change the __`name`__ field so that it matches your config name.
 
To test the integration, run npm i from your folder.
 
For __inbound calls__, run: __`node main.js`__. Now you can call to the phone number which you purchased in Voximplant’s dashboard. 
 
You’ll be able to track application deployment in the console. 
 
## In conclusion 
 
Congrats, you’ve successfully connected your Dasha conversational AI app to your custom telephony. This is exciting. You can now call anyone in the world. 
If you haven’t yet, you can join [Dasha community](https://community.dasha.ai) and let us know how useful this was to you. If you want a super quick answer - ask your questions on [StackOverflow](https://stackoverflow.com), using the #dasha hashtag. 