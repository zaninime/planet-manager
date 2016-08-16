package eu.elos.planetmgr.app.wifi.discovery;

import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.io.IOException;
import java.lang.reflect.Type;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;
import java.util.Arrays;

import eu.elos.planetmgr.app.common.JavascriptError;
import eu.elos.planetmgr.app.common.JavascriptErrorSerializer;
import eu.elos.planetmgr.app.wifi.discovery.data.Beacon;
import eu.elos.planetmgr.app.wifi.discovery.data.BeaconSerializer;

public class WifiDiscovery {
    private static final int BUFFER_LENGTH = 65536;
    private WebView webView;
    private DatagramSocket datagramSocket;
    private boolean running = false;
    private final Gson gson;

    public WifiDiscovery(WebView webView) {
        this.webView = webView;
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(JavascriptError.class, new JavascriptErrorSerializer());
        builder.registerTypeAdapter(Beacon.class, new BeaconSerializer());
        gson = builder.create();
    }

    @JavascriptInterface
    public String testing() {
        return gson.toJson(new JavascriptError(new IOException("Unable to read file: ENOSPC")));
    }

    @JavascriptInterface
    public String start(String callback) {
        if (running) return "{\"result\":\"ok\"}";
        running = true;
        try {
            datagramSocket = new DatagramSocket(55555);
            datagramSocket.setReuseAddress(true);
            datagramSocket.setSoTimeout(5000);
            datagramSocket.setBroadcast(true);
        } catch (SocketException e) {
            return gson.toJson(new JavascriptError(e));
        }
        Thread workerThread = new Thread(new WorkerTask(callback));
        workerThread.start();
        return "{\"result\":\"ok\"}";
    }

    @JavascriptInterface
    public String stop() {
        if (datagramSocket != null) datagramSocket.close();
        running = false;
        return "{\"result\":\"ok\"}";
    }

    private class WorkerTask implements Runnable {
        private String callback;

        public WorkerTask(String callback) {
            this.callback = callback;
        }

        @Override
        public void run() {
            while (running) {
                if (datagramSocket.isClosed() || !datagramSocket.isBound()) {
                    return;
                }
                DatagramPacket packet = new DatagramPacket(new byte[BUFFER_LENGTH], BUFFER_LENGTH);
                try {
                    datagramSocket.receive(packet);
                } catch (IOException e) {
                    continue;
                }
                final Beacon beacon = new Beacon(packet.getAddress().getHostAddress(), packet.getPort(), Arrays.copyOf(packet.getData(), packet.getLength()));
                webView.post(new Runnable() {
                    @Override
                    public void run() {
                        webView.evaluateJavascript(callback + "(" + gson.toJson(beacon) + ")", null);
                    }
                });
            }
        }
    }
}