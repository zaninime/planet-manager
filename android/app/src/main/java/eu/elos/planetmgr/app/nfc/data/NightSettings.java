package eu.elos.planetmgr.connector.nfc.data;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

public class NightSettings {
    private int intensity;
    private String color;

    public static NightSettings parse(ByteArrayInputStream response) {
        NightSettings settings = new NightSettings();
        switch (response.read()) {
            case 1:
                settings.color = "white";
                break;
            case 2:
                settings.color = "red";
                break;
            case 3:
                settings.color = "green";
                break;
            case 0:
            case 4:
                settings.color = "blue";
                break;
            default:
                throw new NumberFormatException("Invalid color number");
        }
        settings.intensity = response.read();
        return settings;
    }

    public ByteArrayOutputStream serialize() {
        ByteArrayOutputStream stream = new ByteArrayOutputStream(2);
        if (color.equals("white")) {
            stream.write((byte) 1);
        } else if (color.equals("red")) {
            stream.write((byte) 2);
        } else if (color.equals("green")) {
            stream.write((byte) 3);
        } else if (color.equals("blue")) {
            stream.write((byte) 4);
        } else {
            throw new NumberFormatException("Invalid color name");
        }
        stream.write((byte) intensity);
        return stream;
    }

    public int getIntensity() {
        return intensity;
    }

    public void setIntensity(int intensity) {
        this.intensity = intensity;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
