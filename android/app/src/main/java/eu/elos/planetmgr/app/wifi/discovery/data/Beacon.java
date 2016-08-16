package eu.elos.planetmgr.app.wifi.discovery.data;


public class Beacon {
    private String address;
    private int port;
    private byte[] content;

    public Beacon(String address, int port, byte[] content) {
        this.address = address;
        this.port = port;
        this.content = content;
    }

    public Beacon() {
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }
}
