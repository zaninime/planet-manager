package eu.elos.planetmgr.connector.nfc.data;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;

public class Config {
    private boolean master;
    private int id;
    private ColorSettings white, red, green, blue;
    private NightSettings night;
    private FanSettings fan;
    private ArrayList<Integer> channelMapping;

    public static Config parse(ByteArrayInputStream response) {
        Config config = new Config();
        config.white = ColorSettings.parseColor(response);
        config.red = ColorSettings.parseColor(response);
        config.green = ColorSettings.parseColor(response);
        config.blue = ColorSettings.parseColor(response);
        config.night = NightSettings.parse(response);
        config.id = response.read();
        config.fan = FanSettings.parse(response);
        config.channelMapping = new ArrayList<Integer>(12);
        for (int i = 0; i < 12; i++) {
            config.channelMapping.add(response.read());
        }
        config.master = response.read() == 0;
        return config;
    }

    public byte[] serialize() {
        ByteArrayOutputStream stream = new ByteArrayOutputStream(14 * 4 + 1);
        try {
            white.serialize().writeTo(stream);
            red.serialize().writeTo(stream);
            green.serialize().writeTo(stream);
            blue.serialize().writeTo(stream);
            night.serialize().writeTo(stream);
            stream.write(id);
            fan.serialize().writeTo(stream);
            for (int c : channelMapping) {
                stream.write((byte) c);
            }
            stream.write((byte) (master ? 0 : 1));
        } catch (IOException e) {}
        return stream.toByteArray();
    }

    public boolean isMaster() {
        return master;
    }

    public void setMaster(boolean master) {
        this.master = master;
    }

    public int getID() {
        return id;
    }

    public void setID(int id) {
        this.id = id;
    }

    public ColorSettings getWhite() {
        return white;
    }

    public void setWhite(ColorSettings white) {
        this.white = white;
    }

    public ColorSettings getRed() {
        return red;
    }

    public void setRed(ColorSettings red) {
        this.red = red;
    }

    public ColorSettings getGreen() {
        return green;
    }

    public void setGreen(ColorSettings green) {
        this.green = green;
    }

    public ColorSettings getBlue() {
        return blue;
    }

    public void setBlue(ColorSettings blue) {
        this.blue = blue;
    }

    public NightSettings getNight() {
        return night;
    }

    public void setNight(NightSettings night) {
        this.night = night;
    }

    public FanSettings getFan() {
        return fan;
    }

    public void setFan(FanSettings fan) {
        this.fan = fan;
    }

    public ArrayList<Integer> getChannelMapping() {
        return channelMapping;
    }

    public void setChannelMapping(ArrayList<Integer> channelMapping) {
        this.channelMapping = channelMapping;
    }
}
