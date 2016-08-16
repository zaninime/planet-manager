package eu.elos.planetmgr.connector.nfc.data;

import java.io.ByteArrayInputStream;

public class DataExchange {
    private Config config;
    private Info info;

    public static DataExchange parse(ByteArrayInputStream response) {
        DataExchange dataExchange = new DataExchange();
        dataExchange.info = Info.parse(response);
        response.skip(12);
        dataExchange.config = Config.parse(response);
        return dataExchange;
    }

    public Config getConfig() {
        return config;
    }

    public void setConfig(Config config) {
        this.config = config;
    }

    public Info getInfo() {
        return info;
    }

    public void setInfo(Info info) {
        this.info = info;
    }
}
