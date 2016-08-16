package eu.elos.planetmgr.connector.nfc.data;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;


public class ColorSettings {
    private int delay, duration, intensity, slope;

    public static ColorSettings parseColor(ByteArrayInputStream response) {
        ColorSettings settings = new ColorSettings();
        int delay = response.read() * 60 + response.read();
        int duration = response.read() * 60 + response.read();
        response.skip(4);
        int intensity = response.read();
        int slope = response.read();
        settings.setDelay(delay);
        settings.setDuration(duration);
        settings.setIntensity(intensity);
        settings.setSlope(slope);
        return settings;
    }

    public ByteArrayOutputStream serialize() {
        ByteArrayOutputStream stream = new ByteArrayOutputStream(10);
        stream.write((byte) (delay / 60));
        stream.write((byte) (delay % 60));
        stream.write((byte) (duration / 60));
        stream.write((byte) (duration % 60));
        stream.write(new byte[]{0, 0, 0, 0}, 0, 4);
        stream.write((byte) intensity);
        stream.write((byte) slope);
        return stream;
    }

    public int getDelay() {
        return delay;
    }

    public void setDelay(int delay) {
        this.delay = delay;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getIntensity() {
        return intensity;
    }

    public void setIntensity(int intensity) {
        this.intensity = intensity;
    }

    public int getSlope() {
        return slope;
    }

    public void setSlope(int slope) {
        this.slope = slope;
    }
}
