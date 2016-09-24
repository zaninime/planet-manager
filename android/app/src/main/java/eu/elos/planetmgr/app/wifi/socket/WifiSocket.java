package eu.elos.planetmgr.app.wifi.socket;

import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import eu.elos.planetmgr.app.wifi.socket.data.FetchResponse;
import eu.elos.planetmgr.app.common.JavascriptError;
import eu.elos.planetmgr.app.common.JavascriptErrorSerializer;
import eu.elos.planetmgr.app.wifi.socket.data.FetchResponseSerializer;
import eu.elos.planetmgr.app.wifi.socket.data.SaveResponse;
import eu.elos.planetmgr.app.wifi.socket.data.SaveResponseSerializer;

public class WifiSocket {
    private WebView webView;
    ExecutorService executor;
    private final Gson gson;

    public WifiSocket(WebView webView) {
        this.webView = webView;
        executor = Executors.newCachedThreadPool();
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(JavascriptError.class, new JavascriptErrorSerializer());
        gsonBuilder.registerTypeAdapter(FetchResponse.class, new FetchResponseSerializer());
        gsonBuilder.registerTypeAdapter(SaveResponse.class, new SaveResponseSerializer());
        gson = gsonBuilder.create();
    }

    @JavascriptInterface
    public String fetchGeneric(String address, int port, String request, String callback) {
        executor.submit(new FetchGeneric(address, port, request, callback));
        return "{\"result\":\"ok\"}";
    }

    @JavascriptInterface
    public String saveGeneric(String address, int port, String request, String callback) {
        executor.submit(new SaveGeneric(address, port, request, callback));
        return "{\"result\":\"ok\"}";
    }

    private class FetchGeneric implements Runnable {
        private String address, request, callback;
        private int port;

        public FetchGeneric(String address, int port, String request, String callback) {
            this.address = address;
            this.port = port;
            this.request = request;
            this.callback = callback;
        }

        @Override
        public void run() {
            final String response;
            Socket socket = null;
            try {
                socket = initSocket(address, port);
                waitForHello(socket);
                OutputStream outputStream = socket.getOutputStream();
                InputStream inputStream = socket.getInputStream();
                outputStream.write(request.getBytes());
                byte[] buffer = new byte[1024];
                int read = inputStream.read(buffer);
                byte[] buffer2 = Arrays.copyOfRange(buffer, 0, read);
                response = new String(buffer2);
                socket.close();
            } catch (Exception e) {
                try {
                    if (socket != null) {
                        socket.close();
                    }
                } catch (IOException e1) {
                    // nothing
                }
                returnException(e, webView, callback);
                return;
            }
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript(callback + "(" + gson.toJson(new FetchResponse(response)) + ")", null);
                }
            });
        }
    }

    private class SaveGeneric implements Runnable {
        private String address, request, callback;
        private int port;

        public SaveGeneric(String address, int port, String request, String callback) {
            this.address = address;
            this.port = port;
            this.request = request;
            this.callback = callback;
        }

        @Override
        public void run() {
            Socket socket = null;
            try {
                socket = initSocket(address, port);
                waitForHello(socket);
                OutputStream outputStream = socket.getOutputStream();
                InputStream inputStream = socket.getInputStream();
                outputStream.write(request.getBytes());
                inputStream.read(new byte[1024]);
                socket.close();
            } catch (Exception e) {
                try {
                    if (socket != null) {
                        socket.close();
                    }
                } catch (IOException e1) {
                    // nothing
                }
                returnException(e, webView, callback);
                return;
            }
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript(callback + "(" + gson.toJson(new SaveResponse()) + ")", null);
                }
            });
        }
    }

    private void waitForHello(Socket socket) throws IOException, InvalidHandshakeException {
        String hello = "*HELLO*";
        byte[] buffer = new byte[hello.length()];
        InputStream inputStream = socket.getInputStream();
        int read = inputStream.read(buffer);
        if (read < buffer.length || !Arrays.equals(buffer, hello.getBytes())) {
            throw new InvalidHandshakeException();
        }
    }

    private Socket initSocket(String address, int port) throws IOException {
        Socket socket = new Socket(address, port);
        try {
            socket.setTcpNoDelay(true);
            socket.setSoTimeout(5000);
            socket.setSoLinger(true, 1);
        } catch (IOException e) {
            socket.close();
            throw e;
        }
        return socket;
    }

    private void returnException(Exception exception, final WebView webView, final String callback) {
        final JavascriptError error = new JavascriptError(exception);
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript(callback + "(" + gson.toJson(error) + ")", null);
            }
        });
    }
}