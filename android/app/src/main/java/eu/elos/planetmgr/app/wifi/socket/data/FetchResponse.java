package eu.elos.planetmgr.app.wifi.socket.data;


public class FetchResponse {
    private String responseText;

    public FetchResponse(String responseText) {
        this.responseText = responseText;
    }

    public FetchResponse() {
    }

    public String getResponseText() {
        return responseText;
    }

    public void setResponseText(String responseText) {
        this.responseText = responseText;
    }
}
