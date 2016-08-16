package eu.elos.planetmgr.connector.nfc.data;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

public class FanSettings {
    private TempSettings start, max;
    private int slope;

    public FanSettings() {
        start = new TempSettings();
        max = new TempSettings();
    }

    public static FanSettings parse(ByteArrayInputStream response) {
        FanSettings settings = new FanSettings();
        TempSettings start, max;
        start = settings.getStart();
        max = settings.getMax();
        start.setTemp(response.read());
        start.setSpeed(response.read());
        settings.slope = response.read();
        max.setSpeed(response.read());
        max.setTemp(response.read());
        return settings;
    }

    public ByteArrayOutputStream serialize() {
        ByteArrayOutputStream stream = new ByteArrayOutputStream(5);
        stream.write((byte) start.getTemp());
        stream.write((byte) start.getSpeed());
        stream.write((byte) slope);
        stream.write((byte) max.getSpeed());
        stream.write((byte) max.getTemp());
        return stream;
    }

    public TempSettings getStart() {
        return start;
    }

    public void setStart(TempSettings start) {
        this.start = start;
    }

    public TempSettings getMax() {
        return max;
    }

    public void setMax(TempSettings max) {
        this.max = max;
    }

    public int getSlope() {
        return slope;
    }

    public void setSlope(int slope) {
        this.slope = slope;
    }
}

class TempSettings {
    private int temp, speed;

    public int getTemp() {
        return temp;
    }

    public void setTemp(int temp) {
        this.temp = temp;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }
}
