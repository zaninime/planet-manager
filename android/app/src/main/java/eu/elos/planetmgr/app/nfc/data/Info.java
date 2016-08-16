package eu.elos.planetmgr.connector.nfc.data;


import java.io.ByteArrayInputStream;

public class Info {
    private int hardwareVersion,
                softwareVersion,
                testYear,
                testMonth,
                productId,
                serialNo,
                operator;

    public static Info parse(ByteArrayInputStream response) {
        Info info = new Info();
        info.hardwareVersion = (response.read() << 8) | response.read();
        info.softwareVersion = (response.read() << 8) | response.read();
        info.testYear = response.read();
        info.testMonth = response.read();
        info.productId = (response.read() << 8) | response.read();
        info.serialNo = (response.read() << 16) | (response.read() << 8) | response.read();
        info.operator = response.read();
        return info;
    }
}
