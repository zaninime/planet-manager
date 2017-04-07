package eu.elos.planetmgr.app;

import android.app.Activity;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.transition.Fade;
import android.transition.TransitionManager;
import android.view.KeyEvent;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.FrameLayout;

import eu.elos.planetmgr.app.wifi.discovery.WifiDiscovery;
import eu.elos.planetmgr.app.wifi.socket.WifiSocket;

public class MainActivity extends AppCompatActivity {
    static final String PAGE = "file:///android_asset/web/index.html";
//    static final String PAGE = "http://192.168.2.116:3001/index.html";

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final FrameLayout rootView = (FrameLayout) findViewById(R.id.mainLayout);

        // load webview
        webView = new WebView(this);
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                if (newProgress == 100 && view.getParent() == null) {
                    Fade fade = new Fade(Fade.IN);
                    fade.setDuration(500);
                    fade.setStartDelay(500);
                    TransitionManager.beginDelayedTransition(rootView, fade);
                    rootView.addView(view);
                }
            }
        });
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setSupportZoom(false);
        settings.setAllowUniversalAccessFromFileURLs(true);

        WifiDiscovery wifiDiscovery = new WifiDiscovery(webView);
        WifiSocket wifiPlug = new WifiSocket(webView);
        webView.addJavascriptInterface(wifiDiscovery, "NativeWifiDiscovery");
        webView.addJavascriptInterface(wifiPlug, "NativeWifiSocket");

        webView.loadUrl(PAGE);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // Check if the key event was the Back button and if there's history
        final Activity mainActivity = this;

        if (keyCode == KeyEvent.KEYCODE_BACK) {
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript("cb_backbtn();", new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {
                            if (value.equals("false")) {
                                mainActivity.finish();
                            }
                        }
                    });
                }
            });
            return true;
        }
        return false;
    }
}
