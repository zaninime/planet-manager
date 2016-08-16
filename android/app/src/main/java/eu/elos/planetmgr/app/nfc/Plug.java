package eu.elos.planetmgr.app.nfc;

public class Plug {
    /*
    private String LOGTAG = "NFC-Plug";
    private PendingIntent pendingIntent;
    private IntentFilter[] intentFiltersArray;
    private String[][] techListsArray;
    private NfcAdapter nfcAdapter;
    private enum Actions { READPARAMS, WRITEPARAMS, DWLMODE, NMODE }
    private Actions nextAction;
    private CallbackContext callbackContext;
    private byte[] paramsToWrite;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        IntentFilter tagDetected = new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED);
        intentFiltersArray = new IntentFilter[]{tagDetected};
        techListsArray = new String[][]{new String[]{NfcV.class.getName()}};
        nfcAdapter = NfcAdapter.getDefaultAdapter(cordova.getActivity());
        if (nfcAdapter == null) return;
        createPendingIntent();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("enterDownloadMode")) {
            nextAction = Actions.DWLMODE;
            this.callbackContext = callbackContext;
            return true;
        } else if (action.equals("exitDownloadMode")) {
            nextAction = Actions.NMODE;
            this.callbackContext = callbackContext;
            return true;
        } else if (action.equals("readParams")) {
            nextAction = Actions.READPARAMS;
            this.callbackContext = callbackContext;
            return true;
        } else if (action.equals("writeParams")) {
            nextAction = Actions.WRITEPARAMS;
            this.callbackContext = callbackContext;
            Gson gson = new Gson();
            Config config = gson.fromJson((String)args.get(0), Config.class);
            paramsToWrite = config.serialize();
            return true;
        } else if (action.equals("cancel")) {
            nextAction = null;
            callbackContext.success();
            return true;
        } else if (action.equals("nfcAvailable")) {
            if (nfcAdapter == null) {
                callbackContext.success("false");
            } else {
                callbackContext.success("true");
            }
            return true;
        }
        return false;
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.i(LOGTAG, "Got new intent");
        if (intent.getAction().equals(NfcAdapter.ACTION_TECH_DISCOVERED)) {
            if (nextAction == null) return;
            final Tag tagFromIntent = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
            switch (nextAction) {
                case DWLMODE:
                    handleDwlModeAction(tagFromIntent);
                    break;
                case NMODE:
                    handleNormalMode(tagFromIntent);
                    break;
                case READPARAMS:
                    cordova.getThreadPool().submit(new Runnable() {
                        @Override
                        public void run() {
                            handleReadParams(tagFromIntent);
                        }
                    });
                    break;
                case WRITEPARAMS:
                    cordova.getThreadPool().submit(new Runnable() {
                        @Override
                        public void run() {
                            handleWriteParams(tagFromIntent);
                        }
                    });
            }
            nextAction = null;
        }
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        if (nfcAdapter != null) {
            if (pendingIntent == null) {
                createPendingIntent();
            }
            nfcAdapter.enableForegroundDispatch(cordova.getActivity(), pendingIntent, intentFiltersArray, techListsArray);
        }
    }

    @Override
    public void onPause(boolean multitasking) {
        super.onPause(multitasking);
        if (nfcAdapter != null) {
            nfcAdapter.disableForegroundDispatch(cordova.getActivity());
        }
    }

    private void createPendingIntent() {
        if (pendingIntent == null) {
            Activity activity = cordova.getActivity();
            Intent intent = new Intent(activity, activity.getClass());
            intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            pendingIntent = PendingIntent.getActivity(activity, 0, intent, 0);
        }
    }

    private void handleDwlModeAction(Tag tag) {
        DataDevice device = new DataDevice();
        NFCCommand.SendGetSystemInfoCommandCustom(tag, device);
        NFCCommand.SendWriteSingleBlockCommand(tag, new byte[]{0x00, 0x7f}, new byte[]{'D', 'W', 'L', (byte) 0xff}, device);
        callbackContext.success();
    }

    private void handleNormalMode(Tag tag) {
        DataDevice device = new DataDevice();
        NFCCommand.SendGetSystemInfoCommandCustom(tag, device);
        NFCCommand.SendWriteSingleBlockCommand(tag, new byte[]{0x00, 0x7f}, new byte[]{(byte) 0xff, (byte) 0xff, (byte) 0xff, (byte) 0xff}, device);
        callbackContext.success();
    }

    private void handleReadParams(Tag tag) {
        DataDevice device = new DataDevice();
        NFCCommand.SendGetSystemInfoCommandCustom(tag, device);
        byte[] response = NFCCommand.Send_several_ReadSingleBlockCommands_NbBlocks(tag, new byte[]{0x00, 0x5d}, new byte[]{0, 22}, device);
        if (response[0] != 0) {
            callbackContext.error(0);
            return;
        }
        Gson gson = new Gson();
        ByteArrayInputStream responseByteArrayInputStream = new ByteArrayInputStream(response);
        responseByteArrayInputStream.skip(1);
        DataExchange exchange = DataExchange.parse(responseByteArrayInputStream);
        String json = gson.toJson(exchange);
        callbackContext.success(json);
    }

    private void handleWriteParams(Tag tag) {
        DataDevice device = new DataDevice();
        NFCCommand.SendGetSystemInfoCommandCustom(tag, device);
        byte[] response = NFCCommand.SendWriteMultipleBlockCommand(tag, new byte[]{0x00, 0x63}, paramsToWrite, device);
        if (response[0] != 0) {
            callbackContext.error(response[0]);
        } else {
            callbackContext.success();
        }
    }
    */
}
